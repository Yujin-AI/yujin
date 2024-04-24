import { Job } from '@rlanz/bull-queue'
import queue from '@rlanz/bull-queue/services/main'

import { ShopifyStoreJSON } from '#lib/types'
import { SpiderJobValidator } from '#validators/spider_job_validator'
import ArticleProcessorJob from './article_processor_job.js'

interface SpiderJobPayload {
  url: string
  chatbotId: string
}

export default class SpiderJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  private async isShopify(url: string) {
    let response = await fetch(url + '/products.json?limit=1000')
    if (response.status === 200) return true

    return false
  }

  private async crawl({ url, chatbotId }: SpiderJobPayload) {
    console.log(`Crawling ${url}`)
    const isShopify = await this.isShopify(url)
    if (isShopify) {
      const response = await fetch(url + '/products.json?limit=1000')
      const products = (await response.json()) as unknown as ShopifyStoreJSON
      products.products.forEach((product) => {
        const productURL = `${url}/products/${product.handle}.json`
        queue.dispatch(ArticleProcessorJob, { url: productURL, chatbotId })
      })
      // queue.dispatch(ArticleProcessorJob, )
    }
  }

  /**
   * Base Entry point
   */
  async handle(payload: SpiderJobPayload) {
    console.log('SpiderJob.handle', payload)
    try {
      const data = await SpiderJobValidator.validate(payload)
      await this.crawl(data)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}