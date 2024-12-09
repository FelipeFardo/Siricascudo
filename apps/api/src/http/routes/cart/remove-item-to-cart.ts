import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { carts, cartsItems, db } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function RemoveItemToCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/cart/:itemId',
      {
        schema: {
          tags: ['carts'],
          summary: 'Remove item to cart',
          security: [{ bearerAuth: [] }],
          params: z.object({
            itemId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, response) => {
        const userId = await request.getCurrentUserId()
        const { itemId } = request.params

        const [cart] = await db
          .select()
          .from(carts)
          .innerJoin(cartsItems, eq(cartsItems.cartId, carts.id))
          .where(and(eq(cartsItems.id, itemId), eq(carts.customerId, userId)))

        if (!cart) {
          throw new BadRequestError('Item not found.')
        }

        const quantityItems =
          cart.carts.quantityItems - cart.cart_items.quantity

        if (quantityItems) {
          await db
            .update(carts)
            .set({
              totalInCents:
                cart.carts.totalInCents - cart.cart_items.subTotalInCents,
              quantityItems:
                cart.carts.quantityItems - cart.cart_items.quantity,
            })
            .where(eq(carts.id, cart.carts.id))
          await db.delete(cartsItems).where(eq(cartsItems.id, itemId))
        } else {
          await db.delete(carts).where(eq(carts.id, cart.carts.id))
        }

        response.status(204)
      }
    )
}
