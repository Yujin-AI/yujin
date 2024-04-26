import { InferPageProps } from '@adonisjs/inertia/types'
import { Link } from '@inertiajs/react'

import ArticlesController from '#controllers/articles_controller'

import { buttonVariants } from '@/components/ui/button'
import { cn, removeTrailingSlash } from '@/lib/utils'

export default function ArticlesIndex(props: InferPageProps<ArticlesController, 'showArticles'>) {
  console.log('props', props)
  const { previousPageUrl, nextPageUrl, firstPage, lastPage, currentPage } = props.articles.meta
  let currentURL = new URL(window.location.href).pathname
  currentURL = removeTrailingSlash(currentURL)

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {props.articles.data.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
      <Link
        href={previousPageUrl ? currentURL + previousPageUrl : ''}
        disabled={!previousPageUrl}
        as="button"
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        Previous
      </Link>

      <Link
        href={currentURL + nextPageUrl}
        disabled={!nextPageUrl}
        as="button"
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        Next
      </Link>
    </div>
  )
}
