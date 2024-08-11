import { roleSchema } from '@siricascudo/auth'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, members, users } from '@/db/connection'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { auth } from '../../middlewares/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['members'],
          summary: 'Get all organization members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()

        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            `You're not allowed to see organization members.`,
          )
        }

        const membersQuery = await db
          .select({
            members: {
              id: members.id,
              role: members.role,
            },
            users: {
              id: users.id,
              name: users.name,
              email: users.email,
              avatarUrl: users.avatarUrl,
            },
          })
          .from(members)
          .innerJoin(users, eq(members.userId, users.id))
          .where(eq(members.organizationId, organization.id))
          .orderBy(members.role)

        const membersWithRoles = membersQuery.map(({ users, members }) => {
          return {
            userId: users.id,
            ...users,
            ...members,
          }
        })

        return reply.send({ members: membersWithRoles })
      },
    )
}
