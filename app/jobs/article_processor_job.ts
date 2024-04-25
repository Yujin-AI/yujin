import { Job } from '@rlanz/bull-queue'
import { PlaywrightCrawler } from 'crawlee'

import { ArticleCrawlStatus } from '#lib/enums'
import Article from '#models/article'

interface ArticleProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class ArticleProcessorJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: ArticleProcessorJobPayload) {
    try {
      const { url, chatbotId } = payload
      if (url.endsWith('.json')) {
        const response = await fetch(url)
        const { product } = (await response.json()) as unknown as any //todo)) add proper typing
        const { title, ...info } = product

        const productURL = url.split('.json')[0]

        await Article.create({
          title,
          content: info,
          sourceUrl: productURL,
          chatbotId,
          crawlStatus: ArticleCrawlStatus.SUCCESS,
        })
        // todo)) emit event
        return
      }
      // run normal crawler for html

      const crawler = new PlaywrightCrawler({
        // Use the requestHandler to process each of the crawled pages.
        async requestHandler({ page, request }) {
          const title = await page.title()
          console.log('Scrapping: ', JSON.stringify({ url: request.url, title }))

          const content = await page.content()
          await Article.create({
            title,
            content,
            sourceUrl: request.url,
            chatbotId,
            crawlStatus: ArticleCrawlStatus.SUCCESS,
          })
        },
      })

      // Add first URL to the queue and start the crawl.
      await crawler.run([url])
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}
