import { BaseJob } from 'adonis-resque'
import app from '@adonisjs/core/services/app'

import { ShopifyStoreJSON } from '#lib/types'

import logger from '@adonisjs/core/services/logger'
import ShopifyProcessorJob from './shopify_processor_job.js'

interface URLProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class URLProcessorJob extends BaseJob {
  queueName = 'url_processor'

  async perform(payload: URLProcessorJobPayload) {
    // todo)) fix shopify in shopify_processor_job
    const { url, chatbotId } = payload
    const isShopify = await this.isShopify(url)
    if (isShopify) {
      logger.info('Shopify store detected: ', url)
      const response = await fetch(url + '/products.json?limit=1000')
      const products = (await response.json()) as unknown as ShopifyStoreJSON
      products.products.forEach(async (product) => {
        const productURL = `${url}/products/${product.handle}.json`
        await ShopifyProcessorJob.enqueue({ url: productURL, chatbotId })
      })
      return
    }
    const crawler = await app.container.make('crawler')
    crawler.emit('crawl', { url, chatbotId })
  }

  private async isShopify(url: string) {
    const shopifyURL = url + '/products.json?limit=1000'
    let response = await fetch(shopifyURL)
    return response.status === 200
  }
}
