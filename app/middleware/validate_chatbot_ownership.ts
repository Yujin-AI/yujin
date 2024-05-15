import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class ValidateChatbotOwnership {
  async handle(ctx: HttpContext, next: NextFn) {
    const data = ctx.request.all()
    const chatbotSlug = data.chatbotSlug || ctx.params.chatbotSlug
    const chatbot = await ctx.auth.user?.validateChatbotOwnership(chatbotSlug)
    if (!chatbot) {
      return ctx.response.notFound({ success: false, message: 'Chatbot not found' })
    }
    return next()
  }
}
