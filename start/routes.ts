/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import ArticlesController from '#controllers/articles_controller'
import AuthController from '#controllers/auth_controller'
import ChatbotController from '#controllers/chatbot_controller'
import DashboardController from '#controllers/dashboard_controller'

import { middleware } from './kernel.js'

router.on('/').renderInertia('home', { version: 6 })

/*
|--------------------------------------------------------------------------
| Authentication routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('signup', [AuthController, 'showSignup']).as('signup')
    router.get('login', [AuthController, 'showLogin']).as('login')
  })
  .use(middleware.guest())

router.post('logout', [AuthController, 'logout']).use(middleware.auth())

router
  .group(() => {
    router.post('signup', [AuthController, 'signup'])
    router.post('login', [AuthController, 'login'])
  })
  .prefix('auth')
  .use(middleware.guest())

/*
|--------------------------------------------------------------------------
| Dashboard routes
|--------------------------------------------------------------------------
*/
router.get('dashboard', [DashboardController, 'dashboard']).as('dashboard').use(middleware.auth())

router
  .get(':chatbotSlug/dashboard', [DashboardController, 'showDashboard'])
  .as('dashboard.show')
  .use(middleware.auth())

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
/*
|--------------------------------------------------------------------------
| Article routes
|--------------------------------------------------------------------------
*/
router
  .get(':chatbotSlug/articles', [ArticlesController, 'showArticles'])
  .as('articles.index')
  .use(middleware.auth())
router
  .get(':chatbotSlug/articles/:articleSlug', [ArticlesController, 'showArticle'])
  .as('articles.show')
  .use(middleware.auth())
