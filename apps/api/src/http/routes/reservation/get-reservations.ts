import { and, count, desc, eq, ilike, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, reservations } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function getReservations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/reservations',
      {
        schema: {
          tags: ['reservations'],
          summary: 'Get reservations by org',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            date: z.string().transform((dateString) => {
              const date = new Date(dateString)
              return date
            }),
            pageIndex: z.coerce.number().optional().default(1),
          }),
          response: {
            200: z.object({
              reservations: z.array(
                z.object({
                  description: z.string().nullable(),
                  createdAt: z.date(),
                  customerName: z.string(),
                  id: z.string(),
                  organizationId: z.string(),
                  customerEmail: z.string(),
                  numberOfPeople: z.number(),
                  reservationDate: z.string(),
                  reservationTime: z.string(),
                  hasArrived: z.boolean(),
                })
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
        const { date, pageIndex } = request.query

        const perPage = 10

        const baseQuery = db
          .select()
          .from(reservations)
          .where(
            and(
              eq(reservations.organizationId, organization.id),
              date
                ? eq(reservations.reservationDate, date.toISOString())
                : undefined
            )
          )

        const [amountOfReservationsQuery, allReservations] = await Promise.all([
          db.select({ count: count() }).from(baseQuery.as('baseQuery')),
          db
            .select()
            .from(baseQuery.as('baseQuery'))
            .offset(pageIndex * 10)
            .limit(10),
        ])

        const amountOfReservation = amountOfReservationsQuery[0].count

        return {
          reservations: allReservations,
          meta: {
            pageIndex,
            perPage,
            totalCount: amountOfReservation,
          },
        }
      }
    )
}
