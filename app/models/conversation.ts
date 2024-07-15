import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import { ConversationStatus } from '#lib/enums'
import Chatbot from '#models/chatbot'
import Customer from '#models/customer'
import Message from '#models/message'

export default class Conversation extends BaseModel {
  static selfAssignPrimaryKey = true

  serializeExtras = true

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

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}
