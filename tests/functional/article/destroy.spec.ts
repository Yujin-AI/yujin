import { test } from '@japa/runner'

import UserFactory from '#database/factories/user_factory'
import Article from '#models/article'

test.group('Article destroy', () => {
  test('should delete an article of a chatbot by ID and article ID', async ({
    assert,
    client,
    route,
  }) => {
    const user = await UserFactory.with('ownedChatbots', 2, (chatbot) =>
      chatbot.with('articles', 3)
    ).create()

    const chatbot = user.ownedChatbots[0].serialize()
    const tempArticle = user.ownedChatbots[0].articles[0].serialize()
    const response = await client
      .delete(route('articles.destroy', { chatbotSlug: chatbot.id, articleSlug: tempArticle.id }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Article deleted successfully',
    })

    const articleInDB = await Article.find(tempArticle.id)

    assert.isNull(articleInDB)
  })
})
