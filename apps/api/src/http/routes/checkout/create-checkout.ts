import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '../../middlewares/auth'
import { CartRepository } from '@/repositories/cart-repository'
import { ProductRepository } from '@/repositories/product-repository'
import Stripe from 'stripe'
import { BadRequestError } from '../_errors/bad-request-error'
import { env } from '@siricascudo/env'
import { carts, db, orders, ordersItems } from '@/db/connection'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
})

export async function createCheckout(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/create-checkout-session',
      {
        schema: {
          tags: ['checkout'],
          summary: 'Create a new checkout',
          security: [{ bearerAuth: [] }],
          body: z.object({
            addressId: z.string().uuid(),
            payMethod: z.enum(['money', 'card']),
          }),
          response: {
            200: z.object({
              sessionId: z.string().nullable().optional(),
              orderId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { addressId, payMethod } = request.body

        const cartRepository = new CartRepository()
        const productRepository = new ProductRepository()

        const cartUser =
          await cartRepository.getCartWithItemsAndOrgSlugByCustomerId(userId)

        if (!cartUser?.items || cartUser.items.length === 0) {
          throw new BadRequestError('No items in the cart')
        }

        if (!cartUser.organizationId) {
          throw new BadRequestError('Organization not found')
        }

        const [order] = await db
          .insert(orders)
          .values({
            organizationId: cartUser.organizationId,
            totalInCents: cartUser.totalInCents,
            customerId: userId,
            methodPayment: payMethod,
            addressId,
            status: payMethod == 'money' ? 'pending' : 'not_paid',
          })
          .returning()

        await Promise.all(
          cartUser?.items.map(async (item) => {
            const product = await productRepository.getProductById(
              item.productId
            )

            if (!product) {
              throw new BadRequestError('Product Not found')
            }
            await db.insert(ordersItems).values({
              orderId: order.id,
              productId: product.id,
              priceInCents: product.priceInCents,
              quantity: item.quantity,
            })
          })
        )

        await db.delete(carts).where(eq(carts.id, cartUser.id))

        if (payMethod == 'money') {
          return reply.status(200).send({
            orderId: order.id,
          })
        }

        const lineItems = await Promise.all(
          cartUser?.items.map(async (item) => {
            const product = await productRepository.getProductById(
              item.productId
            )

            if (!product) {
              throw new BadRequestError('Product Not found')
            }

            return {
              price_data: {
                currency: 'brl',
                product_data: {
                  name: product.name,
                },
                unit_amount: product.priceInCents,
              },
              quantity: item.quantity,
            }
          })
        )

        if (!lineItems) {
          throw new BadRequestError('Deu algum erro')
        }

        // Crie uma sessão de checkout
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: lineItems,
          success_url: 'http://localhost:3000/orders', // URL de sucesso
          cancel_url: 'http://localhost:3000/checkout/cancel', // URL de cancelamento
          metadata: {
            orderId: order.id,
          },
        })

        return reply.status(200).send({
          sessionId: session.id,
          orderId: order.id,
        })
      }
    )
}
