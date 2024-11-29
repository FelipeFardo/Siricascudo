import { relations } from 'drizzle-orm'
import {
  date,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { organizations } from '.'

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerName: text('customer_name').notNull(),
  email: text('customer_email').notNull(),
  numberOfPeople: integer('number_of_people').notNull(),
  reservationDate: date('reservation_date').notNull(),
  reservationTime: time('reservation_time').notNull(),
  description: text('description').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const reservationsRelations = relations(reservations, ({ one }) => ({
  organization: one(organizations, {
    fields: [reservations.organizationId],
    references: [organizations.id],
  }),
}))