import { BaseJob } from 'adonis-resque'
import { PlaywrightCrawler, RequestQueue } from 'crawlee'

import { SpiderJobValidator } from '#validators/spider_job_validator'

import { ArticleCrawlStatus } from '#lib/enums'
import { extractMDFromHTML, getToken, removeQueryParams, removeTrailingSlash } from '#lib/utils'
import Article from '#models/article'

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
      console.log('Crawling URLs completed: ', {
        url: payload.url,
        estimatedCount: urlQueue.getTotalCount(),
      })
      const articleCrawler = new PlaywrightCrawler({
        requestQueue: urlQueue,
        maxConcurrency: 10,
        retryOnBlocked: true,
        async requestHandler({ request, page, log }) {
          const url = request.loadedUrl || request.url
          const formattedURL = removeTrailingSlash(removeQueryParams(url))
          const existingArticle = await Article.query()
            .where('sourceUrl', formattedURL)
            .andWhere('chatbotId', chatbotId)
            .andWhere('crawlStatus', ArticleCrawlStatus.SUCCESS)
            .first()

          if (existingArticle) {
            console.log(
              'Article already exists for  ',
              JSON.stringify({ url: formattedURL, chatbotId }, null, 2)
            )
            return
          }

          const html = await page.content()

          log.info('Scrapping:' + { url: formattedURL, chatbotId })
          const markdown = await extractMDFromHTML(html)
          const contentLength = getToken(markdown).length
          await Article.create({
            title: await page.title(),
            content: markdown,
            sourceUrl: formattedURL,
            chatbotId,
            contentLength,
            crawlStatus: ArticleCrawlStatus.SUCCESS,
          })
        },
      })

      await articleCrawler.run()
    } catch (error) {
      console.error(error)
    }
  }
}
