import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Reservation } from './reservation'
import { Suspense } from 'react'
import OrgHeader, { OrgHeaderSkeleton } from './org-header'
import { ProductsOrg, ProductsSkeleton } from './products-org'
import { Calendar } from '@/components/ui/calendar'

export default async function organizationPage() {
  return (
    <div className="mx-auto my-8 flex max-w-[1200px] flex-col">
      <header className="bg-white shadow-md">
        <Suspense fallback={<OrgHeaderSkeleton />}>
          <OrgHeader />
        </Suspense>
      </header>

      <main className="mx-auto w-full py-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-12 w-full">Reservar mesa</Button>
          </DialogTrigger>
          <DialogContent>
            <AlertDialogHeader>
              <DialogTitle>Reserva mesa</DialogTitle>
            </AlertDialogHeader>
            <Reservation />
          </DialogContent>
        </Dialog>

        <h2 className="my-6 flex w-full justify-center text-2xl font-semibold">
          Cardápio
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsOrg />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
