import { Info, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

import { getOrganization } from '@/http/orgs/get-organization'

import { Currency } from '../currency'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Dialog,
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
      <Card
        key={product.id}
        className="max-w-[350px] transform  rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md"
      >
        <CardHeader className="mx-auto gap-5">
          <div className="relative mx-auto h-[150px] w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center ">
          <CardTitle>{product.name}</CardTitle>
          <CardDescription className="mt-2">
            {organization.name}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4">
          <Currency value={product.priceInCents} />

          <DialogTrigger asChild>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

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
