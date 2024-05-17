import type { HttpContext } from '@adonisjs/core/http'

import bindArticle from '#decorators/bind_article'
import bindChatbot from '#decorators/bind_chatbot'
import { ArticleSourceType } from '#lib/enums'
import Article from '#models/article'
import Chatbot from '#models/chatbot'
import { createArticleValidator, updateArticleValidator } from '#validators/article_validator'

export default class ArticlesController {
  @bindChatbot()
  public async index({ response }: HttpContext, chatbot: Chatbot) {
    const articles = await Article.query().where('chatbotId', chatbot.id)
    return response.ok({ success: true, data: articles })
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
    article.merge(payload).save()
    return response.ok({ success: true, data: article })
  }

  @bindArticle()
  public async destroy({ response }: HttpContext, article: Article) {
    await article.delete()
    return response.json({ success: true, message: 'Article deleted successfully' })
  }
}
