import { z } from 'zod'

export const productSubject = z.tuple([
  z.union([z.literal('get'), z.literal('update')]),
  z.literal('Order'),
])

export type ProductSubject = z.infer<typeof productSubject>
