import factory from '@adonisjs/lucid/factories'

import ChatbotFactory from '#database/factories/chatbot_factory'
import User from '#models/user'

const UserFactory = factory
  .define(User, async ({ faker }) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ allowSpecialCharacters: false }).toLowerCase(),
    password: faker.internet.password(),
  }))
  .relation('ownedChatbots', () => ChatbotFactory)
  .relation('createdChatbots', () => ChatbotFactory)
  .build()

export default UserFactory
