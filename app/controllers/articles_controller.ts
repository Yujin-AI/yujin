import Article from '#models/article'
import type { HttpContext } from '@adonisjs/core/http'

export default class ArticlesController {
  public async showArticles({ inertia, params, auth, response }: HttpContext) {
    const chatbot = await auth.user?.validateChatbotOwnership(params.chatbotSlug)
    if (!chatbot) {
      return response.redirect('/dashboard')
    }

    const articles = await Article.query().where('chatbotId', chatbot.id)

    return inertia.render('articles/index', { articles, chatbot, user: auth.user })
  }

  public async showArticle({ inertia, params, auth, response }: HttpContext) {
    const chatbot = await auth.user?.validateChatbotOwnership(params.chatbotSlug)
    if (!chatbot) {
      return response.redirect('/dashboard')
    }

    const article = await Article.query()
      .where('chatbotId', chatbot.id)
      .andWhere('slug', params.articleSlug)
      .first()

    return inertia.render('articles/show', { article, chatbot, user: auth.user })
  }

  public async apiArticles({ response, params, auth }: HttpContext) {
    const chatbot = await auth.user?.validateChatbotOwnership(params.chatbotSlug)
    if (!chatbot) {
      return response.status(403)
    }

    const articles = await Article.query().where('chatbotId', chatbot.id)

    return response.json(articles)
  }
}
