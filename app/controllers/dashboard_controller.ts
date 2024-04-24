import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async dashboard({ auth, response }: HttpContext) {
    await auth.user?.load('defaultChatbot')
    await auth.user?.load('ownedChatbots')

    const user = auth.user as User
    if (!user.defaultChatbot) {
      return response.redirect('/chatbots')
    }

    return response.redirect(`/${user.defaultChatbot?.slug}/dashboard`)
  }

  public async showDashboard({ inertia, auth, params, response }: HttpContext) {
    await auth.user?.load('ownedChatbots')
    const chatbot = auth.user?.ownedChatbots.find((chatbot) => chatbot.slug === params.chatbotSlug)
    if (!chatbot) {
      return response.redirect('/dashboard')
    }
    return inertia.render('dashboard', { chatbot })
  }
}
