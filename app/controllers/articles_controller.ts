import type { HttpContext } from '@adonisjs/core/http'

import bindArticle from '#decorators/bind_article'
import bindChatbot from '#decorators/bind_chatbot'
import { ArticleSourceType } from '#lib/enums'
import Article from '#models/article'
import Chatbot from '#models/chatbot'
import { createArticleValidator, updateArticleValidator } from '#validators/article_validator'

export default class ArticlesController {
  @bindChatbot()
  public async index({ request, response }: HttpContext, chatbot: Chatbot) {
    const page = request.input('page', 1)
    let limit = request.input('limit', 10)
    limit = limit > 50 ? 50 : limit
    const articles = await Article.query().where('chatbotId', chatbot.id).paginate(page, limit)

    return response.ok({ success: true, ...articles.toJSON() })
  }

  @bindArticle()
  public async show({ response }: HttpContext, article: Article) {
    return response.ok({ success: true, data: article })
  }

  @bindChatbot()
  public async store({ request, response }: HttpContext, chatbot: Chatbot) {
    const payload = await request.validateUsing(createArticleValidator)

    const article = await Article.create({
      ...payload,
      sourceType: ArticleSourceType.MANUAL,
      chatbotId: chatbot.id,
    })
    await article.save()

    return response.created({
      success: true,
      message: 'Article created successfully',
      data: article,
    })
  }

  @bindArticle()
  public async update({ response, request }: HttpContext, article: Article) {
    const payload = await request.validateUsing(updateArticleValidator)
    await article.merge(payload).save()
    return response.ok({ success: true, data: article })
  }

  @bindArticle()
  public async destroy({ response }: HttpContext, article: Article) {
    await article.delete()
    return response.json({ success: true, message: 'Article deleted successfully' })
  }

  @bindChatbot()
  public async massDestroy({ request }: HttpContext, chatbot: Chatbot) {
    const ids = request.input('ids', [])
    await Article.query().where('chatbotId', chatbot.id).whereIn('id', ids).delete()
    return { success: true, message: 'Articles deleted successfully' }
  }
}
