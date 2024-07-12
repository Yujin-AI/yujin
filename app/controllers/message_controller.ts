import type { HttpContext } from '@adonisjs/core/http'

import bindChatbot from '#decorators/bind_chatbot'
import bindConversation from '#decorators/bind_conversation'
import Chatbot from '#models/chatbot'
import Conversation from '#models/conversation'
import { createMessageValidator } from '#validators/message_validation'
import Yujin from '#lib/yujin'
import { MessageSenderType } from '#lib/enums'

export default class MessageController {
  @bindChatbot()
  public async index({}: HttpContext, chatbot: Chatbot) {
    return chatbot
  }

  public async show({}: HttpContext) {
    return 'Hello'
  }

  // @bindGeneric(Chatbot, Conversation)
  @bindConversation()
  public async store({ request, response }: HttpContext, conversation: Conversation) {
    const { message } = await request.validateUsing(createMessageValidator)
    // stream back the message
    const yujin = await new Yujin(conversation.id).init()

    let stream = await yujin.ask(message)

    if (typeof stream === 'string') {
      return response.send(stream)
    }

    let ans = ''

    for await (const chunk of stream) {
      ans += chunk.choices[0]?.delta?.content ?? ''
      response.response.write(chunk.choices[0]?.delta?.content ?? '')
    }

    await conversation.related('messages').create({
      content: ans,
      senderType: MessageSenderType.YUJIN,
    })

    response.response.end()
  }
}
