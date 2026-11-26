import "../env";

import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function applyMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "migrations"),
    });

    console.log("Database is up to date.");
  } finally {
    await client.end();
  }
}

applyMigrations().catch((error) => {
  console.error(error);
  process.exit(1);
});
