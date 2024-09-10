import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { visitorSession } from '@/http/middlewares/session'
import { CartRepository } from '@/repositories/cart-repository'
import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(visitorSession)
    .post(
      '/sessions/password',
      {
        schema: {
          tags: ['auth'],
          summary: 'Authenticate with e-mail & password',
          body: z.object({
            email: z.string().email(),
            password: z.string(),
          }),
          response: {
            201: z.object({
              token: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { email, password } = request.body

        const userRepository = new UserRepository()

        const userFromEmail = await userRepository.getUserByEmail(email)

        if (!userFromEmail) {
          throw new BadRequestError('Invalid credentials.')
        }

        if (userFromEmail.passwordHash === null) {
          throw new BadRequestError(
            'User does not have a password, use social login.',
          )
        }

        const isPasswordValid = await compare(
          password,
          userFromEmail.passwordHash,
        )

        if (!isPasswordValid) {
          throw new BadRequestError('Invalid credentials.')
        }

        const sessionId = request.getCurrentSession()
        const sessionRepository = new SessionRepository()

        const cartRepository = new CartRepository()

        await sessionRepository.updateSessionUserId({
          sessionId,
          userId: userFromEmail.id,
        })

        // Juntar os carts

        // Mover os produtos para o cart do usuário
        const cartSession =
          await cartRepository.getCartWithItemsAndOrgSlugBySessionId(sessionId)

        const cartUser =
          await cartRepository.getCartWithItemsAndOrgSlugByCustomerId(
            userFromEmail.id,
          )

        if (cartUser && cartSession) {
          await Promise.all([
            await cartRepository.updateCartItemCartId({
              newCartId: cartUser?.id,
              oldCartId: cartSession?.id,
            }),

            // Resolver inconsistências da qnt de items and valor total
            await cartRepository.updateTotalInCentsAndQuantityItemsByCartId({
              quantityItems: cartSession.quantityItems + cartUser.quantityItems,
              totalInCents: cartSession.totalInCents + cartUser.totalInCents,
              cartId: cartUser.id,
            }),
          ])

          // Resolver duplicidades (items com o mesmo produto)
          cartUser.items.map(async (item) => {
            const itemsDuplicate =
              await cartRepository.getItemsByCartIdAndProductIdNotItemId({
                cartId: item.cartId,
                productId: item.productId,
                itemId: item.id,
              })
            if (itemsDuplicate) {
              await cartRepository.updateSubTotalAndQuantityByItemId({
                itemId: item.id,
                quantity: item.quantity + itemsDuplicate.quantity,
                subTotal: item.subTotalInCents + itemsDuplicate.subTotalInCents,
              })
              await cartRepository.deleteItemById(itemsDuplicate.id)
            }
          })
          await cartRepository.deleteCartById(cartSession.id)
        } else if (cartSession && !cartUser) {
          await cartRepository.updateUserIdByCartId({
            cartId: cartSession.id,
            userId: userFromEmail.id,
          })
        }

        const token = await reply.jwtSign(
          {
            sub: userFromEmail.id,
          },
          {
            sign: {
              expiresIn: '7d',
            },
          },
        )
        return reply.status(201).send({ token })
      },
    )
}
