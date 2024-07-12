import type { HttpContext } from '@adonisjs/core/http'

import bindChatbot from '#decorators/bind_chatbot'
import Chatbot from '#models/chatbot'

export default class CustomerModelsController {
  @bindChatbot()
  public async index({}: HttpContext, chatbot: Chatbot) {
    const customer = await chatbot.related('customers').query()
    const customersWithAttributes = await Promise.all(
      customer.map(async (customer) => {
        const attributes = await customer.getAttributeValues()
        return { ...customer.serialize(), attributes }
      })
    )

    return { success: true, data: customersWithAttributes }
  }
}
