import dayjs from 'dayjs'
import { and, eq, gte, sql, sum } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getMonthReceipt(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/month-receipt',
      {
        schema: {
          tags: ['metrics'],
          summary: 'Get month receipt',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              receipt: z.number().nullish(),
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

        const monthsReceipts = await db
          .select({
            monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
            receipt: sum(orders.totalInCents).mapWith(Number),
          })
          .from(orders)
          .where(
            and(
              eq(orders.organizationId, organization.id),
              gte(orders.createdAt, startOfLastMonth.toDate()),
            ),
          )
          .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

        const currentMonthWithYear = today.format('YYYY-MM') // 2024-02
        const lastMonthWithYear = lastMonth.format('YYYY-MM') // 2024-01

        const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
          return monthReceipt.monthWithYear === currentMonthWithYear
        })

        const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
          return monthReceipt.monthWithYear === lastMonthWithYear
        })

        const diffFromLastMonth =
          currentMonthReceipt && lastMonthReceipt
            ? (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt
            : null

        return {
          receipt: currentMonthReceipt?.receipt,
          diffFromLastMonth: diffFromLastMonth
            ? Number((diffFromLastMonth - 100).toFixed(2))
            : 0,
        }
      },
    )
}
