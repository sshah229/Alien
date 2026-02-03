import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema, casing: "snake_case" });
}

// Lazy singleton
let _db: ReturnType<typeof createDb> | null = null;

function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// Proxy for lazy initialization - db is only created when first accessed
const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    const instance = getDb();
    const value = instance[prop as keyof typeof instance];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

/**
 * Run all pending database migrations.
 * @throws {Error} If migration fails (e.g., invalid SQL, connection issues)
 */
export async function migrateDb(): Promise<void> {
  console.log("Running database migrations...");
  try {
    await migrate(getDb(), { migrationsFolder: "./drizzle" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Database migration failed:", error);
    throw error;
  }
}

export { db, schema };
