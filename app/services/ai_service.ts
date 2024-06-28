import OpenAIService from './open_ai_service.js'
import env from '#start/env'
import OllamaAIService from '#services/ollama_ai_service'

export default function AIServiceFactory() {
  const aiProvider = env.get('AI_PROVIDER')
  switch (aiProvider) {
    case 'openai':
      return new OpenAIService(env.get('AI_API_KEY'))
    case 'ollama':
      return new OllamaAIService()
    default:
      throw new Error(`Invalid AI Provider: ${aiProvider}`)
  }
}
