import OpenAI from 'openai'
import OpenAIService from './open_ai_service.js'

export default class AIService {
  constructor(
    private readonly apiKey: string,
    private readonly provider: OpenAIService
  ) {
    this.provider = new OpenAIService(this.apiKey)
  }

  public async ask(context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    return this.provider.ask(context)
  }
}
