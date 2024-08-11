import { and, count, desc, eq, ilike, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders, users } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getOrders(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/orders',
      {
        schema: {
          tags: ['orders'],
          summary: 'Get orders',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            pageIndex: z.coerce.number().optional().default(1),
            orderId: z.string().nullable().optional(),
            customerName: z.string().nullable().optional(),
            status: z
              .enum([
                'canceled',
                'processing',
                'pending',
                'delivering',
                'delivered',
              ])
              .optional(),
          }),
          response: {
            200: z.object({
              orders: z.array(
                z.object({
                  orderId: z.string(),
                  createdAt: z.date(),
                  status: z.enum([
                    'pending',
                    'canceled',
                    'processing',
                    'delivering',
                    'delivered',
                  ]),
                  customerName: z.string(),
                  total: z.number(),
                }),
              ),
              meta: z.object({
                pageIndex: z.number(),
                perPage: z.number(),
                totalCount: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)
        const { pageIndex, customerName, orderId, status } = request.query

        const perPage = 10

        const baseQuery = db
          .select({
            orderId: orders.id,
            createdAt: orders.createdAt,
            status: orders.status,
            total: orders.totalInCents,
            customerName: users.name,
          })
          .from(orders)
          .innerJoin(users, eq(users.id, orders.customerId))
          .where(
            and(
              eq(orders.organizationId, organization.id),
              orderId ? sql`orders.id::text LIKE ${`%${orderId}%`}` : undefined,
              status ? eq(orders.status, status) : undefined,
              customerName ? ilike(users.name, `%${customerName}%`) : undefined,
            ),
          )

        const [amountOfOrdersQuery, allOrders] = await Promise.all([
          db.select({ count: count() }).from(baseQuery.as('baseQuery')),
          db
            .select()
            .from(baseQuery.as('baseQuery'))
            .offset(pageIndex * 10)
            .limit(10)
            .orderBy((fields) => {
              return [
                sql`CASE ${fields.status}
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'delivering' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'canceled' THEN 99
            END`,
                desc(fields.createdAt),
              ]
            }),
        ])

        const amountOfOrders = amountOfOrdersQuery[0].count

        return {
          orders: allOrders,
          meta: {
            pageIndex,
            perPage,
            totalCount: amountOfOrders,
          },
        }
      },
    )
}
