import { test } from '@japa/runner'

import UserFactory from '#database/factories/user_factory'
import Article from '#models/article'

test.group('Article show', () => {
  test('should get article of a chatbot by ID and article ID', async ({ client, route }) => {
    const user = await UserFactory.with('ownedChatbots', 2, (chatbot) =>
      chatbot.with('articles', 3)
    ).create()

    const chatbot = user.ownedChatbots[0].serialize()
    const tempArticle = user.ownedChatbots[0].articles[0].serialize()
    const article = await Article.find(tempArticle.id).then((article) => article?.serialize())
    const response = await client
      .get(route('articles.show', { chatbotSlug: chatbot.id, articleSlug: tempArticle.id }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: article,
    })
  })
})
