import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ProductRepository } from '@/repositories/product-repository'

export async function getProducts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/product',
    {
      schema: {
        tags: ['product'],
        summary: 'Get all products',

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
                organization: z.object({
                  slug: z.string(),
                }),
              }),
            ),
          }),
        },
      },
    },
    async () => {
      const productRepository = new ProductRepository()
      const products = await productRepository.getProductsWithOrganizationSlug()

      return {
        products,
      }
    },
  )
}
