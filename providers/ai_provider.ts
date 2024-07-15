import type OpenAIService from '#services/open_ai_service'
import type { ApplicationService } from '@adonisjs/core/types'
import env from '#start/env'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    ai: OpenAIService
  }
}

export default class AIProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('ai', async () => {
      const aiProvider = env.get('AI_PROVIDER')
      switch (aiProvider) {
        case 'openai':
          const OpenAIService = (await import('#services/open_ai_service')).default
          return new OpenAIService(env.get('AI_API_KEY'))
        // case 'ollama':
        //   const OllamaAIService = (await import('#services/ollama_ai_service')).default
        //   return new OllamaAIService()
        // case 'gemini':
        //   const GeminiAIService = (await import('#services/gemini_ai_service')).default
        //   return new GeminiAIService(env.get('GEMINI_API_KEY'))
        default:
          throw new Error(`Invalid AI Provider: ${aiProvider}`)
      }
    })
  }
}
