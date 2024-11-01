'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createServerAction } from 'zsa'

import { getCurrentOrg } from '@/auth/auth'
import { createOrganization } from '@/http/orgs/create-organization'
import { categoryOrganization } from '@/http/orgs/get-organizations'
import { updateImageOrganization } from '@/http/orgs/update-image-organization'
import { updateOrganization } from '@/http/orgs/update-organization'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Please include at least 4 characteres.' }),
    category: z.enum(categoryOrganization, {
      message: 'Selecione uma categoria',
    }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }

          return true
        },
        { message: 'Please, enter a valid domain.' },
      )
      .transform((value) => (value === '' ? null : value)),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'Domain is required when auto-join is enabled',
      path: ['domain'],
    },
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export const createOrganizationAction = createServerAction()
  .input(organizationSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors

    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    const { domain, name, shouldAttachUsersByDomain, category } = input

    try {
      await createOrganization({
        name,
        domain,
        shouldAttachUsersByDomain,
        category,
      })
      revalidateTag('member-organizations')
    } catch (err) {
      if (err instanceof HTTPError) {
        const { message } = await err.response.json()

        return { success: false, message, errors: null }
      }
    }
    return {
      success: true,
      message: 'Successfully saved the organization.',
      errors: null,
    }
  })

export const updateOrganizationAction = createServerAction()
  .input(organizationSchema, { type: 'formData' })
  .onInputParseError(async (error) => {
    const errors = error.flatten().fieldErrors

    return { success: false, message: null, errors }
  })
  .handler(async ({ input }) => {
    const currentOrg = getCurrentOrg()
    const { name, domain, shouldAttachUsersByDomain, category } = input

    try {
      await updateOrganization({
        org: currentOrg!,
        name,
        domain,
        category,
        shouldAttachUsersByDomain,
      })

      revalidateTag('member-organizations')
      revalidateTag(`organization:${currentOrg}`)
    } catch (err) {
      if (err instanceof HTTPError) {
        const { message } = await err.response.json()

        return { success: false, message, errors: null }
      }

      console.log(err)
      return {
        success: false,
        message: 'Unexpected error, try again in a few minutes.',
        errors: null,
      }
    }

    return {
      success: true,
      message: 'Successfully saved the organization.',
      errors: null,
    }
  })

export async function updateImageOrganizationAction(url: string) {
  const currentOrg = getCurrentOrg()
  try {
    await updateImageOrganization({
      org: currentOrg!,
      url,
    })

    revalidateTag('organization')
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'A imagem foi salva com sucesso!',
    errors: null,
  }
}
