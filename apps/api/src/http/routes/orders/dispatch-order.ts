import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function dispatchOrder(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/orders/:orderId/dispatch',
      {
        schema: {
          tags: ['orders'],
          summary: 'Dispatch order',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            orderId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, orderId } = request.params
        const { organization } = await request.getUserMembership(slug)

        const order = await db.query.orders.findFirst({
          where(fields, { eq, and }) {
            return and(
              eq(fields.id, orderId),
              eq(fields.organizationId, organization.id),
            )
          },
        })

        if (!order) {
          throw new BadRequestError('Order not found')
        }

        if (order.status !== 'processing') {
          throw new BadRequestError(
            'You can not dispatch orders that are not in "processing" status',
          )
        }

        await db
          .update(orders)
          .set({ status: 'delivering' })
          .where(eq(orders.id, orderId))

        return reply.status(204).send()
      },
    )
}
