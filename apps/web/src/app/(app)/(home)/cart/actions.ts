'use server'

import { removeItemToCart } from '@/http/cart/remove-item-to-cart'

export async function removeItem(itemId: string) {
  await removeItemToCart({
    itemId,
  })
}
