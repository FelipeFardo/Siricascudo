import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { visitorSession } from '@/http/middlewares/session'
import { CartRepository } from '@/repositories/cart-repository'

export async function getCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(visitorSession)
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
        let userId: string | null = null

        try {
          const { sub } = await request.jwtVerify<{ sub: string }>()
          userId = sub
        } catch {}

        const sessionId = request.getCurrentSession()

        const cartRepository = new CartRepository()

        const cart = userId
          ? await cartRepository.getCartByCustomerId(userId)
          : await cartRepository.getCartBySessionId(sessionId)

        return reply.status(200).send({
          cart: {
            quantityItems: cart?.quantityItems || 0,
            totalInCents: cart?.totalInCents || 0,
          },
        })
      },
    )
}
