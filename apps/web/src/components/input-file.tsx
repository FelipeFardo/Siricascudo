import { createUpload } from '@/http/uploads/create-upload'
import { upload } from '@/http/uploads/upload'

import { Input, type InputProps } from './ui/input'

export interface InputFileProps extends InputProps {
  onUpload: (fileUrl: string) => void
  onRemove?: () => void
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
