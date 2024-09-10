import { ability, getCurrentOrg } from '@/auth/auth'

import { Button } from './/ui/button'
import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrg = getCurrentOrg()
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
            className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={`/admin/${currentOrg}/orders`}>Pedidos</NavLink>
          </Button>
        )}
        {canGetMembers && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={`/admin/${currentOrg}/members`}>Membros</NavLink>
          </Button>
        )}
        {(canUpdateOrganization || canGetBilling) && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={`/admin/${currentOrg}/settings`}>
              Configurações
            </NavLink>
          </Button>
        )}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/admin/${currentOrg}/dashboard`}>Dashboard</NavLink>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/admin/${currentOrg}/reservations`}>Reservas</NavLink>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className=" border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/admin/${currentOrg}/reservations`}>Cardápio</NavLink>
        </Button>
      </nav>
    </div>
  )
}
