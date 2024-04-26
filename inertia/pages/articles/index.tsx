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
  console.log('currentURL', currentURL)
  return (
    <div>
      <h1>Articles</h1>
      <div className="flex flex-col">
        {props.articles.data.map((article) => (
          <Link
            key={article.id}
            as="a"
            // ':chatbotSlug/articles/:articleSlug'
            href={currentURL + '/' + article.slug}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {article.title}
          </Link>
        ))}
      </div>
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
