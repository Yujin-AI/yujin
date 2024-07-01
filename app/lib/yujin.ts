import Conversation from '#models/conversation'

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

  public async ask(question: string): Promise<string> {
    // todo)) add checks and limits for bot responses
    return `You said: ${question}`

    // save customer's message
    // await this.conversation?.related('messages').create({
    //   content: question,
    //   senderType: MessageSenderType.CUSTOMER,
    // })
  }
}
