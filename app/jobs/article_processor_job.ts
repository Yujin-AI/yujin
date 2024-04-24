import { ArticleCrawlStatus } from '#lib/enums'
import Article from '#models/article'
import { Job } from '@rlanz/bull-queue'

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
      if (url.includes('.json')) {
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
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}
