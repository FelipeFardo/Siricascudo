import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { visitorSession } from '@/http/middlewares/session'

import { CartRepository } from '../../../repositories/cart-repository'
import { ProductRepository } from '../../../repositories/product-repository'
import { BadRequestError } from '../_errors/bad-request-error'

export async function InsertItemToCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(visitorSession)
    .post(
      '/cart/item',
      {
        schema: {
          tags: ['carts'],
          summary: 'Insert product to cart',
          body: z.object({
            productId: z.string(),
            quantity: z.number().optional().default(1),
          }),
          response: {
            201: z.object({
              cartItemId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { productId, quantity } = request.body

        let userId: string | null = null
        try {
          const { sub } = await request.jwtVerify<{ sub: string }>()
          userId = sub
        } catch {}

        const sessionId = request.getCurrentSession()

        const cartRepository = new CartRepository()
        const productsRepository = new ProductRepository()

        const cart = userId
          ? await cartRepository.getCartByCustomerId(userId)
          : await cartRepository.getCartBySessionId(sessionId)

        let cartId = cart?.id || ''
        if (!cart) {
          const [cart] = await cartRepository.createEmptyCart({
            customerId: userId,
            sessionId,
          })

          cartId = cart.id
        }

        const product = await productsRepository.getProductById(productId)

        if (!product) {
          throw new BadRequestError('Product Not found')
        }

        const item = await cartRepository.getItemsByCartIdAndProductId({
          cartId,
          productId,
        })

        let itemId = item?.id || ''
        if (item) {
          await cartRepository.updateSubTotalAndQuantityByItemId({
            quantity: item.quantity + quantity,
            subTotal: product.priceInCents * (item.quantity + quantity),
            itemId: item.id,
          })
        } else {
          const [cartItem] = await cartRepository.addItemInCart({
            cartId,
            productId: product.id,
            quantity,
            subTotalInCents: product.priceInCents * quantity,
          })
          itemId = cartItem.id
        }
        if (cart) {
          await cartRepository.updateTotalInCentsAndQuantityItemsByCartId({
            quantityItems: cart.quantityItems + quantity,
            totalInCents: cart.totalInCents + product.priceInCents * quantity,
            cartId: cart.id,
          })
        } else {
          await cartRepository.updateTotalInCentsAndQuantityItemsByCartId({
            quantityItems: 0 + quantity,
            totalInCents: 0 + product.priceInCents * quantity,
            cartId,
          })
        }

        await cartRepository.updateOrganizationIdByCart({
          cartId,
          organizationId: product.organizationId,
        })

        reply.status(201).send({
          cartItemId: itemId,
        })
      },
    )
}
