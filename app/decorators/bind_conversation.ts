import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'

import Conversation from '#models/conversation'

const bindConversation =
  () => (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (this: any, ctx: HttpContext) {
      const { params, response, request } = ctx

      const conversationId =
        params.conversationId || request.input('conversationId') || request.all().conversationId
      if (!conversationId) {
        throw new validationErrors.E_VALIDATION_ERROR('conversation ID is required.')
      }
      try {
        const conversation = await Conversation.query().where('id', conversationId).first()
        if (!conversation) {
          return response.notFound({ success: false, message: 'conversation not found' })
        }
        return await originalMethod.call(this, ctx, conversation)
      } catch (error) {
        logger.error(error, 'Failed to bind conversation.')

        return response.internalServerError({
          success: false,
          errors: error.messages || error.message || 'conversation not found',
        })
      }
    }
  }

export default bindConversation
