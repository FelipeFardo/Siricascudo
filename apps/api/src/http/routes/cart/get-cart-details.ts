import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { categoryOrganization } from '@/@types/category-organization'
import { db } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getCartDetails(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/cart/details',
      {
        schema: {
          tags: ['carts'],
          summary: 'Get cart details',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              cart: z.object({
                organization: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    category: z.enum(categoryOrganization),
                  })
                  .nullable(),
                items: z.array(
                  z.object({
                    id: z.string(),
                    product: z.object({
                      id: z.string(),
                      name: z.string(),
                      priceInCents: z.number(),
                    }),
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
        const userId = await request.getCurrentUserId()

        const cart = await db.query.carts.findMany({
          columns: {
            id: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                priceInCents: true,
              },
              with: {
                organization: {
                  columns: {
                    id: true,
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
          where(fields, { eq, and }) {
            return and(eq(fields.customerId, userId))
          },
        })

        const organization =
          cart.length > 0 ? cart[0].product.organization : null

        const items = cart.map((item) => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            priceInCents: item.product.priceInCents,
          },
          quantity: item.quantity,
          subTotalInCents: item.quantity * item.product.priceInCents,
        }))

        const totalInCents = items.reduce(
          (total, product) => total + product.subTotalInCents,
          0,
        )

        const cartFomart = {
          quantityItems: items.length,
          totalInCents,
          items,
          organization,
        }

        return {
          cart: cartFomart,
        }
      },
    )
}
