'use server'

import { revalidateTag } from 'next/cache'

import { removeItemToCart } from '@/http/cart/remove-item-to-cart'

export async function removeItem(itemId: string) {
  await removeItemToCart({
    itemId,
  })
}
