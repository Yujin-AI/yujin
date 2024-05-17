/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// todo))
/*
 * All the todo
 * 1. Remove all the inertia and frontend related code
 * 2. Edit the old implementation of the features to api based
 * 3. Typesense to MeiliSearch
 * 4. Improve the jobs
 *  - Shopify, Articles, Embedding & Indexing
 * 5. Add routes to resources
 */

import router from '@adonisjs/core/services/router'

const ArticlesController = () => import('#controllers/articles_controller')
const AuthController = () => import('#controllers/auth_controller')
const ChatbotController = () => import('#controllers/chatbot_controller')
// const DashboardController = () => import('#controllers/dashboard_controller')

import { middleware } from './kernel.js'

router.get('/', async ({ response }) => {
  response.send({ message: 'Hello world' })
})

/*
|--------------------------------------------------------------------------
| Authentication routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('/signup', [AuthController, 'signup']).as('signup')
    router.post('/login', [AuthController, 'login']).as('login')
    // router.post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
  })
  .prefix('api/auth')

/*
|--------------------------------------------------------------------------
| Dashboard routes
|--------------------------------------------------------------------------
*/
// router.get('dashboard', [DashboardController, 'dashboard']).as('dashboard').use(middleware.auth())

// router
//   .get(':chatbotSlug/dashboard', [DashboardController, 'showDashboard'])
//   .as('dashboard.show')
//   .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Chatbot routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('chatbots', [ChatbotController, 'index']).as('chatbots.index')
    router.post('chatbots', [ChatbotController, 'store']).as('chatbots.store')

    // todo)) add these routes as resource and add update chatbot route
    router
      .group(() => {
        router.get('chatbots/:chatbotSlug', [ChatbotController, 'show']).as('chatbots.show')
        router.put('chatbots/select', [ChatbotController, 'selectChatbot']).as('chatbots.select')
        router.delete('chatbots/:chatbotSlug', [ChatbotController, 'delete']).as('chatbots.delete')
      })
      .use(middleware.chatbotOwnership())
  })
  .use(middleware.auth())
  .prefix('api')

/*
|--------------------------------------------------------------------------
| Article routes
|--------------------------------------------------------------------------
*/
router // Public routes
  .group(() => {
    router
      .resource('articles', ArticlesController)
      .apiOnly()
      .only(['index', 'show'])
      .params({ articles: 'articleSlug' })
      .use('show', middleware.articleOwnership())
  })
  .prefix('api/:chatbotSlug')
router // Protected routes
  .group(() => {
    router
      .resource('articles', ArticlesController)
      .apiOnly()
      .except(['index', 'show'])
      .params({ articles: 'articleSlug' })
      .use(['destroy', 'update'], middleware.articleOwnership())
  })
  .prefix('api/:chatbotSlug')
  .use([middleware.auth(), middleware.chatbotOwnership()])
