import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getOrderDetails(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/orders/:orderId',
      {
        schema: {
          tags: ['orders'],
          summary: 'Get order details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            orderId: z.string(),
          }),
          response: {
            200: z.object({
              order: z.object({
                id: z.string(),
                createdAt: z.date(),
                totalInCents: z.number(),
                status: z.enum([
                  'pending',
                  'canceled',
                  'processing',
                  'delivering',
                  'delivered',
                  'not_paid',
                ]),
                address: z
                  .object({
                    number: z.string(),
                    id: z.string(),
                    createdAt: z.date(),
                    updatedAt: z.date(),
                    customerId: z.string().nullable(),
                    street: z.string(),
                    city: z.string(),
                    state: z.string(),
                    country: z.string(),
                    zipCode: z.string().nullable(),
                    complement: z.string().nullable(),
                  })
                  .nullable(),
                customer: z
                  .object({
                    name: z.string(),
                    email: z.string(),
                    phone: z.string().nullable(),
                  })
                  .nullable(),
                ordersItems: z.array(
                  z.object({
                    id: z.string(),
                    priceInCents: z.number(),
                    quantity: z.number(),
                    product: z
                      .object({
                        name: z.string(),
                      })
                      .nullable(),
                  })
                ),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, orderId } = request.params
        const { organization } = await request.getUserMembership(slug)

        const order = await db.query.orders.findFirst({
          columns: {
            id: true,
            status: true,
            totalInCents: true,
            createdAt: true,
          },
          with: {
            address: true,
            customer: {
              columns: {
                name: true,
                phone: true,
                email: true,
              },
            },
            ordersItems: {
              columns: {
                id: true,
                priceInCents: true,
                quantity: true,
              },
              with: {
                product: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
          where(fields, { eq, and }) {
            return and(
              eq(fields.id, orderId),
              eq(fields.organizationId, organization.id)
            )
          },
        })

        if (!order) {
          throw new BadRequestError('Order not found')
        }

        return {
          order,
        }
      }
    )
}
