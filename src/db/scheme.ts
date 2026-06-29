import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'


// ========== 列タイプヘルパー ==========
const timestamp = (name: string) => integer(name, { mode: 'timestamp' })
const bool = (name: string) => integer(name, { mode: 'boolean' }).default(false)

// ========== 列挙型 ==========
const userRoles = ['user', 'student: junior', 'student: high', 'teacher', 'staff', 'admin'] as const
const enrollmentStatuses = ['enrolled', 'graduated', 'transferred', 'withdrawn', 'suspended'] as const
const gradeCategories = ['junior_high', 'senior_high'] as const

// ========== 1. ユーザー（全ユーザーの共通基盤） ==========
const users = sqliteTable('users', {
  id: text('id').primaryKey(),

  username: text('username').unique(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: bool('email_verified'),
  avatarUrl: text('avatar_url'),

  role: text('role', { enum: userRoles }),
  status: text('status', { enum: enrollmentStatuses }).default('enrolled'),

  isBanned: bool('is_banned').default(false),
  permissionBitfield: text('permission_bitfield').default('0'),

  createdAt: timestamp('created_at').default(new Date()),
  updatedAt: timestamp('updated_at').default(new Date()),
})

// ========== 2. 学年マスタ（中1=1, 中2=2, …, 高3=6） ==========
const gradeLevels = sqliteTable('grade_levels', {
  id: text('id').primaryKey(),
  code: integer('code').unique(),
  name: text('name'),
  shortName: text('short_name'),
  category: text('category', { enum: gradeCategories }),
  sortOrder: integer('sort_order'),
})

// ========== 3. 教員部署マスタ ==========
const departments = sqliteTable('departments', {
  id: text('id').primaryKey(),
  name: text('name').unique(),
  shortName: text('short_name'),
})

// ========== 4. 教員拡張情報 ==========
const teachers = sqliteTable('teachers', {
  id: text('id').primaryKey().references(() => users.id),
  employeeNumber: text('employee_number').unique(),
  departmentId: text('department_id').references(() => departments.id),

  updatedAt: timestamp('updated_at').default(new Date()),
})

// ========== 5. クラス/組 ==========
const classes = sqliteTable('classes', {
  id: text('id').primaryKey(),
  academicYear: integer('academic_year'),
  gradeLevelId: text('grade_level_id').references(() => gradeLevels.id),
  name: text('name'),
  homeroomTeacherId: text('homeroom_teacher_id').references(() => teachers.id),

  createdAt: timestamp('created_at').default(new Date()),
})

// ========== 6. 生徒拡張情報 ==========
const students = sqliteTable('students', {
  id: text('id').primaryKey().references(() => users.id),
  studentNumber: integer('student_number'),
  enteredYear: integer('entered_year'),

  updatedAt: timestamp('updated_at').default(new Date()),
})

// ========== 7. 在籍履歴（年度ごとの所属クラス） ==========
const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey(),
  studentId: text('student_id').references(() => students.id),
  classId: text('class_id').references(() => classes.id),
  academicYear: integer('academic_year'),
  status: text('status', { enum: enrollmentStatuses }).default('enrolled'),

  createdAt: timestamp('created_at').default(new Date()),
})

// ========== 8. 認証セッション ==========
const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  refreshToken: text('refresh_token').unique(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),

  createdAt: timestamp('created_at').default(new Date()),
})

// ========== 9. 外部ID連携（OAuth/OpenID Connect） ==========
const externalIdentities = sqliteTable('external_identities', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  provider: text('provider'),
  providerAccountId: text('provider_account_id'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),

  createdAt: timestamp('created_at').default(new Date()),
  updatedAt: timestamp('updated_at').default(new Date()),
})

// ========== 10. OAuthクライアント（外部アプリケーション登録） ==========
const oauthClients = sqliteTable('oauth_clients', {
  id: text('id').primaryKey(),
  name: text('name').default('unknown app'),
  description: text('description'),
  redirectUrls: text('redirect_urls', { mode: 'json' }),

  clientId: text('client_id').unique(),
  clientSecret: text('client_secret'),

  createdAt: timestamp('created_at').default(new Date()),
  updatedAt: timestamp('updated_at').default(new Date()),
})

// ========== 11. OAuth認可コード ==========
const authorizationCodes = sqliteTable('authorization_codes', {
  id: text('id').primaryKey(),
  clientId: text('client_id').references(() => oauthClients.clientId),
  userId: text('user_id').references(() => users.id),
  code: text('code').unique(),
  redirectUrl: text('redirect_url'),
  codeChallenge: text('code_challenge'),
  codeChallengeMethod: text('code_challenge_method'),
  scopes: text('scopes', { mode: 'json' }),
  expiresAt: timestamp('expires_at'),

  createdAt: timestamp('created_at').default(new Date()),
})



export {
  users,
  gradeLevels,
  departments,
  teachers,
  classes,
  students,
  enrollments,
  sessions,
  externalIdentities,
  oauthClients,
  authorizationCodes,
}

