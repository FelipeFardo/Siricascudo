import { CardOrganization } from '@/components/home/organization-card'
import { getOrganizations } from '@/http/orgs/get-organizations'

export default async function Organization() {
  const { organizations } = await getOrganizations()
  return (
    <main className="mx-auto mt-4 min-h-[800px] w-full max-w-[1700px] space-y-4">
      <div className="grid grid-cols-1 gap-3  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {organizations.map((organization) => (
          <CardOrganization key={organization.id} organization={organization} />
        ))}
      </div>
    </main>
  )
}
