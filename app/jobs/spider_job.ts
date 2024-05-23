import { BaseJob } from 'adonis-resque'
import { PlaywrightCrawler, RequestQueue } from 'crawlee'

import { SpiderJobValidator } from '#validators/spider_job_validator'

import { extractMDFromHTML, getToken, removeQueryParams, removeTrailingSlash } from '#lib/utils'
import Article from '#models/article'
import env from '#start/env'

interface SpiderJobPayload {
  url: string
  chatbotId: string
}

export default class SpiderJob extends BaseJob {
  queueName = 'spider'

  private async crawl(payload: SpiderJobPayload, queue: RequestQueue) {
    const { url } = payload

    const crawler = new PlaywrightCrawler({
      async requestHandler({ enqueueLinks }) {
        await enqueueLinks({ strategy: 'same-domain', requestQueue: queue })
      },
    })

    await crawler.run([url])
  }

  /**
   * Base Entry point
   */
  async perform(payload: SpiderJobPayload) {
    console.log('Spider Job with payload: ', payload)
    const { url, chatbotId } = payload

    const urlHostname = new URL(url).hostname
    const urlQueue = await RequestQueue.open(urlHostname)

    try {
      const data = await SpiderJobValidator.validate(payload)
      await this.crawl(data, urlQueue)
      const { totalRequestCount, handledRequestCount, pendingRequestCount } =
        (await urlQueue.getInfo()) ?? {}
      console.log('Crawling URLs completed: ', {
        url: payload.url,
        totalRequestCount,
        handledRequestCount,
        pendingRequestCount,
      })
      const articleCrawler = new PlaywrightCrawler({
        requestQueue: urlQueue,
        maxConcurrency: env.get('MAX_CRAWLING_CONCURRENCY', 10),
        // minConcurrency: 5,
        retryOnBlocked: true,
        async requestHandler({ request, page, log }) {
          const url = request.loadedUrl || request.url
          const title = await page.title()
          if (!title) {
            log.info('No title found for: ' + url)
            return
          }
          const formattedURL = removeTrailingSlash(removeQueryParams(url))
          const existingArticle = await Article.query()
            .where('sourceUrl', formattedURL)
            .andWhere('chatbotId', chatbotId)
            .first()

          if (existingArticle) {
            console.log(
              'Article already exists for  ',
              JSON.stringify({ url: formattedURL, chatbotId }, null, 2)
            )
            return
          }

          const html = await page.content()

          log.info('Scrapping:' + JSON.stringify({ url: formattedURL, chatbotId }, null, 2))
          const markdown = await extractMDFromHTML(html)
          const contentLength = getToken(markdown).length
          await Article.create({
            title: title,
            content: markdown,
            sourceUrl: formattedURL,
            chatbotId,
            contentLength,
          })
        },
      })

      const result = await articleCrawler.run()
      const queue = await urlQueue.client.get()
      console.log('Queue:', queue)
      await urlQueue.drop()
      console.log('Crawling completed: ', result)
      return result
    } catch (error) {
      console.error(error)
    }
  }
}
