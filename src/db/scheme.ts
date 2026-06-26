import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'


// enumの定義
const status = ["belong", "graduated"]
const userRoles = ["student:junior", "student:high", "teacher", "user"];
type UserRole = typeof userRoles;


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


  status: text('status', {
    mode: "text",
    enum: status
  }),
  role: text('role', {
    mode: "text",
    enum: userRoles
  }),

  isBanned: integer('is_banned', {
    mode: "boolean"
  }).default(false),

  permission: text('permission_bit_field').default('0'),

  createdAt: timestamp('created_at').default(new Date()),
  updatedAt: timestamp('updated_at').default(new Date())
})

const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),

  accessToken: text('access_token').unique(),
  refreshToken: text('refresh_token'),
})

const accountLinks = sqliteTable('links', {
  id: text('id').primaryKey(),

  accountId: text('account_id'),
  userId: text('user_id'),
});

const oauthCredentials = sqliteTable('credentials', {
  id: text('id'),

  name: text('name').default('unknown app'),
  description: text('desciption'),

  clientId: text('client_id').unique(),
  clientSecret: text('client_secret'),
})

const redirectUrls = sqliteTable('')

export { users, accounts, accountLinks }
