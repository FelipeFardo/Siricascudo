import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { ordersItems, organizations, users } from '.'

export const orderStatus = pgEnum('order_status', [
  'pending',
  'delivering',
  'processing',
  'delivered',
  'canceled',
])

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: orderStatus('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  customerId: uuid('customer_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  ordersItems: many(ordersItems),
}))
