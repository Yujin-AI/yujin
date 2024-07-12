import vine from '@vinejs/vine'

export const createMessageValidator = vine.compile(
  vine.object({
    message: vine.string(),
  })
)
