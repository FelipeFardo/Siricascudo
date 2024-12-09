'use client'

import Image from 'next/image'

import { getOrganization } from '@/http/orgs/get-organization'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'

interface CartOrganizationProps {
  slug: string
}

export function CartOrganization({ slug }: CartOrganizationProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => getOrganization(slug),
  })
  const organization = data?.organization

  if (isLoading || !organization) return <CartOrganizationSkeleton />

  return (
    <div className="mb-4  flex justify-between border-b pb-4">
      <div className="flex flex-row gap-3">
        <Image
          height={100}
          width={100}
          src={organization.avatarUrl || '/placeholder-image-2.webp'}
          alt={organization.name}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-3">
          <h1 className="text-lg">{organization.name}</h1>
          <span className="font-medium">{organization.category}</span>
        </div>
      </div>
      <button className="text-primary focus:outline-none">Cardápio</button>
    </div>
  )
}

export function CartOrganizationSkeleton() {
  return (
    <div className="mb-4 flex justify-between border-b pb-4">
      <div className="flex flex-row gap-3">
        <Skeleton className="h-[100px] w-[100px] rounded-lg" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  )
}
