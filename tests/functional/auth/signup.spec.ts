import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { HttpStatus } from '#lib/enums'

test.group('Auth Signup', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    return () => db.rollbackGlobalTransaction()
  })

  test('should not sign up a user with invalid email', async ({ client, route }) => {
    const response = await client.post(route('signup')).json({
      email: 'example',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    })
    response.assertStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    // todo)) use open api to assert response
  })

  test('should not sign up a user with missing payload', async ({ client, route }) => {
    const response = await client.post(route('signup')).json({
      email: 'example@test.com',
      password: 'password',
    })
    response.assertStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    // todo)) use open api to assert response
  })

  test('should sign up a user', async ({ client, route }) => {
    const response = await client.post(route('signup')).json({
      email: 'example@test.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    })
    response.assertStatus(HttpStatus.CREATED)
    // todo)) use open api to assert response
  })
})
