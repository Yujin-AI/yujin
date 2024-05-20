import vine from '@vinejs/vine'

export const signUpValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(3).maxLength(50),
    lastName: vine.string().trim().minLength(3).maxLength(50),
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'confirmPassword' }).trim(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).trim(),
  })
)
