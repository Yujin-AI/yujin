import { encoding_for_model } from '@dqbd/tiktoken'
import OpenAI from 'openai'

export default class OpenAIService {
  private readonly openai: OpenAI
  constructor(private readonly apiKey: string) {
    this.openai = new OpenAI({ apiKey: this.apiKey })
  }

  public async ask(context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    const enc = encoding_for_model('gpt-3.5-turbo')
    const token = enc.encode(JSON.stringify(context)).length
    console.log('token:', token)
    if (token > 16000) return
    const response = await this.openai.chat.completions.create({
      messages: context,
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    })

    return response.choices[0].message.content
  }
}
