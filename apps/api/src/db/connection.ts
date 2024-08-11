import { env } from '@siricascudo/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

import * as schema from './schema'
export * from './schema'
const connection = new Client({ connectionString: env.DATABASE_URL })

async function connect() {
  try {
    await connection.connect()
  } catch (error) {
    console.log(error)
  }
}

connect()
export const db = drizzle(connection, { schema })
