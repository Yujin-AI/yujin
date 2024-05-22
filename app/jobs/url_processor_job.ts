import { ShopifyStoreJSON } from '#lib/types'
import { BaseJob } from 'adonis-resque'
import ShopifyProcessorJob from './shopify_processor_job.js'
import SpiderJob from './spider_job.js'

interface URLProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class URLProcessorJob extends BaseJob {
  queueName = 'url_processor'

  private async isShopify(url: string) {
    const shopifyURL = url + '/products.json?limit=1000'
    let response = await fetch(shopifyURL)
    return response.status === 200
  }

  async perform(payload: URLProcessorJobPayload) {
    const { url, chatbotId } = payload
    const isShopify = await this.isShopify(url)
    if (isShopify) {
      console.log('Shopify store detected: ', url)
      const response = await fetch(url + '/products.json?limit=1000')
      const products = (await response.json()) as unknown as ShopifyStoreJSON
      products.products.forEach(async (product) => {
        const productURL = `${url}/products/${product.handle}.json`
        await ShopifyProcessorJob.enqueue({ url: productURL, chatbotId })
      })
      return
    }
    await SpiderJob.enqueue({ url, chatbotId })
  }
}
