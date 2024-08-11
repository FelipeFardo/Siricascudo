import { CardOrganization } from '@/components/home/organization-card'
import { getOrganizations } from '@/http/orgs/get-organizations'

export default async function Home() {
  const { organizations } = await getOrganizations()
  return (
    <div className="space-y-4 p-4">
      <main className="mx-auto min-h-[800px] w-full max-w-[1700px] space-y-4">
        <h1 className="ml-4 text-xl">Restaurantes</h1>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {organizations.map((organization) => (
            <CardOrganization
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
        <h1 className="ml-4 text-xl">Foods</h1>
      </main>
    </div>
  )
}
