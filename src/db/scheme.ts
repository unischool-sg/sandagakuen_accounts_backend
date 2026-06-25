import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

const timestamp = (name: string) => integer(name, {
  mode: 'timestamp'
});

const users = sqliteTable('users', {
  id: text('id').primaryKey(),

  username: text('username').unique(),
  name: text('name'),
  email: text('email').unique(),

  accountId: text('account_id').unique(),

  createdAt: timestamp('created_at').default(new Date()),
  updatedAt: timestamp('updated_at').default(new Date())
})

const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),




  userId: text('user_id').unique()
})

const accountLinks = sqliteTable('links', {
  id: text('id').primaryKey(),
})
