import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { MessageSenderType } from '#lib/enums'
import Conversation from '#models/conversation'

export default class Message extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare content: string

  @column()
  declare senderType: MessageSenderType

  @column()
  declare externalId?: string

  @column()
  declare conversationId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>

  @beforeCreate()
  public static async assignUUID(message: Message) {
    message.id = message.id || uuid()
  }
}
