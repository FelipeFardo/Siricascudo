import { desc, eq, sum } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders, ordersItems, products } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getPopularProducts(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/popular-products',
      {
        schema: {
          tags: ['metrics'],
          summary: 'Get popular products',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                product: z.string().nullable(),
                amount: z.number(),
              }),
            ),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        const popularProducts = await db
          .select({
            product: products.name,
            amount: sum(ordersItems.quantity).mapWith(Number),
          })
          .from(ordersItems)
          .leftJoin(orders, eq(orders.id, ordersItems.orderId))
          .leftJoin(products, eq(products.id, ordersItems.productId))
          .where(eq(orders.organizationId, organization.id))
          .groupBy(products.name)
          .orderBy((fields) => {
            return desc(fields.amount)
          })
          .limit(5)

        return popularProducts
      },
    )
}
