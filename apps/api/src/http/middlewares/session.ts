import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

export const visitorSession = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentSession = () => {
      if (!request.cookies.visitor) {
        throw new UnauthorizedError('Invalid Session')
      }
      return request.cookies.visitor
    }
  })
})
