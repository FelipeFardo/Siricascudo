import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db, products } from '@/db/connection'

import { auth } from '../../middlewares/auth'

export async function createProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['products'],
          summary: 'Create a new product',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
            priceInCents: z.number(),
            imageUrl: z.string(),
          }),
          response: {
            201: z.object({
              productId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { name, imageUrl, priceInCents, description } = request.body

        const { slug } = request.params

        const { organization } = await request.getUserMembership(slug)

        const [product] = await db
          .insert(products)
          .values({
            description,
            imageUrl,
            name,
            organizationId: organization.id,
            priceInCents,
          })
          .returning()

        return reply.status(201).send({
          productId: product.id,
        })
      },
    )
}
