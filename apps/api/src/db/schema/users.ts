import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { accounts, carts, invites, members, organizations, tokens } from '.'

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name'),
    email: text('email').notNull(),
    phone: text('phone'),
    emailVerified: timestamp('emailVerified'),
    passwordHash: text('password_hash'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex('users_email_key').using('btree', table.email),
    }
  },
)

export const usersRelations = relations(users, ({ many, one }) => ({
  tokens: many(tokens),
  accounts: many(accounts),
  invites: many(invites),
  members_on: many(members),
  owns_organizations: many(organizations),
  cart: one(carts),
}))
