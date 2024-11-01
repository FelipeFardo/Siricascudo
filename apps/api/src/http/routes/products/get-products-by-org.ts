import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { ProductRepository } from '@/repositories/product-repository'

export async function getProductsByOrg(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['product'],
          summary: 'Get products by Org Slug',
          security: [{ bearerAuth: [] }],

          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              products: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  description: z.string(),
                  imageUrl: z.string(),
                  organizationId: z.string(),
                  priceInCents: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        const productRepository = new ProductRepository()
        const products = await productRepository.getProductsByOrganizationId(
          organization.id,
        )

        return {
          products,
        }
      },
    )
}
