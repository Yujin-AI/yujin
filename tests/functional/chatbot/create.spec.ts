import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('Chatbot create', () => {
  test('should create a chatbot', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.post(route('chatbots.store')).loginAs(user).json({
      name: 'Test Chatbot',
      url: 'https://example.com',
    })

    response.assertStatus(201)
  })

  test('should not create a chatbot if user is not authenticated', async ({ client, route }) => {
    const response = await client.post(route('chatbots.store')).json({
      name: 'Test Chatbot',
      url: 'https://example.com',
    })

    response.assertStatus(401)
  })

  test('should not create chatbot if url is not valid', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.post(route('chatbots.store')).loginAs(user).json({
      name: 'Test Chatbot',
      url: 'example.com',
    })

    response.assertStatus(422)
  })
})
