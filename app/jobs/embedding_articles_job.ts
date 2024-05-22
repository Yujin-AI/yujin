import { BaseJob } from 'adonis-resque'

export default class EmbeddingArticlesJob extends BaseJob {
  queueName = 'embedding_articles'
  perform() {
    console.log('Embedding Articles Job')
  }
}
