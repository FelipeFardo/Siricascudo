'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

interface NavLinkAdminProps extends ComponentProps<typeof Link> {}

export function NavLinkAdmin(props: NavLinkAdminProps) {
  const pathname = usePathname()

  const isCurrent =
    props.href.toString().split('/')[3] === pathname.split('/')[3]

  return <Link data-current={isCurrent} {...props} />
}
