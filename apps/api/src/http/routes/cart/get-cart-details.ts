import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { visitorSession } from '@/http/middlewares/session'
import { CartRepository } from '@/repositories/cart-repository'

export async function getCartDetails(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(visitorSession)
    .get(
      '/cart/details',
      {
        schema: {
          tags: ['carts'],
          summary: 'Get cart details',
          response: {
            200: z.object({
              cart: z.object({
                organizationSlug: z.string().nullable(),
                items: z.array(
                  z.object({
                    id: z.string(),
                    productId: z.string(),
                    quantity: z.number(),
                    subTotalInCents: z.number(),
                  }),
                ),
                totalInCents: z.number(),
                quantityItems: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        let userId: string | null = null
        try {
          const { sub } = await request.jwtVerify<{ sub: string }>()
          userId = sub
        } catch {}

        const sessionId = request.getCurrentSession()

        const cartRepository = new CartRepository()
        const cart = userId
          ? await cartRepository.getCartWithItemsAndOrgSlugByCustomerId(userId)
          : await cartRepository.getCartWithItemsAndOrgSlugBySessionId(
              sessionId,
            )

        const cartItemsFormat = cart?.items.map((item) => {
          return {
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            subTotalInCents: item.subTotalInCents,
          }
        })

        const cartFomart = {
          quantityItems: cart?.quantityItems || 0,
          totalInCents: cart?.totalInCents || 0,
          items: cartItemsFormat || [],
          organizationSlug: cart?.organization?.slug || null,
        }

        return {
          cart: cartFomart,
        }
      },
    )
}
