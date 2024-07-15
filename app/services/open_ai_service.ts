import OpenAI from 'openai'
import { searchArticlesFunction } from '#lib/llm_functions/search_articles_function'

export default class OpenAIService {
  private readonly openai: OpenAI
  private readonly LLMModel = 'gpt-3.5-turbo'

  constructor(private readonly apiKey: string) {
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      // baseURL: 'https://api.groq.com/openai/v1',
    })
  }

  async askWithContext(context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    return this.openai.chat.completions.create({
      // @ts-ignore
      messages: context,
      model: this.LLMModel,
      temperature: 0,
      tool_choice: 'auto',
      tools: [
        {
          type: 'function',
          function: searchArticlesFunction,
        },
      ],
    })
  }

  async askStreamWithContext(context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    // todo)) migrate to openai assistants api ref - https://platform.openai.com/docs/assistants/overview
    return this.openai.chat.completions.create({
      // @ts-ignore
      messages: context,
      model: this.LLMModel,
      temperature: 0,
      stream: true,
    })
  }
}
