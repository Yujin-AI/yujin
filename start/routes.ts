/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ArticlesController = () => import('#controllers/articles_controller')
const AuthController = () => import('#controllers/auth_controller')
const ChatbotController = () => import('#controllers/chatbot_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

import { middleware } from './kernel.js'

router.get('/', async ({ response }) => {
  // const queued = await queue.queued('default', 0, 2000)
  // const jobs = queue.jobs
  // const length = await queue.length('default')
  // const stats = await queue.stats()
  // response.send({ message: 'Hello world', queued, jobs, length, stats })
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
    router.post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
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
    router.post('chatbots', [ChatbotController, 'store'])
    router.put('chatbots/select', [ChatbotController, 'selectChatbot'])
    router.delete('chatbots/:chatbotSlug', [ChatbotController, 'delete'])
  })
  .use(middleware.auth())
  .prefix('api')

/*
|--------------------------------------------------------------------------
| Article routes
|--------------------------------------------------------------------------
*/
// router
//   .get(':chatbotSlug/articles', [ArticlesController, 'showArticles'])
//   .as('articles.index')
//   .use(middleware.auth())
// router
//   .get(':chatbotSlug/articles/:articleSlug', [ArticlesController, 'showArticle'])
//   .as('articles.show')
//   .use(middleware.auth())
// router.get('api/:chatbotSlug/articles', [ArticlesController, 'apiArticles']).use(middleware.auth())
