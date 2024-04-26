import { getToken } from '#lib/utils'
import OpenAI from 'openai'
import { ChatCompletionChunk } from 'openai/resources/chat/completions'
import { Stream } from 'openai/streaming'

export default class OpenAIService {
  private readonly openai: OpenAI
  constructor(private readonly apiKey: string) {
    this.openai = new OpenAI({ apiKey: this.apiKey })
  }

  // async ask(context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<ChatCompletion>
  async ask(context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<string> {
    const token = getToken(JSON.stringify(context)).length
    console.log('token:', token)
    //if (token > 16000) return

    const response = await this.openai.chat.completions.create({
      messages: context,
      model: 'gpt-4-1106-preview',
      temperature: 0,
    })

    return response.choices[0].message.content ?? ''
  }

  async askStream(
    context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ): Promise<Stream<ChatCompletionChunk>> {
    const token = getToken(JSON.stringify(context)).length
    console.log('token:', token)
    //if (token > 16000) return

    const response = this.openai.chat.completions.create({
      messages: context,
      model: 'gpt-4-1106-preview',
      temperature: 0,
      stream: true,
    })

    return response
  }
}
