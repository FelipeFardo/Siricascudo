'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getOrganization,
  type GetOrganizationResponse,
} from '@/http/orgs/get-organization'

import { updateImageOrganizationAction } from '../../actions'
import { OrganizationInputImage } from './organization-input-image'

export function OrganizationImageForm() {
  const { slug: orgSlug } = useParams<{
    slug: string
    project: string
  }>()
  const [response, setResponse] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const success = response?.success
  const message = response?.message

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { data: result, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ['organization', orgSlug],
    queryFn: () => getOrganization(orgSlug),
  })

  const canSave = !!previewImage
  const organization = result?.organization

  function onUpdateOrganizationCache(newAvatarUrl: string) {
    queryClient.setQueryData<GetOrganizationResponse>(
      ['organization', orgSlug],
      (oldOrganization) => {
        if (!oldOrganization) return
        return {
          ...oldOrganization,
          organization: {
            ...oldOrganization.organization,
            avatarUrl: newAvatarUrl,
          },
        }
      },
    )
  }

  function handlePreviewImage(previewUrl: string) {
    setResponse(null)
    setPreviewImage(previewUrl)
  }
  function cleanPreview() {
    setPreviewImage(null)
  }
  async function saveImage(newUrl: string) {
    const result = await updateImageOrganizationAction(newUrl)

    onUpdateOrganizationCache(newUrl)
    setResponse({ message: result.message, success: result.success })
    cleanPreview()
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {previewImage && (
        <Image src={previewImage} alt={previewImage} width={300} height={300} />
      )}
      {isLoadingOrganization && <Skeleton className="h-[300px] w-[300px]" />}
      {!previewImage && organization?.avatarUrl && (
        <Image
          src={organization.avatarUrl}
          alt={organization.name}
          width={300}
          height={300}
        />
      )}

      <div className="space-y-3">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Falha ao salvar a organização!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        {success === true && message && (
          <Alert variant="success">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <OrganizationInputImage
          canSave={canSave}
          onUploadImage={handlePreviewImage}
          saveImage={saveImage}
        />
      </div>
    </div>
  )
}
