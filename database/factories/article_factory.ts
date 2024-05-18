import factory from '@adonisjs/lucid/factories'

import { ArticleSourceType } from '#lib/enums'
import Article from '#models/article'

const ArticleFactory = factory
  .define(Article, ({ faker }) => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    sourceUrl: faker.internet.url(),
    sourceType: ArticleSourceType.MANUAL,
  }))
  .state(ArticleSourceType.BULK, (article) => (article.sourceType = ArticleSourceType.BULK))
  .state(ArticleSourceType.CSV, (article) => (article.sourceType = ArticleSourceType.CSV))
  .state(ArticleSourceType.PDF, (article) => (article.sourceType = ArticleSourceType.PDF))
  .build()

export default ArticleFactory
