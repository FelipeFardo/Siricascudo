import { roleSchema } from '@siricascudo/auth'
import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, invites, members, users } from '@/db/connection'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
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

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            `You're not allowed to create new invites.`,
          )
        }

        const { email, role } = request.body

        const [, domain] = email.split('@')

        if (
          organization.shouldAttachUsersByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `Users with "${domain}" domain will join your organization automatically on login`,
          )
        }

        const inviteWithSameEmail = await db.query.invites.findFirst({
          where(fields, { and, eq }) {
            return and(
              eq(fields.email, email),
              eq(fields.organizationId, organization.id),
            )
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with same e-mail already exists.',
          )
        }

        const [memberWithSameEmail] = await db
          .select()
          .from(members)
          .innerJoin(users, eq(members.userId, users.id))
          .where(
            and(
              eq(members.organizationId, organization.id),
              eq(users.email, email),
            ),
          )

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'A member with this e-mail already belongs to your organization.',
          )
        }

        const [invite] = await db
          .insert(invites)
          .values({
            organizationId: organization.id,
            email,
            role,
            authorId: userId,
          })
          .returning()

        return reply.status(201).send({
          inviteId: invite.id,
        })
      },
    )
}
