import { ShoppingBag, XCircle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CancelChekout() {
  return (
    <div className="flex  items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Pedido Cancelado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Lamentamos informar que seu pedido foi cancelado. Isso pode ter
            ocorrido devido a:
          </p>
          <ul className="list-inside list-disc text-sm text-gray-500">
            <li>Falta de estoque</li>
            <li>Problema com o pagamento</li>
            <li>Solicitação do cliente</li>
            <li>Erro no sistema</li>
          </ul>
          <p className="text-gray-600">
            Se você tiver dúvidas sobre o cancelamento, entre em contato com
            nosso suporte ao cliente.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/home">
              <ShoppingBag className="mr-2 h-4 w-4" /> Continuar Comprando
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
