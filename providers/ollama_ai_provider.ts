import OllamaAIService from '#services/ollama_ai_service'
import { ApplicationService } from '@adonisjs/core/types'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    ollama: OllamaAIService
  }
}

export default class OllamaAIProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('ollama', async () => {
      const OllamaAIService = (await import('#services/ollama_ai_service')).default

      return new OllamaAIService()
    })
  }
}
