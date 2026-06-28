import { DrizzleD1Database } from "drizzle-orm/d1";
import { SQL } from "drizzle-orm";
import { users } from "../../../db/scheme";

type UserInsert = typeof users.$inferInsert;


class CallbackRepository {
  constructor(private readonly db: DrizzleD1Database) { }

  async findUser(where: SQL<unknown>) {
    return this.db.select().from(users).where(where).execute()
  }

  async insert(data: UserInsert) {
    return this.db.insert(users).values(data).execute()
  }
}


export { CallbackRepository }
