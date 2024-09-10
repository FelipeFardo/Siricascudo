import { removeItem } from '@/app/(app)/(home)/cart/actions'
import { getProductById } from '@/http/products/get-product-by-id'

interface CartItemProps {
  itemId: string
  productId: string
  quantity: number
  subTotalInCents: number
}

export async function CartItem({
  itemId,
  productId,
  quantity,
  subTotalInCents,
}: CartItemProps) {
  const { product } = await getProductById(productId)

  return (
    <div className="mb-4 space-y-4 border-b pb-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <span className="text-gray-600">{quantity}x</span>
          <h3 className="font-medium">{product.name}</h3>
        </div>
        <span className="text-gray-600">
          {subTotalInCents.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </div>
      <div className="flex gap-10 font-medium">
        <button className="text-primary  focus:outline-none">Editar</button>
        <form action={removeItem.bind(null, itemId)}>
          <button className="text-gray-500 focus:outline-none">Excluir</button>
        </form>
      </div>
    </div>
  )
}
