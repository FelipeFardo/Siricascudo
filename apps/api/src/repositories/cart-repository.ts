import { eq } from 'drizzle-orm'

import { carts, cartsItems, db } from '@/db/connection'

export class CartRepository {
  async getCartBySessionId(sessionId: string) {
    const cart = await db.query.carts.findFirst({
      where(fields, { eq }) {
        return eq(fields.sessionId, sessionId)
      },
    })

    return cart
  }

  async getCartByCustomerId(userId: string) {
    const cart = await db.query.carts.findFirst({
      where(fields, { eq }) {
        return eq(fields.customerId, userId)
      },
    })
    return cart
  }

  async getCartWithItemsAndOrgSlugByCustomerId(userId: string) {
    const cartWithItemsAndOrgSlug = await db.query.carts.findFirst({
      with: {
        items: true,
        organization: {
          columns: {
            slug: true,
          },
        },
      },
      where(fields, { eq }) {
        return eq(fields.customerId, userId)
      },
    })

    return cartWithItemsAndOrgSlug
  }

  async getCartWithItemsAndOrgSlugBySessionId(sessionId: string) {
    const cartWithItemsAndOrgSlug = await db.query.carts.findFirst({
      with: {
        items: true,
        organization: {
          columns: {
            slug: true,
          },
        },
      },
      where(fields, { eq }) {
        return eq(fields.sessionId, sessionId)
      },
    })

    return cartWithItemsAndOrgSlug
  }

  async createEmptyCart({
    customerId,
    sessionId,
  }: {
    sessionId: string
    customerId: string | null
  }) {
    const cart = await db
      .insert(carts)
      .values({
        sessionId,
        customerId,
        quantityItems: 0,
        totalInCents: 0,
      })
      .returning()

    return cart
  }

  async addItemInCart({
    cartId,
    productId,
    quantity,
    subTotalInCents,
  }: {
    cartId: string
    productId: string
    quantity: number
    subTotalInCents: number
  }) {
    const cartItem = await db
      .insert(cartsItems)
      .values({
        cartId,
        productId,
        quantity,
        subTotalInCents,
      })
      .returning()

    return cartItem
  }

  async deleteItemById(itemId: string) {
    await db.delete(cartsItems).where(eq(cartsItems.id, itemId))
  }

  async updateCartItemCartId({
    newCartId,
    oldCartId,
  }: {
    oldCartId: string
    newCartId: string
  }) {
    await db
      .update(cartsItems)
      .set({
        cartId: newCartId,
      })
      .where(eq(cartsItems.cartId, oldCartId))
  }

  async deleteCartById(cartId: string) {
    await db.delete(carts).where(eq(carts.id, cartId))
  }

  async updateTotalInCentsAndQuantityItemsByCartId({
    quantityItems,
    totalInCents,
    cartId,
  }: {
    quantityItems: number
    totalInCents: number
    cartId: string
  }) {
    await db
      .update(carts)
      .set({
        quantityItems,
        totalInCents,
      })
      .where(eq(carts.id, cartId))
  }

  async getItemsByCartIdAndProductIdNotItemId({
    cartId,
    productId,
    itemId,
  }: {
    productId: string
    cartId: string
    itemId: string
  }) {
    const cartItem = await db.query.cartsItems.findFirst({
      where(fields, { and, eq, ne }) {
        return and(
          ne(fields.id, itemId),
          eq(fields.cartId, cartId),
          eq(fields.productId, productId),
        )
      },
    })
    return cartItem
  }

  async updateSubTotalAndQuantityByItemId({
    itemId,
    quantity,
    subTotal,
  }: {
    quantity: number
    subTotal: number
    itemId: string
  }) {
    await db
      .update(cartsItems)
      .set({
        quantity,
        subTotalInCents: subTotal,
      })
      .where(eq(cartsItems.id, itemId))
  }

  async updateUserIdByCartId({
    cartId,
    userId,
  }: {
    cartId: string
    userId: string
  }) {
    await db
      .update(carts)
      .set({ customerId: userId })
      .where(eq(carts.id, cartId))
  }

  async updateOrganizationIdByCart({
    cartId,
    organizationId,
  }: {
    cartId: string
    organizationId: string
  }) {
    await db.update(carts).set({ organizationId }).where(eq(carts.id, cartId))
  }

  async getItemsByCartIdAndProductId({
    cartId,
    productId,
  }: {
    productId: string
    cartId: string
  }) {
    const cartItem = await db.query.cartsItems.findFirst({
      where(fields, { and, eq }) {
        return and(eq(fields.cartId, cartId), eq(fields.productId, productId))
      },
    })
    return cartItem
  }

  async updateQuantityAndSubtotalByItemId({
    itemId,
    quantity,
    subTotal,
  }: {
    itemId: string
    quantity: number
    subTotal: number
  }) {
    await db
      .update(cartsItems)
      .set({ quantity, subTotalInCents: subTotal })
      .where(eq(cartsItems.id, itemId))
  }
}
