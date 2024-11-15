import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components//ui/button'
import { NavLink } from '@/components/nav-link'
import { getCart } from '@/http/cart/get-cart'

import { CartSummary } from './cart/cart-summary'
import { ProfileButton } from './profile-button'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/organization', label: 'Restaurantes' },
  { href: '', label: 'Foods' },
]

export async function NavBar() {
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
          <Link href="/cart" className="flex">
            <ShoppingCart className="text-primary" />
            <CartSummary />
          </Link>
        </Button>
      </nav>
    </div>
  )
}
