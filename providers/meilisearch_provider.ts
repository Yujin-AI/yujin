import env from '#start/env'
import { ApplicationService } from '@adonisjs/core/types'
import { MeiliSearch } from 'meilisearch'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    meilisearch: MeiliSearch
  }
}

export default class MeilisearchProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('meilisearch', async () => {
      return new MeiliSearch({
        host: env.get('MEILISEARCH_HOST'),
        apiKey: env.get('MEILISEARCH_API_KEY'),
      })
    })
  }
}
