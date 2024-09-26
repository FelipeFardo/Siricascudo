import dayjs from 'dayjs'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getMonthCanceledOrdersAmount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/month-canceled-orders-amount',
      {
        schema: {
          tags: ['metrics'],
          summary: 'Get month canceled orders amount',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              amount: z.number().nullish(),
              diffFromLastMonth: z.number(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        const today = dayjs()
        const lastMonth = today.subtract(1, 'month')

        const startOfLastMonth = lastMonth.startOf('month')

        const orderPerMonth = await db
          .select({
            monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
            amonth: count(),
          })
          .from(orders)
          .where(
            and(
              eq(orders.organizationId, organization.id),
              eq(orders.status, 'canceled'),
              gte(orders.createdAt, startOfLastMonth.toDate()),
            ),
          )
          .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

        const currentMonthWithYear = today.format('YYYY-MM') // 2024-02
        const lastMonthWithYear = lastMonth.format('YYYY-MM') // 2024-01

        const currentMonthOrdersAmount = orderPerMonth.find((orderPerMonth) => {
          return orderPerMonth.monthWithYear === currentMonthWithYear
        })

        const lastMonthOrdersAmount = orderPerMonth.find((orderPerMonth) => {
          return orderPerMonth.monthWithYear === lastMonthWithYear
        })

        const diffFromLastMonth =
          currentMonthOrdersAmount && lastMonthOrdersAmount
            ? (currentMonthOrdersAmount.amonth * 100) /
              lastMonthOrdersAmount.amonth
            : null

        return {
          amount: currentMonthOrdersAmount?.amonth,
          diffFromLastMonth: diffFromLastMonth
            ? Number((diffFromLastMonth - 100).toFixed(2))
            : 0,
        }
      },
    )
}
