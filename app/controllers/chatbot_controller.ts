import { HttpContext } from '@adonisjs/core/http'

import Chatbot from '#models/chatbot'
import User from '#models/user'
import { createChatbotValidator, selectChatbotValidator } from '#validators/chatbot_validator'

export default class ChatbotController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.user as User
    await user.load('ownedChatbots')

    return response.ok({ success: true, data: user.ownedChatbots })
  }

  public async show({ params, response }: HttpContext) {
    const chatbot = await Chatbot.getChatbotBySlugOrId(params.chatbotSlug)

    return response.ok({ success: true, data: chatbot })
  }

  public async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createChatbotValidator)
    const chatbot = await Chatbot.create({
      ...payload,
      ownerId: auth.user?.id,
      creatorId: auth.user?.id,
    })
    await chatbot.save()

    //todo)) add dispatch job
    // await SpiderJob.enqueue({ chatbotId: chatbot.id, url: payload.url })

    return response.created({
      success: true,
      message: 'Chatbot created successfully',
      data: chatbot,
    })
  }

  public async selectChatbot({ request, response, auth }: HttpContext) {
    const { chatbotSlug } = await request.validateUsing(selectChatbotValidator)
    const user = auth.user as User
    const chatbot = await Chatbot.getChatbotBySlugOrId(chatbotSlug)

    user.defaultChatbotId = chatbot?.id ?? null
    await user.save()

    return response.json({
      success: true,
      message: 'Default chatbot selected successfully',
      data: user,
    })
  }

  public async delete({ params, response }: HttpContext) {
    const chatbot = await Chatbot.getChatbotBySlugOrId(params.chatbotSlug)

    await chatbot?.delete()

    return response.json({ success: true, message: 'Chatbot deleted successfully' })
  }
}
