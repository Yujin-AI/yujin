import { test } from '@japa/runner'

import { UserFactory } from '#database/factories/user_factory'
import { HttpStatus } from '#lib/enums'
import db from '@adonisjs/lucid/services/db'

test.group('Auth Login', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    return () => db.rollbackGlobalTransaction()
  })

  test('should login user', async ({ client, route }) => {
    const password = 'Abcd@1234'
    const user = await UserFactory.merge({ password }).create()
    const response = await client.post(route('login')).json({
      email: user.email,
      password,
    })
    response.assertStatus(HttpStatus.OK)
    // todo)) use open api to assert response
  })

  test('should fail to login an user with invalid credentials', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.post(route('login')).json({
      email: user.email,
      password: 'password',
    })
    response.assertStatus(HttpStatus.UNAUTHORIZED)
    // todo)) use open api to assert response
  })

  test('should fail to login a user with invalid payload', async ({ client, route }) => {
    const response = await client.post(route('login')).json({
      uid: 'example@test.com', //expected email
      password: 'password',
    })
    response.assertStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    // todo)) use open api to assert response
  })
})
