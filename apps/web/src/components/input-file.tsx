import { createUpload } from '@/http/uploads/create-upload'
import { upload } from '@/http/uploads/upload'

import { Input } from './ui/input'

export interface InputFileProps {
  onUpload: (fileUrl: string) => void
  onRemove?: () => void
  id: string
}

export function InputFile({ onUpload, onRemove, ...props }: InputFileProps) {
  async function handleInputChange(files: FileList | null) {
    if (!files || files.length === 0) {
      if (onRemove) onRemove()
      return
    }
    const file = files[0]

    const { signedUrl, imageUrl } = await createUpload({
      name: file.name,
      contentType: file.type,
    })

    await upload({ url: signedUrl, file })

    onUpload(imageUrl)
  }

  return (
    <Input
      type="file"
      onChange={(e) => handleInputChange(e.target.files)}
      {...props}
    />
  )
}
