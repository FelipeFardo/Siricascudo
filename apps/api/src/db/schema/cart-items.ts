import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { carts, products } from '.'

export const cartsItems = pgTable(
  'cart_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cartId: uuid('cart_id')
      .references(() => carts.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    quantity: integer('quantity').notNull().default(1),
    subTotalInCents: integer('sub_total_in_cents').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      itemIdProductIdKey: uniqueIndex(
        'cart_items_cart_id_product_id_key',
      ).using('btree', table.cartId, table.productId),
    }
  },
)

export const cartsItemsRelations = relations(cartsItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartsItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartsItems.productId],
    references: [products.id],
  }),
}))
