import factory from '@adonisjs/lucid/factories'

import Chatbot from '#models/chatbot'
import ArticleFactory from './article_factory.js'

const ChatbotFactory = factory
  .define(Chatbot, async ({ faker }) => ({
    name: faker.person.fullName(),
    url: faker.internet.url(),
  }))
  .relation('articles', () => ArticleFactory)
  .build()

export default ChatbotFactory
