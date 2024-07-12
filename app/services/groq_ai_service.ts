import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || '')
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Explain the importance of fast language models',
      },
    ],
    model: 'llama3-8b-8192',
  })
}

export default class GroqAIService {
  private readonly groq: Groq

  constructor(private readonly apiKey: string) {
    this.groq = new Groq({ apiKey: this.apiKey })
  }

  async askWithContext(context: ChatContext[]): Promise<string> {
    const messages = context.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const response = await this.groq.chat.completions.create({
      messages,
      tool_choice: 'auto',
      model: 'llama3-8b-8192',
      temperature: 0,
    })

    return response.choices[0].message.content || ''
  }
}
