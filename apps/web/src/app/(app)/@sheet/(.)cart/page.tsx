import Link from 'next/link'

import { Cart } from '@/components/home/cart/cart'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Suspense } from 'react'
import { CartItemSkeleton } from '@/components/home/cart/cart-item'
import { CartOrganizationSkeleton } from '@/components/home/cart/cart-organization'
import { CheckoutButton } from '@/components/home/cart/button-checkout'

export default function CartPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Sacola</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Suspense
            fallback={
              <>
                <CartOrganizationSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            }
          >
            <Cart />
            <SheetClose asChild>
              <CheckoutButton />
            </SheetClose>
          </Suspense>
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
