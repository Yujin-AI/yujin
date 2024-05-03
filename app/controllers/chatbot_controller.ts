import { HttpContext } from '@adonisjs/core/http'

import SpiderJob from '#jobs/spider_job'
import Chatbot from '#models/chatbot'
import User from '#models/user'
import { createChatbotValidator } from '#validators/chatbot_validator'

export default class ChatbotController {
  public async index({ auth }: HttpContext) {
    const user = auth.user as User
    await user.load('ownedChatbots')

    return user.ownedChatbots
  }

  public async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createChatbotValidator)
    const chatbot = await Chatbot.create({
      ...payload,
      ownerId: auth.user?.id,
      creatorId: auth.user?.id,
    })
    await chatbot.save()

    // queue.dispatch(SpiderJob, { chatbotId: chatbot.id, url: payload.url }, { queueName: 'spider' })
    await SpiderJob.enqueue({ chatbotId: chatbot.id, url: payload.url })

    return response.json(chatbot)
  }

  public async selectChatbot({ request, response, auth }: HttpContext) {
    const { chatbotId } = request.all()
    const user = auth.user as User
    user.defaultChatbotId = chatbotId
    await user.save()

    return response.redirect('/dashboard')
  }

  public async delete({ params, response, auth }: HttpContext) {
    const chatbot = await auth.user?.validateChatbotOwnership(params.chatbotSlug)
    if (!chatbot) {
      return response.redirect('/dashboard')
    }

    await chatbot.delete()

    return response.redirect('/dashboard')
  }
}
