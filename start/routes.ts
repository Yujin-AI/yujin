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
    //todo)) add update route
    router
      .resource('chatbots', ChatbotController)
      .apiOnly()
      .params({ chatbots: 'chatbotSlug' })
      .use(['destroy', 'show', 'update'], middleware.chatbotOwnership())

    router
      .put('chatbots/:chatbotSlug/select', [ChatbotController, 'selectChatbot'])
      .as('chatbots.select')
      .use(middleware.chatbotOwnership())
  })
  .prefix('api')
  .use([middleware.auth()])

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
