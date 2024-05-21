import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'

import Article from '#models/article'

const bindArticle = () => (_target: any, _key: any, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response, request } = ctx
    const articleSlugOrId =
      params.articleSlug || request.input('articleSlug') || request.all().articleSlug
    if (!articleSlugOrId) {
      throw new validationErrors.E_VALIDATION_ERROR('Article ID or slug is required.')
    }
    try {
      const article = await Article.getArticleBySlugOrId(articleSlugOrId)
      if (!article) {
        return response.notFound({ success: false, message: 'Article not found' })
      }
      return await originalMethod.call(this, ctx, article)
    } catch (error) {
      logger.error(error, 'Failed to bind article.')
      return response.badRequest({ success: false, errors: error.messages || 'Article not found' })
    }
  }
  return descriptor
}

export default bindArticle
