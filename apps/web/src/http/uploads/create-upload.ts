import { api } from '../api-client'

interface CreateUploadRequest {
  name: string
  contentType: string
}

type CreateUploadResponse = {
  imageUrl: string
  signedUrl: string
}

export async function createUpload({
  name,
  contentType,
}: CreateUploadRequest): Promise<CreateUploadResponse> {
  const result = await api
    .post('upload', {
      json: {
        name,
        contentType,
      },
    })
    .json<CreateUploadResponse>()

  return result
}
