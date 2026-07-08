import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from '../utils/db'

// Применить сгенерированные миграции. Запуск: pnpm db:migrate
await migrate(db, { migrationsFolder: './server/db/migrations' })
console.log('Миграции применены.')
process.exit(0)
