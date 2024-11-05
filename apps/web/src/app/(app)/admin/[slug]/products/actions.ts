'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createServerAction } from 'zsa'

import { getCurrentOrg } from '@/auth/auth'
import { createProduct } from '@/http/products/create-product'
import { deleteProduct } from '@/http/products/delete-product'
import { updateProduct } from '@/http/products/update-product'

const productSchema = z.object({
  id: z.union([z.string(), z.null()]).transform((value) => {
    return value === '' || value === null ? null : value
  }),
  name: z
    .string()
    .min(4, { message: 'Please include at least 4 characteres.' }),
  description: z
    .string()
    .min(4, { message: 'Please include at least 4 characteres.' }),
  imageUrl: z
    .string()
    .url({ message: 'Please the product needs to have an image' }),
  priceInCents: z
    .string()
    .transform((value) => {
      const sanitizedValue = value.replace('R$', '').trim().replace(',', '.')
      const valueInCents = Math.round(parseFloat(sanitizedValue) * 100)
      return valueInCents
    })
    .refine((value) => !isNaN(value), {
      message: 'Invalid currency format.',
    })
    .refine((val) => val >= 100, {
      message: 'The minimum allowed value for price is R$ 1',
    }),
})

export type ProductSchema = z.infer<typeof productSchema>

export const createProductAction = createServerAction()
  .input(productSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    console.log(error.flatten().fieldErrors)
    const errors = error.flatten().fieldErrors

    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    const currentOrg = getCurrentOrg()!
    const { description, imageUrl, name, priceInCents } = input

    try {
      await createProduct({
        name,
        description,
        imageUrl,
        org: currentOrg,
        priceInCents,
      })
      revalidateTag(`${currentOrg}/products`)
      revalidateTag('products')
    } catch (err) {
      if (err instanceof HTTPError) {
        const { message } = await err.response.json()

        return { success: false, message, errors: null }
      }
    }
    return {
      success: true,
      message: 'Successfully saved the product.',
      errors: null,
    }
  })

export const updateProductAction = createServerAction()
  .input(productSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors

    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    const currentOrg = getCurrentOrg()

    const { name, description, imageUrl, priceInCents, id } = input

    try {
      await updateProduct({
        org: currentOrg!,
        name,
        description,
        imageUrl,
        priceInCents,
        productId: id!,
      })
      revalidateTag(`${currentOrg}/products`)
      revalidateTag('products')
    } catch (err) {
      if (err instanceof HTTPError) {
        const { message } = await err.response.json()

        return { success: false, message, errors: null }
      }

      return {
        success: false,
        message: 'Unexpected error, try again in a few minutes.',
        errors: null,
      }
    }

    return {
      success: true,
      message: 'Successfully saved the product.',
      errors: null,
    }
  })

export async function deleteProductAction(productId: string) {
  const currentOrg = getCurrentOrg()

  await deleteProduct({ org: currentOrg!, productId })
  revalidateTag(`${currentOrg}/products`)
  revalidateTag('products')
}
