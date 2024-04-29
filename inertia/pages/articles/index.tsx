import { InferPageProps } from '@adonisjs/inertia/types'

import ArticlesController from '#controllers/articles_controller'

import { columns } from '@/components/columns'
import { DataTable } from '@/components/data_table'
import SidebarLayout from '@/layouts/sidebar_layout'
import { removeTrailingSlash } from '@/lib/utils'

export default function ArticlesIndex(props: InferPageProps<ArticlesController, 'showArticles'>) {
  let currentURL = new URL(window.location.href).pathname
  const { chatbot, user, articles } = props
  currentURL = removeTrailingSlash(currentURL)
  return (
    <SidebarLayout user={user} chatbot={chatbot}>
      {/*
      <div className="flex flex-col">
        {articles.data.map((article) => (
          <Link
            key={article.id}
            as="a"
            // ':chatbotSlug/articles/:articleSlug'
            href={currentURL + '/' + article.slug}
            //href={chatbot.slug + '/articles/' + article.slug}
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
        href={nextPageUrl ? currentURL + nextPageUrl : ''}
        disabled={!nextPageUrl}
        as="button"
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        Next
      </Link>
      */}

      <div className="flex-col flex-1 hidden h-full p-8 space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
            <p className="text-muted-foreground">
              This is where you train your chatbot. Add articles to help your chatbot understand
              user queries.
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable data={articles} columns={columns} />
      </div>
    </SidebarLayout>
  )
}
