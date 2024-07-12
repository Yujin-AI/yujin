import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { errors as validationErrors } from '@vinejs/vine'

const bindGeneric =
  (...models: ModelObject[]) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (this: any, ctx: HttpContext) {
      const { params, response, request } = ctx

      const bindings: { [key: string]: any } = {}

      try {
        for (const Model of models) {
          const modelName = Model.name.toLowerCase()
          const modelId =
            params[`${modelName}Id`] ||
            params[`${modelName}Slug`] ||
            params[`${modelName}IdOrSlug`] ||
            request.input(`${modelName}Id`) ||
            request.input(`${modelName}Slug`) ||
            request.input(`${modelName}IdOrSlug`) ||
            request.all()[`${modelName}Id`] ||
            request.all()[`${modelName}Slug`] ||
            request.all()[`${modelName}IdOrSlug`]

          if (!modelId) {
            throw new validationErrors.E_VALIDATION_ERROR(`${modelName} ID or slug is required.`)
          }

          const modelInstance = await Model.find(modelId)
          if (!modelInstance) {
            return response.notFound({ success: false, message: `${modelName} not found` })
          }

          bindings[modelName] = modelInstance
        }

        return await originalMethod.call(this, ctx, bindings)
      } catch (error) {
        logger.error(error, 'Failed to bind model.')
        return response.badRequest({
          success: false,
          errors: error.messages || error.message || 'Model not found',
        })
      }
    }
  }

export default bindGeneric
