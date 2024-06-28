import { Content, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'

export default class GeminiAIService {
  private readonly gemini: GenerativeModel

  constructor(private readonly apiKey: string) {
    this.gemini = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({
      model: 'gemini-1.5-flash',
    })
  }

  async askWithContext(context: Content[]) {
    const chat = this.gemini.startChat({
      history: context,
      generationConfig: { temperature: 0 },
    })

    const result = await chat.sendMessage('Now give me the final response')
    return result.response.text()
  }
}
