import { BaseJob } from 'adonis-resque'
import { jsonToMDUsingAI } from '#lib/utils'
import Article from '#models/article'

interface ShopifyProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class ShopifyProcessorJob extends BaseJob {
  /**
   * Base Entry point
   */
  async perform(payload: ShopifyProcessorJobPayload) {
    try {
      const { url, chatbotId } = payload
      const existingArticle = await Article.query()
        .where('sourceUrl', url)
        .andWhere('chatbotId', chatbotId)
        .first()
      if (existingArticle) return

      const productRes = await fetch(`${url}.json`)
      const { product } = (await productRes.json()) as unknown as any //todo)) add proper typing

      const { ans, isEnhanced } = await jsonToMDUsingAI(product, url)

      await Article.create({
        title: product.title,
        content: ans,
        sourceUrl: url,
        chatbotId,
        isEnhanced,
      })
    } catch (error) {
      console.error(error)
    }
  }
}
