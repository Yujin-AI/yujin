import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

import { decrypt } from '#lib/utils'
import env from '#start/env'

export default class KeyAuthMiddleware {
  /**
   * Handle incoming request as middleware. Check the x-api-key header for the API key.
   * It can be a chatbot owner's saved secret key or the APP_KEY.
   * It is used to authenticate the request and ensure that the request is coming from a valid source.
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const apiKey = request.header('x-api-key')

    if (!apiKey)
      return ctx.response.unauthorized({ success: false, message: 'Unauthorized access' })

    if (apiKey === env.get('APP_KEY')) return next()

    const decryptedApiKey = decrypt(apiKey)

    if (apiKey === decryptedApiKey) return next()

    return ctx.response.unauthorized({ success: false, message: 'Unauthorized access' })
  }
}
