import { defineConfig } from 'drizzle-kit'

// generate работает офлайн (только по схеме). Применение миграций — через
// server/db/migrate.ts (drizzle-orm/libsql/migrator), чтобы одинаково работало
// с file: и turso URL.
export default defineConfig({
  dialect: 'turso',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:./.data/local.db',
    authToken: process.env.TURSO_AUTH_TOKEN
  }
})
