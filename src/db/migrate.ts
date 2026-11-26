import "../env";

import path from "node:path";
import { Client } from "pg";
import Postgrator from "postgrator";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const client = new Client({ connectionString });

async function migrate() {
  await client.connect();

  const postgrator = new Postgrator({
    migrationPattern: path
      .join(process.cwd(), "migrations", "*")
      .split(path.sep)
      .join(path.posix.sep),
    driver: "pg",
    execQuery: (query) => client.query(query),
    execSqlScript: async (sql) => {
      await client.query(sql);
    },
  });

  postgrator.on("migration-started", (migration) => {
    console.log(`Running migration: ${migration.filename}`);
  });

  try {
    const appliedMigrations = await postgrator.migrate(process.argv[2] ?? "max");

    console.log(
      appliedMigrations.length > 0
        ? `Applied ${appliedMigrations.length} migration(s).`
        : "Database is up to date.",
    );
  } finally {
    await client.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
