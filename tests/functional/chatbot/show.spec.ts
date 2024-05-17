import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('Chatbot show', () => {
  test('should get all chatbots', async ({ client, route }) => {
    const user = await UserFactory.create()
    const chatbots = await user.related('ownedChatbots').create({
      name: 'Test Chatbot',
      url: 'https://example.com',
      ownerId: user.id,
      creatorId: user.id,
    })
    const response = await client.get(route('chatbots.index')).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: [chatbots.toJSON()],
    })
  })

  test('should not get chatbots if user is not authenticated', async ({ client, route }) => {
    const response = await client.get(route('chatbots.index'))

    response.assertStatus(401)
  })

  test('should get a single chatbot', async ({ client, route }) => {
    const user = await UserFactory.create()
    const chatbot = await user.related('ownedChatbots').create({
      name: 'Test Chatbot',
      url: 'https://example.com',
    })
    const response = await client
      .get(route('chatbots.show', { chatbotSlug: chatbot.slug }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ success: true, data: chatbot.toJSON() })
  })

  test('should not get chatbot if user is not authenticated', async ({ client, route }) => {
    const user = await UserFactory.create()
    const chatbot = await user.related('ownedChatbots').create({
      name: 'Test Chatbot',
      url: 'https://example.com',
    })
    const response = await client.get(route('chatbots.show', { chatbotSlug: chatbot.slug }))

    response.assertStatus(401)
  })
})
