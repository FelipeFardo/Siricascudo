import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import type { CategoryOrganization } from '@/http/orgs/get-organizations'

interface CardOrganizationProps {
  organization: {
    id: string
    name: string
    slug: string
    category: CategoryOrganization
    avatarUrl: string | null
  }
}

export async function CardOrganization({
  organization,
}: CardOrganizationProps) {
  return (
    <Card
      key={organization.id}
      className="transform rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md"
    >
      <CardContent className="flex gap-5 p-4">
        <Image
          height={100}
          width={100}
          src={organization.avatarUrl || 'https://github.com/felipefardo.png'}
          alt={organization.name}
          className="rounded-lg"
        />
        <div className="flex flex-col justify-center truncate">
          <h1 className="text-md truncate font-semibold">
            {organization.name}
          </h1>
          <p className="text-gray-600">{organization.category}</p>
        </div>
      </CardContent>
    </Card>
  )
}
