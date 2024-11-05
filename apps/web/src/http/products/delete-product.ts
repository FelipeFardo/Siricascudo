import { api } from '../api-client'

interface DeleteProductRequest {
  org: string
  productId: string
}
type DeleteProductResponse = void

export async function deleteProduct({ org, productId }: DeleteProductRequest) {
  const result = await api
    .delete(`organizations/${org}/products/${productId}`)
    .json<DeleteProductResponse>()

  return result
}
