'use client'
import Image from 'next/image'
import { useState } from 'react'

import { ProductInputImage } from './product-image'

interface ProductImageFormProps {
  imageUrl: string | null
}

export function ProductImageForm({ imageUrl }: ProductImageFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(imageUrl)

  function handlePreviewImage(previewUrl: string) {
    setPreviewImage(previewUrl)
  }

  return (
    <div className="space-y-4">
      {previewImage && (
        <Image src={previewImage} alt={previewImage} width={300} height={300} />
      )}

      <ProductInputImage
        imageUrl={imageUrl}
        onUploadImage={handlePreviewImage}
      />
    </div>
  )
}
