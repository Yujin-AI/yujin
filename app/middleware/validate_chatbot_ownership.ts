import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { errors as validationErrors } from '@vinejs/vine'

export default class ValidateChatbotOwnership {
  async handle(ctx: HttpContext, next: NextFn) {
    // const data = ctx.request.all()
    const { params, request } = ctx

    const chatbotIdOrSlug =
      params.chatbotSlug || request.input('chatbotSlug') || request.all().chatbotSlug
    if (!chatbotIdOrSlug) {
      throw new validationErrors.E_VALIDATION_ERROR('chatbot ID or slug is required.')
    }
    const chatbot = await ctx.auth.user?.validateChatbotOwnership(chatbotIdOrSlug)
    if (!chatbot) {
      return ctx.response.notFound({ success: false, message: 'Chatbot not found' })
    }
    return next()
  }
}
