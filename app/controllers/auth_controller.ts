import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { loginValidator, signUpValidator } from '#validators/auth_validator'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const token = await User.authTokens.create(user, ['*'], {
      expiresIn: '30 days',
      name: 'login',
    })
    return response.ok({
      success: true,
      message: 'Login successful',
      data: {
        ...user.serialize(),
        token: token.toJSON(),
      },
    })
  }

  // public async logout({}: HttpContext) {
  //   //todo)) implement logout
  // }

  public async signup({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signUpValidator)

    const userAlreadyExists = await User.findBy('email', payload.email)
    if (userAlreadyExists !== null) {
      return response.conflict({ success: false, message: 'Please login!!' })
    }

    await User.create(payload)

    return response.created({
      success: true,
      message: 'Signup successful, please login to continue',
    })
  }
}
