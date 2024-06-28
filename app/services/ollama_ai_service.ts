import type { Message } from 'ollama'
import ollama from 'ollama'
import { ChatContext } from '#lib/types'

export default class OllamaAIService {
  async askWithContext(context: ChatContext[]) {
    const messages: Message[] = context.map((msg) => ({
      role: msg.role === 'system' ? 'assistant' : 'user',
      content: msg.content,
    }))
    const response = await ollama.chat({
      model: 'llama3',
      messages,
      stream: false,
      options: { temperature: 0 },
    })
    return response.message.content
  }

  async ask(_question: string) {}
}
