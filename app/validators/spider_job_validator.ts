import vine from '@vinejs/vine'

export const SpiderJobValidator = vine.compile(
  vine.object({
    url: vine.string().url({
      require_protocol: true,
      protocols: ['http', 'https'],
    }),
    chatbotId: vine.string().uuid(),
  })
)
