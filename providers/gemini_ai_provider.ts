import type { ApplicationService } from '@adonisjs/core/types'

import GeminiAIService from '#services/gemini_ai_service'
import env from '#start/env'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    gemini: GeminiAIService
  }
}
export default class GeminiAIProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('gemini', async () => {
      const GeminiAIService = (await import('#services/gemini_ai_service')).default

      return new GeminiAIService(env.get('GEMINI_API_KEY'))
    })
  }
}
