import { ApplicationService } from '@adonisjs/core/types'

import OpenAIService from '#services/open_ai_service'
import env from '#start/env'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    openai: OpenAIService
  }
}

export default class OpenAIProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('openai', async () => {
      const OpenAIService = (await import('#services/open_ai_service')).default

      return new OpenAIService(env.get('AI_API_KEY'))
    })
  }
}
