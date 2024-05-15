import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('Chatbot delete', () => {
  test('should delete a chatbot', async ({ client, route }) => {
    const user = await UserFactory.create()
    const chatbot = await user.related('ownedChatbots').create({
      name: 'Test Chatbot',
      url: 'https://example.com',
      creatorId: user.id,
    })

    const response = await client
      .delete(route('chatbots.delete', { chatbotSlug: chatbot.slug }))
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Chatbot deleted successfully',
    })
  })

  test('should not delete a chatbot if user is not authenticated', async ({ client, route }) => {
    const response = await client.delete(route('chatbots.delete', { chatbotSlug: 'test-chatbot' }))

    response.assertStatus(401)
  })

  test('should not delete a chatbot if chatbot does not exist', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client
      .delete(route('chatbots.delete', { chatbotSlug: 'test-chatbot' }))
      .loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({
      success: false,
      message: 'Chatbot not found',
    })
  })
})
