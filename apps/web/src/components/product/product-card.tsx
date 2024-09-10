import { Info, X } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

import { getOrganization } from '@/http/orgs/get-organization'

import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Skeleton } from '../ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { AddToCartControl } from './add-to-cart-control'

interface ProductCardProps {
  product: {
    description: string
    id: string
    name: string
    imageUrl: string
    createdAt: Date
    updatedAt: Date
    organizationId: string
    priceInCents: number
    organization: {
      slug: string
    }
  }
}

export async function ProductCard({ product }: ProductCardProps) {
  const { organization } = await getOrganization(product.organization.slug)

  return (
    <Dialog>
      <DialogTrigger>
        <Card
          key={organization.id}
          className="transform rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md"
        >
          <CardContent className="flex gap-5 p-4">
            <Suspense
              fallback={<Skeleton className="max-h-[100px] max-w-[100px]" />}
            >
              <Image
                height={100}
                width={100}
                src={product.imageUrl || '/placeholder-image-2.webp'}
                alt={product.name}
                className="rounded-lg"
              />
            </Suspense>

            <div className="flex flex-col items-start justify-center truncate">
              <h1 className="text-md truncate font-semibold">{product.name}</h1>
              <span className="text-gray-600">{organization.name}</span>
              <span>R$ {product.priceInCents / 100}</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
        <div className="flex w-full space-x-8">
          <DialogHeader className="flex items-center">
            <Suspense
              fallback={<Skeleton className="max-h-[700px] max-w-[700px]" />}
            >
              <Image
                width={700}
                height={700}
                src={product.imageUrl || '/placeholder-image-2.webp'}
                alt={product.name}
                className="rounded-lg"
              />
            </Suspense>
            <DialogClose>
              <button className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md dark:bg-black dark:text-white">
                <X size={24} />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Observações:</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Info size={18} className="text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Observações</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <DialogDescription>{product.description}</DialogDescription>
            </div>
            <div className="rounded-md bg-gray-100 p-3">
              <p className=" text-sm text-gray-600">
                Restaurante: {organization.name}
              </p>
              <p className="text-sm text-gray-600">Tempo de entrega: 1h30min</p>
            </div>
            <AddToCartControl
              priceInCents={product.priceInCents}
              organizationSlug={organization.slug}
              productId={product.id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
