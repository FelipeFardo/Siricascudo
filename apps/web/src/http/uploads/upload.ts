import ky from 'ky'

interface UploadRequest {
  url: string
  file: File
}

type CreateUploadResponse = never

export async function upload({
  url,
  file,
}: UploadRequest): Promise<CreateUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const result = await ky
    .put(url, {
      headers: {
        'Content-Type': file.type,
      },
      body: file instanceof Blob ? file : new Blob([file]),
    })

    .json<CreateUploadResponse>()

  return result
}
