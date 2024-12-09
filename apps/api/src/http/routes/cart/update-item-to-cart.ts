import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { carts, cartsItems, db, products } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function UpdateItemToCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/cart/:itemId',
      {
        schema: {
          tags: ['carts'],
          summary: 'Update item to cart',
          security: [{ bearerAuth: [] }],
          params: z.object({
            itemId: z.string(),
          }),
          body: z.object({
            quantity: z.number(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, response) => {
        const userId = await request.getCurrentUserId()
        const { itemId } = request.params
        const { quantity } = request.body

        const [cart] = await db
          .select()
          .from(carts)
          .innerJoin(cartsItems, eq(cartsItems.cartId, carts.id))
          .where(and(eq(cartsItems.id, itemId), eq(carts.customerId, userId)))

        if (!cart) {
          throw new BadRequestError('Item not found.')
        }

        const product = await db.query.products.findFirst({
          where(fields, { eq }) {
            return eq(products.id, cart.cart_items.productId)
          },
        })

        if (!product) {
          throw new BadRequestError('Product Not found')
        }
        const quantityItems =
          cart.carts.quantityItems - cart.cart_items.quantity + quantity

        await db
          .update(carts)
          .set({
            totalInCents:
              cart.carts.totalInCents -
              cart.cart_items.subTotalInCents +
              product?.priceInCents * quantity,
            quantityItems: quantityItems,
          })
          .where(eq(carts.id, cart.carts.id))

        await db
          .update(cartsItems)
          .set({
            subTotalInCents: product.priceInCents * quantity,
            quantity,
          })
          .where(eq(cartsItems.id, itemId))

        response.status(204)
      }
    )
}
