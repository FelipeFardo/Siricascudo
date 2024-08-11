'use client'

import { useState } from 'react'

import { InputFile } from '@/components/input-file'
import { Button } from '@/components/ui/button'

interface OrganizationInputImageProps {
  canSave: boolean
  onUploadImage: (newUrl: string) => void
  onRemoveImage?: () => void
  saveImage: (newUrl: string) => void
}

export function OrganizationInputImage({
  onUploadImage,
  saveImage,
  canSave,
  onRemoveImage,
}: OrganizationInputImageProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  function handleFileChange(newUrl: string) {
    setFileUrl(newUrl)
    onUploadImage(newUrl)
  }

  function handleSaveImage() {
    if (fileUrl) saveImage(fileUrl)
  }

  return (
    <div className="space-y-3">
      <InputFile
        id="file"
        onUpload={handleFileChange}
        onRemove={onRemoveImage}
      />
      <Button
        disabled={!canSave}
        onClick={handleSaveImage}
        className="flex w-full"
      >
        Salvar imagem
      </Button>
    </div>
  )
}
