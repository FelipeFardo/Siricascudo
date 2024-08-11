import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { NavLink } from '@/components/nav-link'
import { Button } from '@/components/ui/button'
import { getCart } from '@/http/cart/get-cart'

import { ProfileButton } from './profile-button'

const links = [
  { href: '/home', label: 'Home' },
  { href: '', label: 'Restaurantes' },
  { href: '', label: 'Foods' },
]

export async function NavBar() {
  const { cart } = await getCart()
  return (
    <div className="m-5 flex h-10 items-center justify-between">
      <nav className="flex gap-3 ">
        {links.map((link) => (
          <Button
            key={link.label}
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent font-medium text-muted-foreground data-[current=true]:text-primary"
          >
            <NavLink href={link.href}>{link.label}</NavLink>
          </Button>
        ))}
      </nav>
      <nav className="flex gap-5">
        <ProfileButton />
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="flex gap-3 border border-transparent py-5 text-muted-foreground"
        >
          <Link href="/cart">
            <ShoppingCart className="text-primary" />
            <div className="flex flex-col text-left">
              <span>
                {(cart.totalInCents / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
              <span className="text-xs">({cart.quantityItems}) item(s)</span>
            </div>
          </Link>
        </Button>
      </nav>
    </div>
  )
}
