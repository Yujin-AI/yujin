import type { HttpContext } from '@adonisjs/core/http'

import bindChatbot from '#decorators/bind_chatbot'
import Chatbot from '#models/chatbot'
import Customer from '#models/customer'
import { createConversationValidation } from '#validators/conversation_validator'

export default class ConversationModelsController {
  public async index({}: HttpContext) {
    return 'Hello'
  }

  public async show({}: HttpContext) {
    return 'Hello'
  }

  @bindChatbot()
  public async store({ request, response }: HttpContext, chatbot: Chatbot) {
    const { sessionId, customerId, customerName, customerAttributes } = await request.validateUsing(
      createConversationValidation
    )

    // todo)) add constrains
    // sessionId and customerId should be unique for each chatbot
    // a customer can have multiple sessions/conversations
    // a customer can have multiple attributes
    // a session/conversation can not have multiple customers or customerIds

    // Find or create a customer
    const customer = await Customer.firstOrCreate(
      {
        chatbotId: chatbot.id,
        externalId: customerId,
      },
      {
        name: customerName,
      }
    )

    // Attach customer attributes
    if (customerAttributes) await customer.findOrCreateAttributeValue(customerAttributes)

    // Create a conversation
    await customer.related('conversations').create({
      sessionId,
      chatbotId: chatbot.id,
    })

    const conversation = await customer
      .related('conversations')
      .query()
      .where('session_id', sessionId)
      .where('chatbot_id', chatbot.id)
      .firstOrFail()

    response.created({ success: true, data: conversation })
  }
}
