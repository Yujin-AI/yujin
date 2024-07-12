import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'

import Chatbot from '#models/chatbot'

const bindChatbot = () => (_target: any, _key: any, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response, request } = ctx

    const chatbotIdOrSlug =
      params.chatbotSlug || request.input('chatbotSlug') || request.all().chatbotSlug
    if (!chatbotIdOrSlug) {
      throw new validationErrors.E_VALIDATION_ERROR('chatbot ID or slug is required.')
    }
    try {
      const chatbot = await Chatbot.getChatbotBySlugOrId(chatbotIdOrSlug)
      if (!chatbot) {
        return response.notFound({ success: false, message: 'Chatbot not found' })
      }
      return await originalMethod.call(this, ctx, chatbot)
    } catch (error) {
      logger.error(error, 'Failed to bind chatbot.')
      return response.internalServerError({
        success: false,
        errors: error.messages || error.message || 'Chatbot not found',
      })
    }
  }
  return descriptor
}

export default bindChatbot
