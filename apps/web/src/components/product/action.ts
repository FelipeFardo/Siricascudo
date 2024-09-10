'use server'

import { revalidateTag } from 'next/cache'

import { insertItemToCart } from '@/http/cart/insert-item-to-cart'

export async function insertItemToCartAction({
  productId,
  quantity,
}: {
  productId: string
  quantity: number
}) {
  console.log(productId)
  console.log(quantity)
  insertItemToCart({
    productId,
    quantity,
  })
  revalidateTag(`cart`)
  revalidateTag(`cart-details`)
}
