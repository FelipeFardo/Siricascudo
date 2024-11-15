import { Currency } from '@/components/currency'
import { getProductById } from '@/http/products/get-product-by-id'

interface CartItemProps {
  itemId: string
  productId: string
  quantity: number
  subTotalInCents: number
}

export async function CartItem({
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
          <Currency value={subTotalInCents} />
        </span>
      </div>
    </div>
  )
}
