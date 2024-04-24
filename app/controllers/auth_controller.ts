import { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { loginValidator, signUpValidator } from '#validators/auth_validator'

export default class AuthController {
  public async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  public async login({ auth, request, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const nextPath = request.input('next')

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      if (nextPath) return response.redirect().toPath(nextPath)

      return response.redirect().toRoute('/dashboard')
    } catch (error) {
      session.flash('errors.email', 'Invalid email or password')
      let backPath = '/login'
      if (nextPath) backPath += '?next=' + nextPath
      return response.redirect().toPath(backPath)
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }

  public async showSignup({ inertia }: HttpContext) {
    return inertia.render('auth/signup')
  }

  public async signup({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(signUpValidator)

    const userAlreadyExists = await User.findBy('email', payload.email)
    if (userAlreadyExists !== null) {
      session.flash('errors.email', 'Please login with your existing account')
      return response.redirect().back()
    }

    const user = await User.create(payload)
    await auth.use('web').login(user)

    return response.redirect().toRoute('/')
  }
}
