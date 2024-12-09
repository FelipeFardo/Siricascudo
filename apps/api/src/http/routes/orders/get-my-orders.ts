import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getOrderUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/orders',
      {
        schema: {
          tags: ['orders'],
          summary: 'Get orders users details',
          security: [{ bearerAuth: [] }],

          response: {
            200: z.object({
              orders: z.array(
                z.object({
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
                  organization: z
                    .object({
                      name: z.string(),
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
                })
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const orders = await db.query.orders.findMany({
          columns: {
            id: true,
            status: true,
            totalInCents: true,
            createdAt: true,
          },
          with: {
            address: true,
            organization: {
              columns: {
                name: true,
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
          where(fields, { eq }) {
            return eq(fields.customerId, userId)
          },
          orderBy(fields, { desc }) {
            return desc(fields.createdAt)
          },
        })

        if (!orders) {
          throw new BadRequestError('Order not found')
        }

        return {
          orders,
        }
      }
    )
}
