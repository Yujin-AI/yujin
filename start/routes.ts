// noinspection Eslint

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
 * 1. Remove all the inertia and frontend related code -- [info] DONE
 * 2. Edit the old implementation of the features to api based -- [info] DONE
 * 3. Typesense to MeiliSearch -- [info] sticking to typesense
 * 4. Improve the jobs -- [info] DONE
 *  - Shopify, Articles, Embedding & Indexing -- [info] DONE
 * 5. Add routes to resources
 */

import env from '#start/env'
import router from '@adonisjs/core/services/router'

import { middleware } from './kernel.js'

const ArticlesController = () => import('#controllers/articles_controller')
const AuthController = () => import('#controllers/auth_controller')
const ChatbotController = () => import('#controllers/chatbot_controller')
const ConversationController = () => import('#controllers/conversation_controller')
const CustomerController = () => import('#controllers/customer_controller')
const HealChecksController = () => import('#controllers/health_checks_controller')
const MessageController = () => import('#controllers/message_controller')

router
  .get('api/auth/me', async ({ response, auth }) => {
    const user = auth.user
    await user?.load('ownedChatbots')
    response.ok({ success: true, data: user })
  })
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/
router
  .get('health', [HealChecksController])
  .use(({ request, response }, next) => {
    if (request.header('x-monitoring-secret') === env.get('APP_KEY')) return next()
    response.unauthorized({ message: 'Unauthorized access' })
  })
  .prefix('api')

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
    router.delete('articles', [ArticlesController, 'massDestroy']).as('articles.massDestroy')
  })
  .prefix('api/:chatbotSlug')
  .use([middleware.auth(), middleware.chatbotOwnership()])

/*
|--------------------------------------------------------------------------
| Conversation routes
|--------------------------------------------------------------------------
*/
router
  .post('api/:chatbotSlug/conversations', [ConversationController, 'store'])
  .use(middleware.keyAuth())
router
  .get('api/:chatbotSlug/conversations', [ConversationController, 'index'])
  .use([middleware.auth(), middleware.chatbotOwnership()])

/*
|--------------------------------------------------------------------------
| Customer routes
|--------------------------------------------------------------------------
*/
router
  .get('api/:chatbotSlug/customers', [CustomerController, 'index'])
  .use([middleware.auth(), middleware.chatbotOwnership()])

// import transmit from '@adonisjs/transmit/services/main'

// router.get('/', async ({ response }) => {
//   response.send('Hello world')
//   transmit.broadcast('global', { message: 'Hello' })
// })

/*
|--------------------------------------------------------------------------
| Message routes
|--------------------------------------------------------------------------
*/
router.post('api/:conversationId/messages', [MessageController, 'store']).use(middleware.keyAuth())
