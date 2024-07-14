import app from '@adonisjs/core/services/app'
import { BaseJob } from 'adonis-resque'
import logger from '@adonisjs/core/services/logger'
import { ShopifyStoreJSON } from '#lib/types'
import ShopifyProcessorJob from '#jobs/shopify_processor_job'

interface URLProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class URLProcessorJob extends BaseJob {
  async perform(payload: URLProcessorJobPayload) {
    const { url, chatbotId } = payload
    const isShopify = await this.isShopify(url)
    if (!isShopify) {
      const crawler = await app.container.make('crawler')
      crawler.emit('crawl', { url, chatbotId })
      return
    }
    logger.info('Shopify store detected: ', url)
    let page = 1
    let totalProducts = 0
    while (true) {
      const response = await fetch(url + '/products.json?limit=250' + '&page=' + page)

      const { products } = (await response.json()) as unknown as ShopifyStoreJSON
      totalProducts += products.length

      if (products.length === 0) {
        break
      }

      for (const product of products) {
        const productURL = `${url}/products/${product.handle}`
        await ShopifyProcessorJob.enqueue({ url: productURL, chatbotId })
      }
      page++
    }

    logger.info(`Total products in store: `, {
      url,
      totalProducts,
      chatbotId,
    })
  }

  private async isShopify(url: string) {
    const shopifyURL = url + '/products.json?limit=1'
    let response = await fetch(shopifyURL)
    return response.status === 200
  }
}
