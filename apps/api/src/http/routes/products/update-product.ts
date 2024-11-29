import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, products } from '@/db/connection'

import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/products/:productId',
      {
        schema: {
          tags: ['products'],
          summary: 'Update product details',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
            priceInCents: z.number(),
            imageUrl: z.string(),
          }),
          params: z.object({
            slug: z.string(),
            productId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, productId } = request.params

        const { organization } = await request.getUserMembership(slug)

        const product = await db.query.products.findFirst({
          where(fields) {
            return and(
              eq(fields.organizationId, organization.id),
              eq(fields.id, productId),
            )
          },
        })

        if (!product) {
          throw new BadRequestError('Product Not Found')
        }

        const { name, description, imageUrl, priceInCents } = request.body

        await db
          .update(products)
          .set({
            name,
            description,
            imageUrl,
            priceInCents,
          })
          .where(eq(products.id, productId))

        return reply.status(204).send()
      },
    )
}
