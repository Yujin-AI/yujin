import type { HttpContext } from '@adonisjs/core/http'

export default class ArticlesController {
  public async index({ inertia, params, auth, response }: HttpContext) {
    const isValid = auth.user?.validateChatbotOwnership(params.chatbotSlug)
    if (!isValid) {
      return response.redirect('/dashboard')
    }

    return inertia.render('articles/index')
  }
}
