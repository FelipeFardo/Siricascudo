import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { categoryOrganization } from '@/@types/category-organization'
import { db, members, organizations } from '@/db/connection'
import { createSlug } from '@/utils/create-slug'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Create a new organization',
          security: [{ bearerAuth: [] }],
          xRoles: ['user', 'admin'], // Documentando as roles autorizadas

          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
            // avatarUrl: z.string(),
            category: z.enum(categoryOrganization),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomain, category } =
          request.body

        if (domain) {
          const organizationByDomain = await db.query.organizations.findFirst({
            where(fields, { eq }) {
              return eq(fields.domain, domain)
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization with same domain already exists.',
            )
          }
        }

        let organizationId = ''

        await db.transaction(async (trx) => {
          const [organization] = await trx
            .insert(organizations)
            .values({
              name,
              slug: createSlug(name),
              domain,
              shouldAttachUsersByDomain,
              category,
              ownerId: userId,
              // avatarUrl,
            })
            .returning()

          organizationId = organization.id
          await trx.insert(members).values({
            organizationId: organization.id,
            userId,
            role: 'ADMIN',
          })
        })

        return reply.status(201).send({
          organizationId,
        })
      },
    )
}
