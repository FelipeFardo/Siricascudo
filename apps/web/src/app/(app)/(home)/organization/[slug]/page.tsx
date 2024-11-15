import { Clock } from 'lucide-react'
import Image from 'next/image'

import { getCurrentOrg } from '@/auth/auth'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getOrganization } from '@/http/orgs/get-organization'
import { getProductByOrg } from '@/http/products/get-products-by-org'

import { ProductCard } from './product-card'
import { Reservation } from './reservation'

export default async function organizationPage() {
  const currentOrg = await getCurrentOrg()
  const { organization } = await getOrganization(currentOrg!)
  const { products } = await getProductByOrg(currentOrg!)

  return (
    <div className="mx-auto my-8 flex max-w-[1200px] flex-col">
      <header className="bg-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="relative mx-auto mb-4 h-64 w-64 md:mb-0 md:mr-6">
            <Image
              src={organization.avatarUrl || '/placeholder-image-2.webp'}
              alt={organization.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="flex items-center">
                <p className="text-gray-600">{organization.category}</p>
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-5 w-5 text-gray-400" />
                30 min
              </span>
            </div>
            <p className="mt-2 text-gray-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam
              obcaecati asperiores unde eum molestiae officia sunt, quibusdam
              voluptatum non cum neque saepe sequi nemo laborum modi explicabo
              dolore enim praesentium?
            </p>
          </div>
        </div>
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

        <h2 className="my-6 flex   w-full justify-center text-2xl font-semibold">
          Cardápio
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              organizationSlug={organization.slug}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
