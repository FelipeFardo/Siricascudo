'use client'

import { AlertCircle, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            Erro ao Coletar Métricas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Não foi possível coletar as métricas necessárias. Isso pode ser
            devido a uma conexão instável ou um problema temporário com nossos
            servidores.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            Voltar para a Página Inicial
          </Button>
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Tentar Novamente
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
