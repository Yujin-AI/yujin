import OpenAI from 'openai'
import { ChatCompletionChunk } from 'openai/resources/chat/completions'
import { Stream } from 'openai/streaming'

import { getToken } from '#lib/utils'
import { ChatContext } from '#lib/types'

export default class OpenAIService {
  private readonly openai: OpenAI

  constructor(private readonly apiKey: string) {
    this.openai = new OpenAI({ apiKey: this.apiKey })
  }

  async askWithContext(context: ChatContext[]): Promise<string> {
    const messages = context.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const response = await this.openai.chat.completions.create({
      messages,
      model: 'gpt-4-1106-preview',
      temperature: 0,
    })

    return response.choices[0].message.content ?? ''
  }

  // todo))
  async ask(_question: string) {}

  // todo))
  async askStream(
    context: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ): Promise<Stream<ChatCompletionChunk>> {
    const token = getToken(JSON.stringify(context)).length
    console.log('token:', token)

    const response = this.openai.chat.completions.create({
      messages: context,
      model: 'gpt-4-1106-preview',
      temperature: 0,
      stream: true,
    })

    return response
  }
}
