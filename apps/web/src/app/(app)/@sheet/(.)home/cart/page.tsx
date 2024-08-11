import { Cart } from '@/components/home/cart'
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
          <Cart />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
