import { BaseJob } from 'adonis-resque'

import { ShopifyScrapePrompt } from '#lib/constants'
import { ArticleCrawlStatus } from '#lib/enums'
import { getToken } from '#lib/utils'
import Article from '#models/article'
import OpenAIService from '#services/open_ai_service'
import env from '#start/env'

interface ShopifyProcessorJobPayload {
  url: string
  chatbotId: string
}

export default class ShopifyProcessorJob extends BaseJob {
  private aiService: OpenAIService
  constructor() {
    super()
    this.aiService = new OpenAIService(env.get('AI_API_KEY'))
  }

  queueName = 'shopify_processor'

  /**
   * Base Entry point
   */
  async perform(payload: ShopifyProcessorJobPayload) {
    try {
      const { url, chatbotId } = payload
      if (url.endsWith('.json')) {
        const productURL = url.split('.json')[0]
        console.log('Scraping product: ', { url: productURL, chatbotId })

        const response = await fetch(url)

        const existingArticle = await Article.query()
          .where('sourceUrl', productURL)
          .andWhere('chatbotId', chatbotId)
          .andWhere('crawlStatus', ArticleCrawlStatus.SUCCESS)
          .first()

        if (existingArticle) {
          console.log(
            'Article already exists for  ',
            JSON.stringify({ url: productURL, chatbotId }, null, 2)
          )
          return
        }

        const { product } = (await response.json()) as unknown as any //todo)) add proper typing
        const { title, ...info } = product

        console.log('Scrapping: ', JSON.stringify({ url: productURL, title }))

        const ans = await this.aiService.ask([
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
          crawlStatus: ArticleCrawlStatus.SUCCESS,
        })
        // todo)) emit event
        return
      }
    } catch (error) {
      console.error(error)
    }
  }
}
