import { organizationSchema } from '@siricascudo/auth'

import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/orgs/get-organization'

import { OrganizationForm } from '../../organization-form'
import { OrganizationImageForm } from './organization-image-form'
import { ShutdownOrganizatonButton } from './shutdown-organization-button'

export default async function Projects() {
  const currentOrg = await getCurrentOrg()

  const permissions = await ability()

  const { organization } = await getOrganization(currentOrg!)

  const authOrganization = organizationSchema.parse(organization)

  const canShutdownOrganization = permissions?.can('delete', authOrganization)

  return (
    <div className="m-2 space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="mx-auto grid flex-1 auto-rows-max gap-4">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da organização</CardTitle>
                <CardDescription>
                  Atualize os detalhes da sua organização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationForm
                  isUpdating
                  initialData={{
                    name: organization.name,
                    domain: organization.domain,
                    category: organization.category,
                    shouldAttachUsersByDomain:
                      organization.shouldAttachUsersByDomain,
                  }}
                />
              </CardContent>
            </Card>
            {canShutdownOrganization && (
              <Card>
                <CardHeader>
                  <CardTitle>Excluir Organização</CardTitle>
                  <CardDescription>
                    Isso excluirá todos os dados da organização. Você não pode
                    desfazer esta ação.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ShutdownOrganizatonButton />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Imagem da organização</CardTitle>
                <CardDescription>
                  Essa é a imagem que irá na home e na pagina da organização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationImageForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
