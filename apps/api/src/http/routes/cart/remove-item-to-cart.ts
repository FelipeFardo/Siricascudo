import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { carts, db } from '@/db/connection'

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

        const cart = await db.query.carts.findFirst({
          columns: {
            id: true,
          },
          where(fields) {
            return and(eq(fields.customerId, userId), eq(fields.id, itemId))
          },
        })

        if (!cart) {
          throw new BadRequestError('Item not found.')
        }

        await db
          .delete(carts)
          .where(and(eq(carts.id, itemId), eq(carts.customerId, userId)))

        response.status(204)
      },
    )
}
