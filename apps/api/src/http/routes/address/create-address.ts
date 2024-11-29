import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { address, db } from '@/db/connection'
import { auth } from '@/http/middlewares/auth'

export async function createAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/address',
      {
        schema: {
          tags: ['address'],
          security: [{ bearerAuth: [] }],
          summary: 'Add a new address',
          body: z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            complement: z.string().optional().nullable(),
            country: z.string(),
            number: z.string(),
            zipCode: z.string().transform((value) => value.replace(/\D/g, '')),
          }),
          response: {
            201: z.object({
              address: z.object({
                id: z.string(),
                street: z.string(),
                city: z.string(),
                state: z.string(),
                complement: z.string().optional().nullable(),
                country: z.string(),
                number: z.string(),
                zipCode: z.string().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        console.log(userId)
        console.log(request.body)
        const { city, complement, state, street, zipCode, country, number } =
          request.body

        const [addressCreated] = await db
          .insert(address)
          .values({
            customerId: userId,
            city,
            state,
            street,
            zipCode,
            complement,
            country,
            number,
          })
          .returning()

        return reply.status(201).send({
          address: {
            city: addressCreated.city,
            country: addressCreated.country,
            id: addressCreated.id,
            number: addressCreated.number,
            state: addressCreated.state,
            street: addressCreated.street,
            zipCode: addressCreated.zipCode,
            complement: addressCreated.complement,
          },
        })
      }
    )
}
