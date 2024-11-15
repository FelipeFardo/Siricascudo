import { Info, ShoppingCart, X } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

import { Currency } from '@/components/currency'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { AddToCartControl } from './add-to-cart-control'

interface ProductCardProps {
  product: {
    description: string
    id: string
    name: string
    imageUrl: string
    createdAt: Date
    updatedAt: Date
    priceInCents: number
  }
  organizationSlug: string
}

export function ProductCard({ product, organizationSlug }: ProductCardProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Card
          key={product.id}
          className="transform rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md"
        >
          <CardHeader className="p-0">
            <div className="relative h-[150px] w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle>{product.name}</CardTitle>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4">
            <Currency value={product.priceInCents} />
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
        <div className="flex w-full space-x-8">
          <DialogHeader className="flex items-center">
            <Suspense
              fallback={<Skeleton className="max-h-[600px] max-w-[600px]" />}
            >
              <Image
                width={700}
                height={700}
                src={product.imageUrl || '/placeholder-image-2.webp'}
                alt={product.name}
                className=" max-w-[250px] rounded-lg"
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
            <AddToCartControl
              priceInCents={product.priceInCents}
              organizationSlug={organizationSlug}
              productId={product.id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
