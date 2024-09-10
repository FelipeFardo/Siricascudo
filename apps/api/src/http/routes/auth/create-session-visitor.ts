import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { SessionRepository } from '@/repositories/session-repository'

export async function createSessionVisitor(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/visitor',
    {
      schema: {
        tags: ['session'],
        summary: 'Create a new visitor session',
        response: {
          201: z.object({
            sessionId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      let userId: string | null = null

      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        userId = sub
      } catch (error) {}

      const sessionRepository = new SessionRepository()

      const { id } = userId
        ? await sessionRepository.createSessionWithUserId(userId)
        : await sessionRepository.createSession()

      return reply.status(201).send({
        sessionId: id,
      })
    },
  )
}
