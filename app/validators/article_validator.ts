import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    content: vine.string().trim().minLength(3),
  })
)

export const updateArticleValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .optional()
      .requiredIfMissing(['content']),
    content: vine.string().trim().minLength(3).optional().requiredIfMissing(['title']),
  })
)
