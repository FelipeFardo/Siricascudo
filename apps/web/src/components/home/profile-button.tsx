import { CircleUser, LogIn, LogOut, Package, User } from 'lucide-react'
import Link from 'next/link'

import { isAuthenticated } from '@/auth/auth'
import { NavLink } from '@/components/nav-link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
export async function ProfileButton() {
  const isAuth = await isAuthenticated()

  return (
    <>
      {isAuth ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center">
            <User className="text-primary" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <NavLink className="flex items-center" href="/orders">
                <CircleUser className="mr-2" />
                Minha conta
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink className="flex items-center" href="/orders">
                <Package className="mr-2" />
                Meus Pedidos
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a
                href="/api/auth/sign-out"
                className="flex cursor-pointer items-center"
              >
                <LogOut className="mr-2" />
                Sair
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/auth/sign-in" className="flex items-center">
          <LogIn className="text-primary" />
        </Link>
      )}
    </>
  )
}
