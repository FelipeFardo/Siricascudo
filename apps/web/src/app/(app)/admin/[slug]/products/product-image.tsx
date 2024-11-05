'use client'

import { useState } from 'react'

import { InputFile } from '@/components/input-file'

interface ProductInputImageProps {
  imageUrl: string | null
  onUploadImage: (newUrl: string) => void
  onRemoveImage?: () => void
}

export function ProductInputImage({
  onUploadImage,
  onRemoveImage,
  imageUrl,
}: ProductInputImageProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(imageUrl)

  function handleFileChange(newUrl: string) {
    setFileUrl(newUrl)
    onUploadImage(newUrl)
  }

  function removeImage() {
    if (onRemoveImage) onRemoveImage()
    setFileUrl(null)
  }

  return (
    <>
      <InputFile
        id="imageUrl"
        onUpload={handleFileChange}
        onRemove={removeImage}
        accept="image/*"
      />
      <input type="hidden" name="imageUrl" value={fileUrl ?? ''} />
    </>
  )
}
