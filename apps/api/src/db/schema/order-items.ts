import { relations } from 'drizzle-orm'
import { integer, pgTable, uuid } from 'drizzle-orm/pg-core'

import { orders, products } from '.'

export const ordersItems = pgTable('orders_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  priceInCents: integer('price_in_cents').notNull(),
  quantity: integer('quantity').notNull(),
})

export const ordersItemsRelations = relations(ordersItems, ({ one }) => ({
  order: one(orders, {
    fields: [ordersItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [ordersItems.productId],
    references: [products.id],
  }),
}))
