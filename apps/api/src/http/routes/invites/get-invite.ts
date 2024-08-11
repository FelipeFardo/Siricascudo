import { roleSchema } from '@siricascudo/auth'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, invites, organizations, users } from '@/db/connection'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()

    .get(
      '/invites/:inviteId',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get an invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              invite: z.object({
                id: z.string().uuid(),
                email: z.string().email(),
                role: roleSchema,
                createdAt: z.date(),
                organization: z.object({
                  name: z.string(),
                }),
                author: z
                  .object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().url().nullable(),
                  })
                  .nullable(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { inviteId } = request.params

        const [invite] = await db
          .select({
            invite: {
              id: invites.id,
              email: invites.email,
              role: invites.role,
              createdAt: invites.createdAt,
            },
            author: {
              id: users.id,
              name: users.name,
              avatarUrl: users.avatarUrl,
            },
            organization: {
              name: organizations.name,
            },
          })
          .from(invites)
          .leftJoin(users, eq(invites.authorId, users.id))
          .leftJoin(organizations, eq(invites.organizationId, organizations.id))
          .where(eq(invites.id, inviteId))

        if (!invite) {
          throw new BadRequestError('Invite not found')
        }

        const invitFormat = {
          author: invite.author,
          organization: invite.organization!,
          ...invite.invite,
        }

        return {
          invite: invitFormat,
        }
      },
    )
}
