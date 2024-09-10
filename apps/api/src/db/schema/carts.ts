import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { organizations, sessions, users } from '.'
import { cartsItems } from './cart-items'

export const carts = pgTable(
  'carts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    sessionId: uuid('session_id').references(() => sessions.id, {
      onDelete: 'cascade',
    }),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'cascade',
    }),
    totalInCents: integer('total_in_cents').default(0).notNull(),
    quantityItems: integer('quantity_items').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      customerIdKey: uniqueIndex('customer_id_key').using(
        'btree',
        table.customerId,
      ),
      sessionIdKey: uniqueIndex('session_id_key').using(
        'btree',
        table.sessionId,
      ),
    }
  },
)

export const cartsRelations = relations(carts, ({ one, many }) => ({
  items: many(cartsItems),
  organization: one(organizations, {
    fields: [carts.organizationId],
    references: [organizations.id],
  }),
  customer: one(users, {
    fields: [carts.customerId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [carts.sessionId],
    references: [sessions.id],
  }),
}))
