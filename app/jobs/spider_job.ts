import env from '#start/env'
import { BaseJob } from 'adonis-resque'

interface SpiderJobPayload {
  url: string
  chatbotId: string
}

export default class SpiderJob extends BaseJob {
  queueName = 'spider'

  /**
   * Base Entry point
   */
  async perform(payload: SpiderJobPayload) {
    console.log('Spider Job with payload: ', payload)
    const { url } = payload

    // const urlHostname = new URL(url).hostname
    // const urlQueue = await RequestQueue.open(urlHostname)

    try {
      //   const data = await SpiderJobValidator.validate(payload)
      // await this.crawl(data, urlQueue)
      // const { totalRequestCount, handledRequestCount, pendingRequestCount } =
      //   (await urlQueue.getInfo()) ?? {}
      // console.log('Crawling URLs completed: ', {
      //   url: payload.url,
      //   totalRequestCount,
      //   handledRequestCount,
      //   pendingRequestCount,
      // })
      // const articleCrawler = new PlaywrightCrawler({
      //   requestQueue: urlQueue,
      //   maxConcurrency: env.get('MAX_CRAWLING_CONCURRENCY', 10),
      //   // minConcurrency: 5,
      //   retryOnBlocked: true,
      //   async requestHandler({ request, page, log }) {
      //     const url = request.loadedUrl || request.url
      //     const title = await page.title()
      //     if (!title) {
      //       log.info('No title found for: ' + url)
      //       return
      //     }
      //     const formattedURL = removeTrailingSlash(removeQueryParams(url))
      //     const existingArticle = await Article.query()
      //       .where('sourceUrl', formattedURL)
      //       .andWhere('chatbotId', chatbotId)
      //       .first()

      //     if (existingArticle) {
      //       console.log(
      //         'Article already exists for  ',
      //         JSON.stringify({ url: formattedURL, chatbotId }, null, 2)
      //       )
      //       return
      //     }

      //     const html = await page.content()

      //     log.info('Scrapping:' + JSON.stringify({ url: formattedURL, chatbotId }, null, 2))
      //     const markdown = await extractMDFromHTML(html)
      //     const contentLength = getToken(markdown).length
      //     await Article.create({
      //       title: title,
      //       content: markdown,
      //       sourceUrl: formattedURL,
      //       chatbotId,
      //       contentLength,
      //     })
      //   },
      // })

      // const result = await articleCrawler.run()
      // const queue = await urlQueue.client.get()
      // console.log('Queue:', queue)
      // await urlQueue.drop()
      // console.log('Crawling completed: ', result)
      // return result
      const crawlURL = env.get('CRAWLER_API') + '?url=' + url
      console.log('Crawling URL: ', crawlURL)
      const response = await fetch(crawlURL)

      const stream = response.body!

      let count = 0
      const reader = stream.getReader()
      const decoder = new TextDecoder()

      let buffer = ``
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const boundary = buffer.lastIndexOf(`\n`)
        if (boundary !== -1) {
          const completeData = buffer.substring(0, boundary)
          buffer = buffer.substring(boundary + 1)

          completeData.split(`\n`).forEach((chunk) => {
            if (chunk) {
              try {
                const jsonObj = JSON.parse(chunk)
                // Yay! Do what you want with your JSON here!
                console.log('jsonObj', jsonObj)
              } catch (e) {
                console.error(`Error parsing JSON:`, e)
              }
            }
          })
        }
      }

      console.log('articles found:', count)

      // while (true) {
      //   const { done, value } = await reader.read()
      //   if (done) break
      //   console.log('done', done)
      //   // console.log('value', value)

      //   const chunk = decoder.decode(value, { stream: true })
      //   console.log('chunk', JSON.parse(chunk))

      //   // let lines = partialChunk.split('\n')
      //   // partialChunk = lines.pop()! // Save the last incomplete line

      //   // for (let line of lines) {
      //   //   if (line) {
      //   //     const parsedData = JSON.parse(line)
      //   //     console.log('for loop', parsedData)
      //   //     // Handle parsedData (e.g., display it on the UI)
      //   //   }
      //   // }
      // }

      // if (partialChunk) {
      //   const parsedData = JSON.parse(partialChunk)
      //   console.log('partialChunk', parsedData)
      //   // Handle parsedData (e.g., display it on the UI)
      // }
      // console.log('Crawling completed: ', data)
    } catch (error) {
      console.error(error)
    }
  }
}
