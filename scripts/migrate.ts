#!/usr/bin/env bun
/**
 * Migration script that only runs if DATABASE_URL is set.
 * This allows builds to succeed in CI/CD environments without a database.
 */

export {};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("⏭️  DATABASE_URL not set, skipping migrations");
  process.exit(0);
}

const { migrateDb } = await import("../lib/db");

try {
  await migrateDb();
} catch {
  process.exit(1);
}
