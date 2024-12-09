'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useServerAction } from 'zsa-react'

import ValueInput from '@/components/price-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  createProductAction,
  type ProductSchema,
  updateProductAction,
} from './actions'
import { ProductImageForm } from './product-image-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: ProductSchema
}

export function ProductForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const formAction = isUpdating ? updateProductAction : createProductAction

  const { executeFormAction, isPending, error, data } =
    useServerAction(formAction)

  return (
    <form action={executeFormAction} className="space-y-4">
      <ScrollArea className="h-[calc(100vh-200px)]  pr-4">
        <div className="space-y-4 p-4">
          <input type="hidden" name="id" value={initialData?.id || ''} />
          {data?.success === false && data?.message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Falha ao salvar o produto!</AlertTitle>
              <AlertDescription>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <p>{data?.message}</p>
              </AlertDescription>
            </Alert>
          )}
          {data?.success === true && data?.message && (
            <Alert variant="success">
              <AlertTriangle className="size-4" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>
                <p>{data?.message}</p>
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label htmlFor="name">Nome do produto</Label>
            <Input name="name" id="name" defaultValue={initialData?.name} />
            {error?.fieldErrors?.name && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {error?.fieldErrors?.name[0]}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">descrição</Label>
            <Textarea
              name="description"
              id="description"
              defaultValue={initialData?.description}
            />
            {error?.fieldErrors?.description && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {error?.fieldErrors?.description[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="priceInCents">Preço</Label>
            <ValueInput
              name="priceInCents"
              id="priceInCents"
              initialValue={initialData?.priceInCents}
            />

            {error?.fieldErrors?.priceInCents && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {error?.fieldErrors?.priceInCents[0]}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="imageUrl">Imagem</Label>
            <ProductImageForm imageUrl={initialData?.imageUrl ?? null} />

            {error?.fieldErrors?.imageUrl && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {error?.fieldErrors?.imageUrl[0]}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Salvar produto'
        )}
      </Button>
    </form>
  )
}
