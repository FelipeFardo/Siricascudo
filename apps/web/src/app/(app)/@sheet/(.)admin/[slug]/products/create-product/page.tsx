import { ProductForm } from '@/app/(app)/admin/[slug]/products/product-form'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function CreateProduct() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create product</SheetTitle>
        </SheetHeader>

        <ProductForm />
      </InterceptedSheetContent>
    </Sheet>
  )
}
