import { DrizzleD1Database } from "drizzle-orm/d1";

class CallbackRepository {
  constructor(private readonly db: DrizzleD1Database) { }

  async find(where: Record<string, string>) {
    return;
  }
}
