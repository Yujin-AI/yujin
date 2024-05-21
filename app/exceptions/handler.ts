import { HttpStatus } from '#lib/enums'
import { errors as authErrors } from '@adonisjs/auth'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { errors as validationErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx.response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: error.getResponseMessage(error, ctx) })
    }

    if (error instanceof validationErrors.E_VALIDATION_ERROR) {
      return ctx.response
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ success: false, message: error.messages })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
