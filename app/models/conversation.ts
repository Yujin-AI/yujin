import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'

import Chatbot from '#models/chatbot'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import { ConversationStatus } from '#lib/enums'

export default class Conversation extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title?: string

  @column()
  declare source: string

  @column()
  declare status: ConversationStatus

  @column()
  declare sessionId: string

  @column()
  declare seen: boolean

  @column()
  declare type: 'chat' | 'ticket'

  @column()
  declare chatbotId: string

  @column()
  declare customerId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Chatbot)
  declare chatbot: BelongsTo<typeof Chatbot>

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>
}
