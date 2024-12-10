import { Clock } from 'lucide-react'
import Image from 'next/image'

import { getCurrentOrg } from '@/auth/auth'
import { getOrganization } from '@/http/orgs/get-organization'

export default async function OrgHeader() {
  const currentOrg = await getCurrentOrg()

  const { organization } = await getOrganization(currentOrg!)

  return (
    <header className="bg-white shadow-md">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="relative mx-auto mb-4 h-64 w-64 md:mb-0 md:mr-6">
          <Image
            src={organization.avatarUrl || '/placeholder-image-2.webp'}
            alt={organization.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className="flex items-center">
              <p className="text-gray-600">{organization.category}</p>
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-5 w-5 text-gray-400" />
              1h30min
            </span>
          </div>
          <p className="mt-2 text-gray-600">{organization.description}</p>
        </div>
      </div>
    </header>
  )
}

export function OrgHeaderSkeleton() {
  return (
    <header className="bg-white shadow-md">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Skeleton for Image */}
        <div className="relative mx-auto mb-4 h-64 w-64 animate-pulse rounded-lg bg-gray-200 md:mb-0 md:mr-6"></div>

        <div className="container mx-auto px-4 py-4">
          {/* Skeleton for Title */}
          <div className="mb-4 h-8 w-1/3 animate-pulse rounded-md bg-gray-200"></div>

          {/* Skeleton for Category and Time */}
          <div className="mt-2 flex items-center space-x-4">
            <span className="h-5 w-24 animate-pulse rounded-md bg-gray-200"></span>
            <span className="h-5 w-16 animate-pulse rounded-md bg-gray-200"></span>
          </div>

          {/* Skeleton for Description */}
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
