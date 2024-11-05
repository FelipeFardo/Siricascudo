import { ability, getCurrentOrg } from '@/auth/auth'
import { cn } from '@/lib/utils'

import { Button } from './/ui/button'
import { NavLinkAdmin } from './nav-link-admin'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canGetMembers = permissions?.can('get', 'User')
  const canGetProjects = permissions?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground',
            )}
          >
            <NavLinkAdmin href={`/admin/${currentOrg}/orders`}>
              Pedidos
            </NavLinkAdmin>
          </Button>
        )}
        {canGetMembers && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground',
            )}
          >
            <NavLinkAdmin href={`/admin/${currentOrg}/members`}>
              Membros
            </NavLinkAdmin>
          </Button>
        )}
        {(canUpdateOrganization || canGetBilling) && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground',
            )}
          >
            <NavLinkAdmin href={`/admin/${currentOrg}/settings`}>
              Configurações
            </NavLinkAdmin>
          </Button>
        )}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            ' border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground',
          )}
        >
          <NavLinkAdmin href={`/admin/${currentOrg}/dashboard`}>
            Dashboard
          </NavLinkAdmin>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLinkAdmin href={`/admin/${currentOrg}/products`}>
            Cardápio
          </NavLinkAdmin>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLinkAdmin href={`/admin/${currentOrg}/reservations`}>
            Reservas
          </NavLinkAdmin>
        </Button>
      </nav>
    </div>
  )
}
