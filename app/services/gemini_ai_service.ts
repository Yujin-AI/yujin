import { Content, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'

import { ChatContext } from '#lib/types'

export default class GeminiAIService {
  private readonly gemini: GenerativeModel

  constructor(private readonly apiKey: string) {
    this.gemini = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({
      model: 'gemini-1.5-flash',
    })
  }

  async askWithContext(context: ChatContext[]) {
    const history: Content[] = context.map((msg) => ({
      role: msg.role === 'system' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const chat = this.gemini.startChat({
      history,
      generationConfig: { temperature: 0 },
    })

    const result = await chat.sendMessage('Now give me the final response')
    return result.response.text()
  }
}
