import Chatbot from '#models/chatbot'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { errors as validationErrors } from '@vinejs/vine'

export default class ValidateArticleOwnership {
  async handle(ctx: HttpContext, next: NextFn) {
    const { params, request } = ctx
    const articleSlugOrId =
      params.articleSlug || request.input('articleSlug') || request.all().articleSlug
    const chatbotIdOrSlug =
      params.chatbotSlug || request.input('chatbotSlug') || request.all().chatbotSlug

    if (!articleSlugOrId) {
      throw new validationErrors.E_VALIDATION_ERROR('Article ID or slug is required.')
    }
    if (!chatbotIdOrSlug) {
      throw new validationErrors.E_VALIDATION_ERROR('Chatbot ID or slug is required.')
    }

    const chatbot = await Chatbot.getChatbotBySlugOrId(chatbotIdOrSlug)
    const isOwner = await chatbot?.validateArticleOwnership(articleSlugOrId)

    if (!isOwner) {
      return ctx.response.notFound({ success: false, message: 'Article not found' })
    }

    return next()
  }
}
