import { getOrganization } from '@/http/orgs/get-organization'

interface CartOrganizationProps {
  slug: string
}

export async function CartOrganization({ slug }: CartOrganizationProps) {
  const { organization } = await getOrganization(slug)
  return (
    <div className="mb-4 flex justify-between border-b pb-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-lg">{organization.name}</h1>
        <span className="font-medium">{organization.category}</span>
      </div>
      <button className="text-primary focus:outline-none">Cardápio</button>
    </div>
  )
}
