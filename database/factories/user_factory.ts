import User from '#models/user'
import factory from '@adonisjs/lucid/factories'

export const UserFactory = factory
  .define(User, async ({ faker }) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ allowSpecialCharacters: false }).toLowerCase(),
    password: faker.internet.password(),
  }))
  .build()
