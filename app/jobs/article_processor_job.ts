import { BaseJob } from 'adonis-resque'
import { CrawlData } from '#lib/types'
import { getToken, reformMDUsingAI } from '#lib/utils'
import Article from '#models/article'

export default class ArticleProcessorJob extends BaseJob {
  queueName = 'article_processor'

  async perform(payload: CrawlData) {
    const { content, chatbotId, url, title } = payload

    //if article exists then skip
    const existingArticle = await Article.query()
      .where('sourceUrl', url)
      .andWhere('chatbotId', chatbotId)
      .first()

    if (existingArticle) return
    let markdown: string

    try {
      markdown = await reformMDUsingAI(content)
    } catch (error) {
      console.error('Error extracting markdown using AI:', error)
      markdown = content
    }
    const contentLength = getToken(markdown).length
    await Article.create({
      title: title,
      content: markdown,
      sourceUrl: url,
      chatbotId,
      contentLength,
    })
  }
}
