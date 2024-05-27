// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from 'crawlee'
import 'dotenv/config'
import express from 'express'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

const app = express()

app.get('/', async (req, res) => {
  const { url } = req.query as { url: string }

  if (!url) {
    return res.status(400).send("Missing 'url' query parameter")
  }

  const crawler = new PlaywrightCrawler({
    requestHandler: async ({ request, page, enqueueLinks }) => {
      await enqueueLinks({ strategy: 'same-hostname' })
      const url = request.loadedUrl || request.url

      console.log('Crawling URL:', url)
      const title = await page.title()
      if (!title) return
      const content = await page.content()
      const dom = new JSDOM(content)

      const { document } = dom.window

      function removeElementsBySelector(selector: string): void {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el) => el.remove())
      }

      removeElementsBySelector('script')
      removeElementsBySelector('nav')
      removeElementsBySelector('footer')
      removeElementsBySelector('[class*="footer"]')
      removeElementsBySelector('[id*="footer"]')
      removeElementsBySelector('.footer')
      removeElementsBySelector('#footer')
      removeElementsBySelector('iframe')
      removeElementsBySelector('noscript')
      removeElementsBySelector('header')
      removeElementsBySelector('svg')

      const allElements = document.querySelectorAll('body *')
      allElements.forEach((el) => {
        if (!el.textContent?.trim()) {
          el.remove()
        }
      })
      const finalHTML: string = document.body.innerHTML.trim()

      const turndown = new TurndownService()

      const final = turndown.turndown(finalHTML)

      const chunk = JSON.stringify({ url, title, content: final }) + '\n'
      res.write(chunk)
    },
    maxConcurrency: 10,
  })

  res.setHeader('Content-Type', 'application/json')
  await crawler.run([url])
  crawler.requestQueue?.drop()
  console.log('Crawling completed')
  return res.end()
})
const PORT = process.env.PORT || 5656

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
})
