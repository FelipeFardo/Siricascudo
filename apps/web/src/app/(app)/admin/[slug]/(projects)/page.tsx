import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components//ui/button'

export default async function Projects() {
  const currentOrg = getCurrentOrg()
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/admin/${currentOrg}/create-project`}>
              <Plus className="mr-2 size-4" />
              Create Product
            </Link>
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">Seus Pedidos</p>
    </div>
  )
}
