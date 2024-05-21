import { test } from '@japa/runner'

import UserFactory from '#database/factories/user_factory'

test.group('Chatbot select', () => {
  test('should select a chatbot', async ({ client, route }) => {
    const user = await UserFactory.create()
    const chatbot = await user.related('ownedChatbots').create({
      name: 'Test Chatbot',
      url: 'https://example.com',
      creatorId: user.id,
    })

    const response = await client
      .put(route('chatbots.select', { chatbotSlug: chatbot.slug }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Default chatbot selected successfully',
      data: {
        defaultChatbotId: chatbot.id,
      },
    })
  })

  test('should select a chatbot with chatbotId', async ({ client, route }) => {
    const user = await UserFactory.create()
    const chatbot = await user.related('ownedChatbots').create({
      name: 'Test Chatbot',
      url: 'https://example.com',
      creatorId: user.id,
    })

    const response = await client
      .put(route('chatbots.select', { chatbotSlug: chatbot.id }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Default chatbot selected successfully',
      data: {
        defaultChatbotId: chatbot.id,
      },
    })
  })

  test('should not select a chatbot if user is not authenticated', async ({ client, route }) => {
    const response = await client.put(route('chatbots.select', { chatbotSlug: 'test-chatbot' }))

    response.assertStatus(401)
  })

  test('should not select a chatbot if chatbot does not exist', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client
      .put(route('chatbots.select', { chatbotSlug: 'test-chatbot' }))
      .loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({
      success: false,
      message: 'Chatbot not found',
    })
  })
})
