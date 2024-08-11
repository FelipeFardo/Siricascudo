import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db, tokens } from '@/db/connection'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticate user profile',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await db.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, email)
        },
      })
      if (!userFromEmail) {
        // We don't want people to know if really exists
        return reply.status(201).send()
      }

      const [token] = await db
        .insert(tokens)
        .values({
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        })
        .returning()

      const { id: code } = token

      // Send e-mail with password recover link

      console.log('Recover password token: ', code)

      return reply.status(201).send()
    },
  )
}
