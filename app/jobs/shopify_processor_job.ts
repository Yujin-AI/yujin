import { BaseJob } from 'adonis-resque'

import { ShopifyScrapePrompt } from '#lib/constants'
import { getToken } from '#lib/utils'
import Article from '#models/article'
import OpenAIService from '#services/open_ai_service'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

interface ShopifyProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class ShopifyProcessorJob extends BaseJob {
  queueName = 'shopify_processor'
  private aiService: OpenAIService

  constructor() {
    super()
    //todo)) shift to ai provider
    this.aiService = new OpenAIService(env.get('AI_API_KEY'))
  }

  /**
   * Base Entry point
   */
  async perform(payload: ShopifyProcessorJobPayload) {
    try {
      const { url, chatbotId } = payload
      if (url.endsWith('.json')) {
        const productURL = url.split('.json')[0]

        const response = await fetch(url)

        const existingArticle = await Article.query()
          .where('sourceUrl', productURL)
          .andWhere('chatbotId', chatbotId)
          .first()

        if (existingArticle) {
          logger.info(
            'Article already exists for  ',
            JSON.stringify({ url: productURL, chatbotId }, null, 2)
          )
          return
        }

        const { product } = (await response.json()) as unknown as any //todo)) add proper typing
        const { title, ...info } = product
        logger.info(
          'Scraping product: ',
          JSON.stringify({ url: productURL, chatbotId, title }, null, 2)
        )

        const ans = await this.aiService.askWithContext([
          {
            role: 'system',
            content: ShopifyScrapePrompt.replace('{{title}}', title).replace('{{url}}', productURL),
          },
          {
            role: 'user',
            content: JSON.stringify({
              title,
              content: info,
            }),
          },
        ])
        const contentLength = getToken(ans).length

        await Article.create({
          title,
          content: ans,
          sourceUrl: productURL,
          chatbotId,
          contentLength,
        })
        // todo)) emit event
        return
      }
    } catch (error) {
      console.error(error)
    }
  }
}
