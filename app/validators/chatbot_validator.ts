import vine from '@vinejs/vine'

export const createChatbotValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    url: vine.string().url({
      require_protocol: true,
      protocols: ['http', 'https'],
    }),
  })
)

export const selectChatbotValidator = vine.compile(
  vine.object({
    chatbotSlug: vine.string().minLength(3).maxLength(255),
  })
)
