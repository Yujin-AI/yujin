import { Job } from '@rlanz/bull-queue'
import queue from '@rlanz/bull-queue/services/main'
import { CheerioCrawler } from 'crawlee'

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
    const shopifyURL = url + '/products.json?limit=1000'
    let response = await fetch(shopifyURL)
    return response.status === 200
  }

  private async crawl({ url, chatbotId }: SpiderJobPayload) {
    const isShopify = await this.isShopify(url)

    if (isShopify) {
      console.log('Shopify store detected')
      const response = await fetch(url + '/products.json?limit=1000')
      const products = (await response.json()) as unknown as ShopifyStoreJSON
      products.products.forEach((product) => {
        const productURL = `${url}/products/${product.handle}.json`
        queue.dispatch(
          ArticleProcessorJob,
          { url: productURL, chatbotId },
          { queueName: 'article-processor' }
        )
      })
      return
    }

    const crawler = new CheerioCrawler({
      async requestHandler({ enqueueLinks, request }) {
        const { url, loadedUrl } = request
        const validURL = loadedUrl ? loadedUrl : url

        console.log(validURL, ' --> sent to article processor job')
        queue.dispatch(
          ArticleProcessorJob,
          { url: validURL, chatbotId },
          { queueName: 'article-processor' }
        )

        await enqueueLinks({ baseUrl: url })
      },
    })

    await crawler.run([url])
  }

  /**
   * Base Entry point
   */
  async handle(payload: SpiderJobPayload) {
    console.log('Spider Job with payload: ', payload)
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
