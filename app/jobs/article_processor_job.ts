import { BaseJob } from 'adonis-resque'

import { CrawlData } from '#lib/types'
import { reformMDUsingAI } from '#lib/utils'
import Article from '#models/article'

export default class ArticleProcessorJob extends BaseJob {
  async perform(payload: CrawlData) {
    const { content, chatbotId, url, title } = payload

    const existingArticle = await Article.query()
      .where('sourceUrl', url)
      .andWhere('chatbotId', chatbotId)
      .first()
    if (existingArticle) return

    const { ans, isEnhanced } = await reformMDUsingAI(content)

    await Article.create({
      title: title,
      content: ans,
      sourceUrl: url,
      chatbotId,
      isEnhanced,
    })
  }
}
