'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useServerAction } from 'zsa-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoryOrganization } from '@/http/orgs/get-organizations'

import {
  createOrganizationAction,
  type OrganizationSchema,
  updateOrganizationAction,
} from './actions'
import { Textarea } from '@/components/ui/textarea'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction

  const { executeFormAction, isPending, error, data } =
    useServerAction(formAction)

  return (
    <form action={executeFormAction} className="space-y-4">
      {data?.success === false && data?.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha ao salvar a organização!</AlertTitle>
          <AlertDescription>
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
        <Label htmlFor="name">Nome da organização</Label>
        <Input name="name" id="name" defaultValue={initialData?.name} />
        {error?.fieldErrors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="category">Categoria</Label>
        <Select name="category" defaultValue={initialData?.category}>
          <SelectTrigger id="category" aria-label="Select category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOrganization.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error?.fieldErrors?.category && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.category[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          name="description"
          id="description"
          placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          defaultValue={initialData?.description ?? undefined}
        />

        {error?.fieldErrors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.description[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="domain">domínio do E-mail</Label>
        <Input
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="example.com"
          defaultValue={initialData?.domain ?? undefined}
        />
        {error?.fieldErrors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-start space-x-2">
          <div className="translate-y-0.5">
            <Checkbox
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
              key={String(initialData?.shouldAttachUsersByDomain)}
              defaultChecked={initialData?.shouldAttachUsersByDomain}
            />
          </div>
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Entrada automática de novos membros.
            </span>
            <p>
              Isso convidará automaticamente todos os membros com o mesmo
              domínio de e-mail para esta organização.
            </p>
          </label>
        </div>
        {error?.fieldErrors?.shouldAttachUsersByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.shouldAttachUsersByDomain[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Salvar organização'
        )}
      </Button>
    </form>
  )
}
