import { relations } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { invites, members, users } from '.'

export const categoryOrganization = [
  'Marmitas',
  'Hambúrgueres',
  'Refrigerantes',
  'Massas',
  'Carnes',
  'Frango e Aves',
  'Sanduíches e Wraps',
  'Esfihas',
  'Pães',
  'Sushi e Sashimi',
  'Açaí',
  'Sobremesas',
  'Pizzas Salgadas',
  'Bolos e Tortas',
  'Pastéis',
  'Peixes e Frutos-do-mar',
  'Cachorro-quente',
  'Parmegiana',
  'Porções',
  'Batata frita',
]

export const OrganizationCategory = pgEnum('organization_category', [
  'Marmitas',
  'Hambúrgueres',
  'Refrigerantes',
  'Massas',
  'Carnes',
  'Frango e Aves',
  'Sanduíches e Wraps',
  'Esfihas',
  'Pães',
  'Sushi e Sashimi',
  'Açaí',
  'Sobremesas',
  'Pizzas Salgadas',
  'Bolos e Tortas',
  'Pastéis',
  'Peixes e Frutos-do-mar',
  'Cachorro-quente',
  'Parmegiana',
  'Porções',
  'Batata frita',
])

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    slug: text('slug').notNull(),
    domain: text('domain'),
    avatarUrl: text('avatar_url'),
    category: OrganizationCategory('category').default('Porções').notNull(),
    shouldAttachUsersByDomain: boolean('should_attach_users_by_domain')
      .default(false)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),
  },
  (table) => {
    return {
      domainKey: uniqueIndex('organizations_domain_key').using(
        'btree',
        table.domain,
      ),
      slugKey: uniqueIndex('organizations_slug_key').using('btree', table.slug),
    }
  },
)

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    members: many(members),
    invites: many(invites),
    owner: one(users, {
      fields: [organizations.ownerId],
      references: [users.id],
    }),
  }),
)
