import { HttpContext } from '@adonisjs/core/http'

import bindChatbot from '#decorators/bind_chatbot'
import Chatbot from '#models/chatbot'
import User from '#models/user'
import { createChatbotValidator } from '#validators/chatbot_validator'

export default class ChatbotController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.user as User
    await user.load('ownedChatbots')

    return response.ok({ success: true, data: user.ownedChatbots })
  }

  @bindChatbot()
  public async show({ response }: HttpContext, chatbot: Chatbot) {
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

  @bindChatbot()
  public async selectChatbot({ response, auth }: HttpContext, chatbot: Chatbot) {
    const user = auth.user as User

    user.defaultChatbotId = chatbot?.id ?? null
    await user.save()

    return response.json({
      success: true,
      message: 'Default chatbot selected successfully',
      data: user,
    })
  }

  @bindChatbot()
  public async update({ response }: HttpContext, chatbot: Chatbot) {
    //todo)) add validation
    // const payload = request.all()
    // chatbot.merge(payload).save()

    return response.ok({ success: true, data: chatbot })
  }

  @bindChatbot()
  public async destroy({ response }: HttpContext, chatbot: Chatbot) {
    await chatbot.delete()

    return response.json({ success: true, message: 'Chatbot deleted successfully' })
  }
}
