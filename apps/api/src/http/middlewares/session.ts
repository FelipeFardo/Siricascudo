import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { db, sessions } from '../../db/connection'

export const session = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('onRequest', async (request, reply) => {
    if (!request.cookies.session) {
      const [session] = await db.insert(sessions).values({}).returning()

      reply.setCookie('session', session.id, {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 3600 * 24 * 7,
      })
    }
    request.getCurrentSession = () => {
      return request.cookies.session!
    }
  })
})
