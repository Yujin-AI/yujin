import app from '@adonisjs/core/services/app'
import { BaseJob } from 'adonis-resque'

import Article from '#models/article'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

interface EmbeddingArticlesJobPayload {
  articleId: string
}

export default class EmbeddingArticlesJob extends BaseJob {
  queueName = 'embedding_articles'
  async perform(payload: EmbeddingArticlesJobPayload) {
    const { articleId } = payload
    logger.info(`Embedding Articles with id: ${articleId}`)

    const article = await Article.find(articleId)
    if (!article) {
      logger.info('Article not found')
      return
    }

    const typesense = await app.container.make('typesense')

    await typesense.collections(env.get('TYPESENSE_COLLECTION', 'articles')).documents().upsert({
      id: article.id,
      title: article.title,
      content: article.content,
      sourceUrl: article.sourceUrl,
      chatbotId: article.chatbotId,
      createdAt: article.createdAt.toMillis(),
      updatedAt: article.updatedAt.toMillis(),
    })
  }
}
