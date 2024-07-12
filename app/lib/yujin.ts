import app from '@adonisjs/core/services/app'

import { YujinConversationPrompt } from '#lib/constants'
import { searchArticles } from '#lib/llm_functions/search_articles_function'
import Conversation from '#models/conversation'
import env from '#start/env'
import { MessageSenderType } from './enums.js'
import { ChatCompletionMessageParam } from 'openai/resources/index'

export default class Yujin {
  private conversation: Conversation | null

  constructor(private readonly conversationId: string) {
    this.conversationId = conversationId
    this.conversation = null
  }

  public async init(): Promise<Yujin> {
    this.conversation = await Conversation.query()
      .where('id', this.conversationId)
      .preload('chatbot')
      .preload('customer')
      .first()

    return this
  }

  public async ask(question: string) {
    // todo)) add checks and limits for bot responses
    // return `You said: ${question}`
    if (!this.conversation) {
      //todo)) handle this error
      throw new Error('Conversation not found')
    }

    // save customer's message
    await this.conversation?.related('messages').create({
      content: question,
    })

    let conversationHistory = await this.conversation
      ?.related('messages')
      .query()
      .limit(env.get('MESSAGE_HISTORY_LIMIT', 10))
      .orderBy('created_at', 'asc')

    const context = conversationHistory?.map((message) => ({
      role: message.senderType === MessageSenderType.YUJIN ? 'assistant' : 'user', // todo)) add senderType to conversation messages
      content: message.content,
    })) as ChatCompletionMessageParam[]

    // replace all the placeholders in the prompt
    let prompt = YujinConversationPrompt
    prompt = prompt.replaceAll('{{chatbotName}}', this.conversation.chatbot.name ?? 'Yujin') // this need to add as chatbot config
    prompt = prompt.replaceAll('{{companyName}}', this.conversation.chatbot.name)
    prompt = prompt.replaceAll('{{website}}', this.conversation.chatbot.url)
    prompt = prompt.replaceAll('{{date}}', new Date().toLocaleDateString())
    const customer = this.conversation.customer
    if (customer) {
      const customerAttributes = await customer.getAttributeValues()
      prompt = prompt.replaceAll(
        '{{customerAttributes}}',
        JSON.stringify({
          name: customer.name,
          ...customerAttributes,
        })
      )
    }

    //todo)) add custom instructions defined by user from dashboard

    const ai = await app.container.make('ai')
    const fnResponse = await ai.askWithContext([
      {
        role: 'system',
        content: prompt,
      },
      ...context,
    ])

    const toolCalls = fnResponse.choices[0]?.message.tool_calls
    if (!toolCalls) {
      return fnResponse.choices[0].message.content ?? 'Failed to get answer from YUjin' // todo)) add custom yujin response
    }

    context.push(fnResponse.choices[0].message)

    for (const toolCall of toolCalls) {
      let functionResult = ''
      const functionName = toolCall.function.name
      const functionArgs = toolCall.function.arguments
      if (functionName === 'searchArticles') {
        const searchKeyword = JSON.parse(functionArgs)['searchKeyword'] as string
        const articles = await searchArticles(searchKeyword, this.conversation.chatbotId)
        functionResult = JSON.stringify(articles)

        context.push({
          tool_call_id: toolCall.id,
          // name: functionName,
          role: 'tool',
          content: functionResult,
        })
      } else {
        //todo)) handle custom actions for future
      }
    }

    return ai.askStreamWithContext([
      {
        role: 'system',
        content: prompt,
      },
      ...context,
    ])

    // handle function calls if any

    // save bot's message
    // await this.conversation?.related('messages').create({
    //   content: answer,
    //   senderType: MessageSenderType.YUJIN,
    // })
  }
}
