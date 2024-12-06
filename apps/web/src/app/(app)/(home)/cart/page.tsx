import Link from 'next/link'

import { Cart } from '@/components/home/cart/cart'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/home/cart/button-checkout'

export default function CartPage() {
  return (
    <div className="space-y-4 py-4">
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Sacola</h1>
        <Cart />
        <CheckoutButton />
      </main>
    </div>
  )
}
