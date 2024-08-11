import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrg } from '@/auth/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/orgs/shutdown-organization'

export function ShutdownOrganizatonButton() {
  async function ShutdownOrganizatonAction() {
    'use server'

    const currentOrg = getCurrentOrg()

    await shutdownOrganization({ org: currentOrg! })

    redirect('/')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" variant="destructive" className="w-56">
          <XCircle className="mr-2 size-4" />
          Shutdown Organization
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
            organização e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={ShutdownOrganizatonAction}>
            <AlertDialogAction asChild>
              <Button type="submit">Confirmar</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
