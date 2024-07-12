import { Content, GenerativeModel, GoogleGenerativeAI, Part } from '@google/generative-ai'

import { searchArticlesFunction } from '#lib/llm_functions/search_articles_function'
import { ChatContext, LLMFunctionDeclaration } from '#lib/types'
import app from '@adonisjs/core/services/app'

export default class GeminiAIService {
  private readonly gemini: GenerativeModel

  constructor(private readonly apiKey: string) {
    this.gemini = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [
        {
          // @ts-ignore
          functionDeclarations: [...this.handleFunctionsDeclarations([searchArticlesFunction])],
        },
      ],
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

    let result = await chat.sendMessage('Now give me the final response')

    const fns = result.response.functionCalls()
    console.log('fns:', fns)
    //check if there is any function call in the response
    if (fns?.length) {
      // handle function calls
      const fnsResponses: Part[] = []
      for (const fn of fns) {
        const fnName = fn.name
        const fnArgs = fn.args
        if (fnName === 'searchArticles') {
          // handle search_articles function
          const typesense = await app.container.make('typesense')
          const response = typesense.multiSearch.perform({
            searches: [
              {
                collection: 'articles',
                q: fnArgs.searchKeyword,
              },
            ],
          })
        }
      }

      result = await chat.sendMessage(fnsResponses)
    }

    return result.response.text()
  }

  private handleFunctionsDeclarations(fns: LLMFunctionDeclaration[]) {
    return fns.map((fn) => {
      return {
        name: fn.name,
        description: fn.description,
        parameters: fn.parameters,
      }
    })
  }
}
