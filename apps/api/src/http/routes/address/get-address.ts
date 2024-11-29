import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { auth } from '@/http/middlewares/auth'

export async function getAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/address',
      {
        schema: {
          tags: ['address'],
          security: [{ bearerAuth: [] }],
          summary: 'Get address',
          response: {
            201: z.object({
              addresses: z.array(
                z.object({
                  id: z.string(),
                  street: z.string(),
                  city: z.string(),
                  state: z.string(),
                  zipCode: z.string().nullable(),
                  complement: z.string().nullable(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  customerId: z.string().nullable(),
                  number: z.string(),
                  country: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const addresses = await db.query.address.findMany({
          where(fields, { eq }) {
            return eq(fields.customerId, userId)
          },
        })

        return reply.status(200).send({ addresses })
      },
    )
}
