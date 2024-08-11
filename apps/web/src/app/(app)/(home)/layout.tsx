import Footer from '@/components/home/footer'
import { NavBar } from '@/components/home/navbar'
import { Separator } from '@/components/ui/separator'

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavBar />
      <Separator />
      {children}
      <Separator />
      <Footer />
    </>
  )
}
