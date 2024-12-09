import { Clock, Info, ShoppingCart } from 'lucide-react'
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
import { Badge } from '../ui/badge'

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

  // return (
  //   <Dialog>
  //     <Card
  //       key={product.id}
  //       className="max-w-[350px] transform  rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md"
  //     >
  //       <CardHeader className="mx-auto gap-5">
  //         <div className="relative mx-auto h-[150px] w-full">
  //           <Image
  //             src={product.imageUrl}
  //             alt={product.name}
  //             layout="fill"
  //             objectFit="cover"
  //             className="rounded-t-lg"
  //           />
  //         </div>
  //       </CardHeader>
  //       <CardContent className="flex flex-col items-center ">
  //         <CardTitle>{product.name}</CardTitle>
  //         <CardDescription className="mt-2">
  //           {organization.name}
  //         </CardDescription>
  //       </CardContent>
  //       <CardFooter className="flex items-center justify-between p-4">
  //         <Currency value={product.priceInCents} />

  //         <DialogTrigger asChild>
  //           <Button>
  //             <ShoppingCart className="mr-2 h-4 w-4" />
  //             Adicionar
  //           </Button>
  //         </DialogTrigger>
  //       </CardFooter>
  //     </Card>

  //     <DialogContent className="sm:max-w-[600px]">
  //       <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
  //       <div className="flex w-full space-x-8">
  //         <DialogHeader className="flex items-center">
  //           <Suspense
  //             fallback={<Skeleton className="max-h-[600px] max-w-[600px]" />}
  //           >
  //             <Image
  //               width={700}
  //               height={700}
  //               src={product.imageUrl || '/placeholder-image-2.webp'}
  //               alt={product.name}
  //               className=" max-w-[250px] rounded-lg"
  //             />
  //           </Suspense>
  //         </DialogHeader>
  //         <div className="space-y-4">
  //           <div className="text-sm text-gray-600">
  //             <div className="flex items-center justify-between">
  //               <p className="font-semibold">Observações:</p>
  //               <TooltipProvider>
  //                 <Tooltip>
  //                   <TooltipTrigger asChild>
  //                     <Button variant="ghost" size="sm" className="p-1">
  //                       <Info size={18} className="text-gray-500" />
  //                     </Button>
  //                   </TooltipTrigger>
  //                   <TooltipContent>
  //                     <p>Observações</p>
  //                   </TooltipContent>
  //                 </Tooltip>
  //               </TooltipProvider>
  //             </div>
  //             <DialogDescription>{product.description}</DialogDescription>
  //           </div>
  //           <div className="rounded-md bg-gray-100 p-3">
  //             <p className=" text-sm text-gray-600">
  //               Restaurante: {organization.name}
  //             </p>
  //             <p className="text-sm text-gray-600">Tempo de entrega: 1h30min</p>
  //           </div>
  //           <AddToCartControl
  //             priceInCents={product.priceInCents}
  //             organizationSlug={organization.slug}
  //             productId={product.id}
  //           />
  //         </div>
  //       </div>
  //     </DialogContent>
  //   </Dialog>
  // )
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group relative max-w-[350px] overflow-hidden rounded-lg border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
          <CardHeader className="space-y-0 p-0">
            <div className="relative h-[200px] w-full overflow-hidden">
              <Image
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-2 p-4 text-center">
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {organization.name}
            </CardDescription>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
            <div className="flex items-center justify-center font-medium">
              <Currency value={product.priceInCents} />
            </div>
            <Button className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              Adicionar
            </Button>
          </CardFooter>
          <Badge variant="secondary" className="absolute right-2 top-2">
            Clique para detalhes
          </Badge>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <Suspense
            fallback={<Skeleton className="aspect-square w-full rounded-lg" />}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </Suspense>
          <div className="flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="h-4 w-4" />
                  <span>{organization.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tempo de entrega: 1h30min</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Observações:</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">
                            Informações do produto
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detalhes e observações sobre o produto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <DialogDescription className="text-sm leading-relaxed">
                  {product.description}
                </DialogDescription>
              </div>
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
