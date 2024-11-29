import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, products } from '@/db/connection'

export async function createProduct(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:slug/reservation',
    {
      schema: {
        tags: ['reservation'],
        summary: 'Create a new reservation',
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
          priceInCents: z.number(),
        }),
        response: {
          201: z.object({
            reservationId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(201).send({
        reservationId: 'RESERVATION-ID',
      })
    },
  )
}
