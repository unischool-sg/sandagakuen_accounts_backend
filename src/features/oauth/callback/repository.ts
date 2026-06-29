import { DrizzleD1Database } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { users } from "../../../db/scheme";

type UserInsert = typeof users.$inferInsert
type UserSelect = typeof users.$inferSelect
type UserWhere = {
  [K in keyof UserSelect]?: UserSelect[K]
}

class CallbackRepository {
  constructor(private readonly db: DrizzleD1Database) { }

  async findUser(where: UserWhere) {
    const conditions = Object.entries(where).map(
      ([key, value]) => eq(users[key as keyof UserSelect], value as never)
    )
    return this.db.select().from(users).where(and(...conditions)).execute()
  }

  async insert(data: UserInsert) {
    return this.db.insert(users).values(data).execute()
  }
}


export { CallbackRepository }
