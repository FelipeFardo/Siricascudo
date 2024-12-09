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
  // return (
  // <Dialog>
  //     <Card
  //       key={product.id}
  //       className="transform rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md"
  //     >
  //       <CardHeader className="p-0">
  //         <div className="relative h-[150px] w-full">
  //           <Image
  //             src={product.imageUrl}
  //             alt={product.name}
  //             layout="fill"
  //             objectFit="cover"
  //             className="rounded-t-lg"
  //           />
  //         </div>
  //       </CardHeader>
  //       <CardContent className="p-4">
  //         <CardTitle>{product.name}</CardTitle>
  //       </CardContent>
  //       <CardFooter className="flex items-center justify-between p-4">
  //         <Currency value={product.priceInCents} />
  //         <DialogTrigger asChild>
  //         <Button>
  //           <ShoppingCart className="mr-2 h-4 w-4" />
  //             Adicionar
  //           </Button>
  //           </DialogTrigger>
  //       </CardFooter>
  //     </Card>
  //   <DialogContent className="sm:max-w-[600px]">
  //     <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
  //     <div className="flex w-full space-x-8">
  //       <DialogHeader className="flex items-center">
  //         <Suspense
  //           fallback={<Skeleton className="max-h-[600px] max-w-[600px]" />}
  //         >
  //           <Image
  //             width={700}
  //             height={700}
  //             src={product.imageUrl || '/placeholder-image-2.webp'}
  //             alt={product.name}
  //             className=" max-w-[250px] rounded-lg"
  //           />
  //         </Suspense>
  //       </DialogHeader>
  //       <div className="space-y-4">
  //         <div className="text-sm text-gray-600">
  //           <div className="flex items-center justify-between">
  //             <p className="font-semibold">Observações:</p>
  //             <TooltipProvider>
  //               <Tooltip>
  //                 <TooltipTrigger asChild>
  //                   <Button variant="ghost" size="sm" className="p-1">
  //                     <Info size={18} className="text-gray-500" />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent>
  //                   <p>Observações</p>
  //                 </TooltipContent>
  //               </Tooltip>
  //             </TooltipProvider>
  //           </div>
  //           <DialogDescription>{product.description}</DialogDescription>
  //         </div>
  //         <AddToCartControl
  //           priceInCents={product.priceInCents}
  //           organizationSlug={organizationSlug}
  //           productId={product.id}
  //         />
  //       </div>
  //     </div>
  //   </DialogContent>
  // </Dialog>
  // )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group relative overflow-hidden rounded-lg border-2 border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
          <CardHeader className="p-0">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            <CardTitle className="line-clamp-2">{product.name}</CardTitle>
            <Currency value={product.priceInCents} />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              Adicionar ao Carrinho
            </Button>
          </CardFooter>
          <span className="absolute right-4 top-4 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
            Clique para detalhes
          </span>
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
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Observações:</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Informações do produto</span>
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
