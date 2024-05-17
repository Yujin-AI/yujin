import Chatbot from '#models/chatbot'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class ValidateArticleOwnership {
  async handle(ctx: HttpContext, next: NextFn) {
    const data = ctx.request.all()
    const articleSlug = data.articleSlug || ctx.params.articleSlug
    const chatbotSlug = data.chatbotSlug || ctx.params.chatbotSlug

    const chatbot = await Chatbot.getChatbotBySlugOrId(chatbotSlug)
    const isOwner = await chatbot?.validateArticleOwnership(articleSlug)

    if (!isOwner) {
      return ctx.response.notFound({ success: false, message: 'Article not found' })
    }

    return next()
  }
}
