import { HttpContext } from '@adonisjs/core/http'
import queue from '@rlanz/bull-queue/services/main'

import SpiderJob from '#jobs/spider_job'
import Chatbot from '#models/chatbot'
import User from '#models/user'
import { createChatbotValidator } from '#validators/chatbot_validator'

export default class ChatbotController {
  public async index({ inertia, auth }: HttpContext) {
    const user = auth.user as User
    await user.load('ownedChatbots')

    return inertia.render('chatbots/index', {
      chatbots: user.ownedChatbots,
      defaultChatbotId: user.defaultChatbotId,
    })
  }

  public async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createChatbotValidator)
    console.log('store', payload)
    const chatbot = await Chatbot.create({
      ...payload,
      ownerId: auth.user?.id,
      creatorId: auth.user?.id,
    })
    await chatbot.save()

    queue.dispatch(SpiderJob, { chatbotId: chatbot.id, url: payload.url })

    return response.redirect('/dashboard')
  }

  public async selectChatbot({ request, response, auth }: HttpContext) {
    const { chatbotId } = request.all()
    const user = auth.user as User
    user.defaultChatbotId = chatbotId
    await user.save()

    return response.redirect('/dashboard')
  }
}
