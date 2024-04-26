import ArticlesController from '#controllers/articles_controller'
import { InferPageProps } from '@adonisjs/inertia/types'

export default function ShowArticle(props: InferPageProps<ArticlesController, 'showArticle'>) {
  console.log('props', props)
  return (
    <div className="container mx-auto">
      <h1 className="mt-10 mb-5 text-3xl font-bold text-center">{props.article.title}</h1>
      <p>{props.article.content}</p>
    </div>
  )
}
