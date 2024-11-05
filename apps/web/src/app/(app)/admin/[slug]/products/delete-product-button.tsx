import { Trash2 } from 'lucide-react'

import { Button } from '@/components//ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { deleteProductAction } from './actions'

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" variant="destructive" className="w-full">
          <Trash2 className="mr-2 size-4" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteProductAction.bind(null, productId)}>
            <AlertDialogAction asChild>
              <Button type="submit">Confirmar</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
