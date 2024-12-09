import { Cart } from '@/components/home/cart/cart'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Suspense } from 'react'
import { CartItemSkeleton } from '@/components/home/cart/cart-item'
import { CartOrganizationSkeleton } from '@/components/home/cart/cart-organization'
import { CheckoutButtonSheet } from '@/components/home/cart/button-checkout-sheet'

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
