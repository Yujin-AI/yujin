import type { Message } from 'ollama'
import ollama from 'ollama'

export default class OllamaAIService {
  async askWithContext(context: Message[]) {
    const response = await ollama.chat({
      model: 'llama3',
      messages: context,
      stream: false,
      options: { temperature: 0 },
    })
    return response.message.content
  }

  async ask(_question: string) {}
}
