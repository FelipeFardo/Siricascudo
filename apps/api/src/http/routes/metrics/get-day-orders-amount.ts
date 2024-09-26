import dayjs from 'dayjs'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getDayOrdersAmount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/day-orders-amount',
      {
        schema: {
          tags: ['metrics'],
          summary: 'Get day orders amount',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              amount: z.number().nullish(),
              diffFromYesterday: z.number(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        const today = dayjs()
        const yesterday = today.subtract(1, 'day')
        const startOfYesterday = yesterday.startOf('day')

        const orderPerDay = await db
          .select({
            dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
            amonth: count(),
          })
          .from(orders)
          .where(
            and(
              eq(orders.organizationId, organization.id),
              gte(orders.createdAt, startOfYesterday.toDate()),
            ),
          )
          .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)

        const todayWithMonthAndYear = today.format('YYYY-MM-DD')
        const yesterdayWithMonthAndYear = yesterday.format('YYYY-MM-DD')

        const todayOrdersAmont = orderPerDay.find((orderPerDay) => {
          return orderPerDay.dayWithMonthAndYear === todayWithMonthAndYear
        })

        const yesterdayOrdersAmont = orderPerDay.find((orderPerDay) => {
          return orderPerDay.dayWithMonthAndYear === yesterdayWithMonthAndYear
        })

        const diffFromYesterday =
          todayOrdersAmont && yesterdayOrdersAmont
            ? (todayOrdersAmont.amonth * 100) / yesterdayOrdersAmont.amonth
            : null

        return {
          amount: todayOrdersAmont?.amonth ?? 0,
          diffFromYesterday: diffFromYesterday
            ? Number((diffFromYesterday - 100).toFixed(2))
            : 0,
        }
      },
    )
}
