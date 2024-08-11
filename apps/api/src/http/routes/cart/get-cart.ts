import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { carts, db } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/cart',

      {
        schema: {
          tags: ['carts'],
          summary: 'Get cart',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              cart: z.object({
                totalInCents: z.number(),
                quantityItems: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const sessionId = request.getCurrentSession()

        let cart = await db.query.carts.findFirst({
          where(fields, { eq }) {
            return eq(fields.sessionId, sessionId)
          },
        })

        if (!cart) {
          const [cartCreated] = await db
            .insert(carts)
            .values({
              sessionId,
              quantityItems: 0,
            })
            .returning()

          cart = cartCreated
        }

        return reply.status(200).send({
          cart: {
            quantityItems: 0,
            totalInCents: 0,
          },
        })
      },
    )
}

//   const userId = await request.getCurrentUserId()
//   const cart = await db.query.carts.findMany({
//     columns: {
//       id: true,
//       quantityItems: true,
//     },
//     where(fields, { eq, and }) {
//       return and(eq(fields.customerId, userId))
//     },
//   })
//   const items = cart.map((item) => ({
//     subTotalInCents: item.quantity * item.product.priceInCents,
//   }))
//   const totalInCents = items.reduce(
//     (total, product) => total + product.subTotalInCents,
//     0,
//   )
//   const cartFomart = {
//     quantityItems: items.length,
//     totalInCents,
//   }
//   return {
//     cart: cartFomart,
//   }
// },
