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

export default function CartPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Sacola</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Cart />

          <SheetClose asChild>
            <Button className="w-full" asChild>
              <Link href="/checkout">Finalizar Pedido</Link>
            </Button>
          </SheetClose>
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
