import { Suspense } from 'react'

import { CheckoutButtonSheet } from '@/components/home/cart/button-checkout-sheet'
import { Cart } from '@/components/home/cart/cart'
import { CartItemSkeleton } from '@/components/home/cart/cart-item'
import { CartOrganizationSkeleton } from '@/components/home/cart/cart-organization'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

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
          </Suspense>

          <CheckoutButtonSheet />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
