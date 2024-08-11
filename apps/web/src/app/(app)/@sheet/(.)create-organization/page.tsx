import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { OrganizationFormSheet } from './organization-form-sheet'

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>aaaaaaaCreate organization</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <OrganizationFormSheet />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
