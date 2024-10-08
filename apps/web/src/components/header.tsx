import { Slash } from 'lucide-react'
import Image from 'next/image'

import logoIcon from '@/assets/logo.svg'

import { OrganizationSwitcher } from './organization-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

export async function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b pb-2">
      <div className="flex items-center gap-3">
        <Image src={logoIcon} className="size-6" alt="Logo" />

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />
      </div>
      <div className="flex items-center gap-4">
        <PendingInvites />

        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
