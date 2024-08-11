import { migrate } from 'drizzle-orm/node-postgres/migrator'

import { db } from './connection'

async function migrateDevelopment() {
  try {
    await migrate(db, {
      migrationsFolder: __dirname.concat('/migrations'),
    })
    console.log('Migration completed')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

migrateDevelopment()
