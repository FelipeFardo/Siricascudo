import { faker } from '@faker-js/faker'

import { db } from './connection'
import {
  accounts,
  invites,
  members,
  orders,
  ordersItems,
  organizations,
  products,
  tokens,
  users,
} from './schema'

/**
 * Reset database
 */

export function createSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

async function seed() {
  await db.delete(invites)
  await db.delete(tokens)
  await db.delete(ordersItems)
  await db.delete(orders)
  await db.delete(products)
  await db.delete(members)
  await db.delete(organizations)
  await db.delete(accounts)
  await db.delete(users)

  console.log('✔️ Database reset!')

  /**
   * Create customers
   */

  const [user, anotherUser, anotherUser2] = await db
    .insert(users)
    .values([
      {
        name: 'John Doe',
        email: 'john@acme.com',
        avatarUrl: 'https://github.com/felipefardo.png',
        passwordHash:
          '$2a$12$uMTAFMnwNkZFrMPTgp2TjuE2ErfdLkkYyiRhol8OVR41p1YONsDn2',
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash:
          '$2a$12$uMTAFMnwNkZFrMPTgp2TjuE2ErfdLkkYyiRhol8OVR41p1YONsDn2',
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash:
          '$2a$12$uMTAFMnwNkZFrMPTgp2TjuE2ErfdLkkYyiRhol8OVR41p1YONsDn2',
      },
    ])
    .returning()

  console.log('✔️ Created users!')

  /**
   * Create organization
   */

  const [organizationAdmin, organizationMember, organizationBilling] = await db
    .insert(organizations)
    .values([
      {
        name: 'Acme Inc (Admin)',
        description: faker.lorem.paragraph(),
        ownerId: user.id,
        slug: 'acme-admin',
        avatarUrl: faker.image.url(),
        category: 'Hambúrgueres',
      },
      {
        name: 'Acme Inc (Member)',
        description: faker.lorem.paragraph(),
        ownerId: user.id,
        slug: 'acme-member',
        avatarUrl: faker.image.url(),
        category: 'Sushi e Sashimi',
      },
      {
        name: 'Acme Inc (Billing)',
        description: faker.lorem.paragraph(),
        ownerId: user.id,
        slug: 'acme-billing',
        avatarUrl: faker.image.url(),
        category: 'Carnes',
      },
    ])
    .returning()

  console.log('✔️ Created organization!')

  /**
   * Create membership
   */

  await db
    .insert(members)
    .values([
      {
        userId: user.id,
        role: 'ADMIN',
        organizationId: organizationAdmin.id,
      },
      {
        userId: user.id,
        role: 'MEMBER',
        organizationId: organizationMember.id,
      },
      {
        userId: user.id,
        role: 'BILLING',
        organizationId: organizationBilling.id,
      },
    ])
    .returning()

  console.log('✔️ Created members!')

  function generateProduct() {
    return {
      name: faker.commerce.productName(),
      organizationId: organizationAdmin.id,
      imageUrl: faker.image.url(),
      description: faker.commerce.productDescription(),
      priceInCents: Number(
        faker.commerce.price({ min: 190, max: 490, dec: 0 }),
      ),
    }
  }

  /**
   * Create Products
   */
  const availableProducts = await db
    .insert(products)
    .values([
      generateProduct(),
      generateProduct(),
      generateProduct(),
      generateProduct(),
      generateProduct(),
      generateProduct(),
    ])
    .returning()

  console.log('✔️ Created products!')

  /**
   * Create Orders
   */

  type OrdersItemsInsert = {
    priceInCents: number
    quantity: number
    id?: string | undefined
    createdAt?: Date | undefined
    updatedAt?: Date | undefined
    productId?: string | null | undefined
  }

  for (let i = 0; i < 200; i++) {
    const orderItemsToInsert: OrdersItemsInsert[] = []
    const orderProducts = faker.helpers.arrayElements(availableProducts, {
      min: 1,
      max: 3,
    })

    let totalInCents = 0

    orderProducts.forEach((orderProduct) => {
      const quantity = faker.number.int({ min: 1, max: 3 })

      totalInCents += orderProduct.priceInCents * quantity

      orderItemsToInsert.push({
        productId: orderProduct.id,
        priceInCents: orderProduct.priceInCents,
        quantity,
      })
    })

    const [order] = await db
      .insert(orders)
      .values({
        customerId: faker.helpers.arrayElement([
          user.id,
          anotherUser.id,
          anotherUser2.id,
        ]),
        organizationId: organizationAdmin.id,
        totalInCents,
        status: faker.helpers.arrayElement([
          'pending',
          'delivering',
          'processing',
          'delivered',
          'canceled',
        ]),
        createdAt: faker.date.recent({ days: 40 }),
      })
      .returning()

    orderItemsToInsert.forEach(async (orderProduct) => {
      await db.insert(ordersItems).values({
        orderId: order.id,
        priceInCents: orderProduct.priceInCents,
        quantity: orderProduct.quantity,
        productId: orderProduct.productId,
      })
    })
  }

  console.log('✔️ Created Orders!')

  console.log('✔️ Database seeded successfully')

  process.exit()
}
try {
  seed()
} catch (error) {
  console.log(error)
}
