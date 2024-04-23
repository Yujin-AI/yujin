/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
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
