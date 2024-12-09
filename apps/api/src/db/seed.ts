import { faker } from '@faker-js/faker'

import { db } from './connection'
import {
  accounts,
  address,
  invites,
  members,
  orders,
  ordersItems,
  organizations,
  products,
  reservations,
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
  await db.delete(reservations)
  await db.delete(address)
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
        avatarUrl: 'https://github.com/shadcn.png',
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
   * Create address
   */

  await db.insert(address).values({
    city: 'Erechim',
    country: ' Centro',
    number: '49',
    state: 'RS',
    street: 'Av. Maurício Cardoso',
    complement: 'Ap. 02',
    customerId: user.id,
    zipCode: '99700426',
  })

  console.log('✔️ Created address!')

  /**
   * Create organization
   */

  const [organizationAdmin, organizationMember, organizationBilling] = await db
    .insert(organizations)
    .values([
      {
        name: 'Hamburgueria do Zé',
        description:
          'É um restaurante acolhedor que oferece pratos da gastronomia local e internacional, com ingredientes frescos e apresentação impecável. Com um ambiente elegante e atendimento atencioso, é o lugar perfeito para momentos especiais e refeições memoráveis.',
        ownerId: user.id,
        slug: 'restaurante-do-ze',
        avatarUrl:
          'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/la-grotta-entrance.webp',
        category: 'Hambúrgueres',
      },
      {
        name: 'Comida em Loop',
        description:
          'É um restaurante acolhedor que oferece pratos da gastronomia local e internacional, com ingredientes frescos e apresentação impecável. Com um ambiente elegante e atendimento atencioso, é o lugar perfeito para momentos especiais e refeições memoráveis.',
        ownerId: user.id,
        slug: 'comida-em-loop',
        avatarUrl:
          'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/franc%C3%AAs-caf%C3%A8-e-restaurante-em-paris.webp',
        category: 'Sushi e Sashimi',
      },
      {
        name: 'Café com Debug',
        description:
          'É um restaurante acolhedor que oferece pratos da gastronomia local e internacional, com ingredientes frescos e apresentação impecável. Com um ambiente elegante e atendimento atencioso, é o lugar perfeito para momentos especiais e refeições memoráveis.',
        ownerId: user.id,
        slug: 'cafe-com-debug',
        avatarUrl:
          'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/restaurante-e-bar-de-segunda-tadu-arquitetura_9.jpg',
        category: 'Carnes',
      },
    ])
    .returning()

  console.log('✔️ Created organization!')

  /**
   * Create reservation
   */
  await db.insert(reservations).values([
    {
      customerEmail: 'john@acme.com',
      customerName: 'John Doe',
      numberOfPeople: 12,
      organizationId: organizationAdmin.id,
      reservationDate: new Date().toISOString().split('T')[0],
      reservationTime: '12:00',
    },
    {
      customerEmail: 'felipe.fardo@hotmail.com.br',
      customerName: 'Felipe Fardo',
      numberOfPeople: 2,
      organizationId: organizationAdmin.id,
      reservationDate: new Date().toISOString().split('T')[0],
      reservationTime: '20:00',
    },
  ])

  console.log('✔️ Created reservations!')
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

  const foodNames = [
    'Frango à Parmegiana',
    'Picanha na Chapa',
    'Moqueca de Camarão',
    'Pizza Quatro Queijos',
    'Espaguete Carbonara',
    'Tacos Mexicanos',
    'Hambúrguer Artesanal',
    'Ceviche de Tilápia',
    'Risoto de Cogumelos',
    'Sushi de Salmão',
    'Feijoada Completa',
    'Costela ao Barbecue',
    'Escondidinho de Carne Seca',
    'Lasanha Bolonhesa',
    'Arroz de Polvo',
    'Quiche de Alho-Poró',
    'Crepe de Chocolate com Morango',
    'Pão de Alho Recheado',
    'Batata Rústica com Ervas',
    'Bolo de Cenoura com Calda de Chocolate',
  ]

  const foodImages = [
    'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/360_F_457738290_y8fywtzTyfT2pQzU5mL1OpKHHAERc6kS.jpg',
    'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/pratos-tipicos-dos-estados-unidos.jpg',
    'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/images%20(1).jpeg',
    'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/images.jpeg',
    'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/9-pratos-tipicos-europa.webp',
    'https://pub-9448e6c9570e405b8072625bd2387965.r2.dev/comidas-da-regiao-do-nordeste-moqueca-maranhense.webp',
  ]

  let foodImage = 0

  function generateProduct() {
    const foodNameRandom = Math.floor(Math.random() * foodNames.length)
    const foodName = foodNames[foodNameRandom]
    foodNames.splice(foodNameRandom, 1)
    return {
      name: foodName,
      organizationId: organizationAdmin.id,
      imageUrl: foodImages[foodImage++],
      description: ` Combina sabores intensos e cremosidade, oferecendo uma experiência gastronômica sofisticada e aconchegante`,
      priceInCents: Number(
        faker.commerce.price({ min: 190, max: 490, dec: 0 })
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

  /** faker.commerce.productName()
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
