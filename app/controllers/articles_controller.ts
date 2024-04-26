import Article from '#models/article'
import type { HttpContext } from '@adonisjs/core/http'

export default class ArticlesController {
  public async showArticles({ inertia, params, auth, response, request }: HttpContext) {
    const chatbot = await auth.user?.validateChatbotOwnership(params.chatbotSlug)
    if (!chatbot) {
      return response.redirect('/dashboard')
    }

    const { page } = request.qs()

    const articles = await Article.query()
      .where('chatbotId', chatbot.id)
      .orderBy('createdAt', 'desc')
      .paginate(page || 1, 10)

    console.log('articles', articles)

    return inertia.render('articles/index', { articles: articles, chatbot })
  }
}
