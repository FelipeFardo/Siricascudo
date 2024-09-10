import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ProductRepository } from '@/repositories/product-repository'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getProduct(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/product/:productId',
    {
      schema: {
        tags: ['product'],
        summary: 'Get details from product',
        params: z.object({
          productId: z.string(),
        }),
        response: {
          200: z.object({
            product: z.object({
              id: z.string(),
              name: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              description: z.string(),
              organizationId: z.string(),
              priceInCents: z.number(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { productId } = request.params

      const productRepository = new ProductRepository()
      const product = await productRepository.getProductById(productId)

      if (!product) {
        throw new BadRequestError('Product Not found')
      }

      return {
        product,
      }
    },
  )
}
