import factory from '@adonisjs/lucid/factories'

import ArticleFactory from '#database/factories/article_factory'
import Chatbot from '#models/chatbot'

const ChatbotFactory = factory
  .define(Chatbot, async ({ faker }) => ({
    name: faker.person.fullName(),
    url: faker.internet.url(),
  }))
  .relation('articles', () => ArticleFactory)
  .build()

export default ChatbotFactory
