import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

const timestamp = (name: string) => integer(name, {
  mode: 'timestamp'
});

const users = sqliteTable('users', {
  id: text('id').primaryKey(),

  username: text('username').unique(),
  name: text('name'),
  email: text('email').unique(),
  avater: text('avater_url'),
  age: integer('age'),

  createdAt: timestamp('created_at').default(new Date()),
  updatedAt: timestamp('updated_at').default(new Date())
})

const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),

  accessToken: text('access_token').unique(),
  email: text('email').unique(),
  avater: text('avater_url'),
})

const accountLinks = sqliteTable('links', {
  id: text('id').primaryKey(),

})

export { users, accounts, accountLinks }
