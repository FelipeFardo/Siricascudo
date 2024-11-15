import { db } from '@/db/connection'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'

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

  async getProductsByOrganizationId(organizationId: string) {
    const products = await db.query.products.findMany({
      where(fields, { eq }) {
        return eq(fields.organizationId, organizationId)
      },
    })
    return products
  }

  async getProductsByOrganizationSlug(organizationSlug: string) {
    // Primeiro, obtenha a organização usando o slug
    const organization = await db.query.organizations.findFirst({
      where(fields, { eq }) {
        return eq(fields.slug, organizationSlug)
      },
    })

    if (!organization) {
      throw new BadRequestError('Organização não encontrada')
    }

    const products = await db.query.products.findMany({
      where(fields, { eq }) {
        return eq(fields.organizationId, organization.id)
      },
    })

    return products
  }
}
