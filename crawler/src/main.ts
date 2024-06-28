import { PlaywrightCrawler } from 'crawlee'
import 'dotenv/config'
import express from 'express'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {})

interface crawlPayload {
  url: string
  chatbotId: string
}

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('crawl', async (payload: crawlPayload) => {
    console.log('Crawling URL:', payload)
    const { url, chatbotId } = payload
    if (!url) {
      return socket.emit('error', "Missing 'url' query parameter")
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

        socket.emit('article', { url, title, content: final, chatbotId })
      },
      maxConcurrency: 10,
    })

    await crawler.run([url])
    crawler.requestQueue?.drop()
    console.log('Crawling completed: ', payload)
    return socket.emit('end', payload)
  })
})

const PORT = process.env.PORT || 5656

server.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
})
