import dayjs from 'dayjs'
import { and, eq, gte, lte, sql, sum } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, orders } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getDailyReceiptInPeriod(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/daily-receipt-in-period',
      {
        schema: {
          tags: ['metrics'],
          summary: 'Get daily receipt in period',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            from: z.string().optional(),
            to: z.string().optional(),
          }),
          response: {
            200: z.array(
              z.object({
                date: z.string(),
                receipt: z.number(),
              }),
            ),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        const { from, to } = request.query

        const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
        const endDate = to
          ? dayjs(to)
          : from
            ? startDate.add(7, 'days')
            : dayjs()

        if (endDate.diff(startDate, 'days') > 7) {
          throw new BadRequestError(
            'You cannot List receipt in a large period than 7 days',
          )
        }

        const receiptPerDay = await db
          .select({
            date: sql<string>`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
            receipt: sum(orders.totalInCents).mapWith(Number),
          })
          .from(orders)
          .where(
            and(
              eq(orders.organizationId, organization.id),
              gte(
                orders.createdAt,
                startDate.startOf('day').add(startDate.utcOffset()).toDate(),
              ),
              lte(
                orders.createdAt,
                endDate.endOf('day').add(startDate.utcOffset()).toDate(),
              ),
            ),
          )
          .groupBy(sql`TO_CHAR(${orders.createdAt}, 'DD/MM')`)

        const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
          const [dayA, monthA] = a.date.split('/').map(Number)
          const [dayB, monthB] = b.date.split('/').map(Number)

          if (monthA === monthB) {
            return dayA - dayB
          } else {
            const dateA = new Date(2024, monthA - 1)
            const dateB = new Date(2024, monthB - 1)

            return dateA.getTime() - dateB.getTime()
          }
        })
        return orderedReceiptPerDay
      },
    )
}
