import { db } from '@/db/connection'

export class ProductRepository {
  async getProductById(productId: string) {
    const product = await db.query.products.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, productId)
      },
    })
    return product
  }

  async getProductsWithOrganizationSlug() {
    const products = await db.query.products.findMany({
      with: {
        organization: {
          columns: { slug: true },
        },
      },
    })
    return products
  }
}
