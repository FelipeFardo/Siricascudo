import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update', 'delete'], 'Organization')
    can(['transfer_ownership', 'update', 'delete'], 'Organization', {
      ownerId: { $eq: user.id },
    })

    can('delete', 'User')
    cannot('delete', 'User', {
      owner: {
        $eq: true,
      },
    })
  },
  MEMBER(_user, { can }) {
    can('get', 'User')
    can(['get'], 'Product')
  },
  BILLING(_, { can }) {
    can('get', 'Metric')
    can('manage', 'Billing')
  },
}
