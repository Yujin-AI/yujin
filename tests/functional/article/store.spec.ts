import { test } from '@japa/runner'

import UserFactory from '#database/factories/user_factory'
import { HttpStatus } from '#lib/enums'
import Article from '#models/article'

test.group('Article store', () => {
  test('should create a new article of a chatbot by ID', async ({ assert, client, route }) => {
    const user = await UserFactory.with('ownedChatbots', 2).create()

    const chatbot = user.ownedChatbots[0].serialize()
    const payload = {
      title: 'Article title',
      content: 'Article content',
    }

    const response = await client
      .post(route('articles.store', { chatbotSlug: chatbot.id }))
      .json(payload)
      .loginAs(user)

    response.assertStatus(HttpStatus.CREATED)
    response.assertBodyContains({
      success: true,
      message: 'Article created successfully',
    })

    const article = response.body().data
    const articleInDB = await Article.find(article.id).then((article) => article?.serialize())

    assert.equal(articleInDB?.title, payload.title)
    assert.equal(articleInDB?.id, article.id)
  })
})
