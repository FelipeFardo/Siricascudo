import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { carts, db } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function InsertItemToCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/cart/',
      {
        schema: {
          tags: ['carts'],
          summary: 'Insert product to cart',
          security: [{ bearerAuth: [] }],
          body: z.object({
            productId: z.string(),
            quantity: z.number().optional().default(1),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, response) => {
        const userId = await request.getCurrentUserId()

        const { quantity, productId } = request.body

        const cart = await db.query.carts.findFirst({
          columns: {
            id: true,
            quantity: true,
          },
          with: {
            product: {
              with: {
                organization: {
                  columns: {
                    id: true,
                  },
                },
              },
            },
          },
          where(fields, { eq, and }) {
            return and(eq(fields.customerId, userId))
          },
        })

        if (cart) {
          const product = await db.query.products.findFirst({
            columns: {},
            with: {
              organization: {
                columns: {
                  id: true,
                },
              },
            },
            where(fields, { eq }) {
              return eq(fields.id, productId)
            },
          })

          if (!product) {
            throw new BadRequestError('Product Not found.')
          }

          if (product.organization.id !== cart.product.organization.id) {
            throw new BadRequestError(
              'Only items from the same organization are allowed in the cart.',
            )
          }
        }

        await db.insert(carts).values({
          customerId: userId,
          productId,
          quantity,
        })

        response.status(201)
      },
    )
}
