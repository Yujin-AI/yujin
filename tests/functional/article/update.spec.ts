import { test } from '@japa/runner'

import UserFactory from '#database/factories/user_factory'
import Article from '#models/article'

test.group('Article update', () => {
  test('should update an article of a chatbot by ID and article ID', async ({
    assert,
    client,
    route,
  }) => {
    const user = await UserFactory.with('ownedChatbots', 2, (chatbot) =>
      chatbot.with('articles', 3)
    ).create()

    const chatbot = user.ownedChatbots[0].serialize()
    const tempArticle = user.ownedChatbots[0].articles[0].serialize()
    const article = await Article.find(tempArticle.id).then((article) => article?.serialize())
    const title = 'New title'
    const response = await client
      .put(route('articles.update', { chatbotSlug: chatbot.id, articleSlug: tempArticle.id }))
      .json({ title })
      .loginAs(user)

    response.assertStatus(200)

    const updatedArticle = response.body().data
    const articleInDB = await Article.find(tempArticle.id).then((article) => article?.serialize())

    assert.equal(updatedArticle.title, title)
    assert.equal(updatedArticle.id, article?.id)
    assert.equal(articleInDB?.title, title)
  })
})
