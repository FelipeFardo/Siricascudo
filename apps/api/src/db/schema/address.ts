import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { users } from '.'

export const address = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('contry').notNull(),
  number: text('number').notNull(),
  zipCode: text('zip_code'),
  complement: text('complement'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const addressRelations = relations(address, ({ one }) => ({
  customer: one(users, {
    fields: [address.customerId],
    references: [users.id],
  }),
}))
