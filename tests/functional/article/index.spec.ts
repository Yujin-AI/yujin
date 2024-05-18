import { test } from '@japa/runner'

import UserFactory from '#database/factories/user_factory'
import Article from '#models/article'

test.group('Article index', () => {
  test('should get all articles of a chatbot by ID', async ({ client, route }) => {
    const user = await UserFactory.with('ownedChatbots', 2, (chatbot) =>
      chatbot.with('articles', 3)
    ).create()

    const chatbot = user.ownedChatbots[0].serialize()
    const articles = Article.findBy('chatbotId', chatbot.id)
    const response = await client
      .get(route('articles.index', { chatbotSlug: chatbot.id }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: [articles],
    })
  })
})
