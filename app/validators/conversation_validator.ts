import vine from '@vinejs/vine'

export const createConversationValidation = vine.compile(
  vine.object({
    sessionId: vine.string().maxLength(255),
    customerId: vine.string().maxLength(255),
    customerName: vine.string().maxLength(255).optional(),
    customerAttributes: vine.record(vine.string().maxLength(255)).optional(),
  })
)
