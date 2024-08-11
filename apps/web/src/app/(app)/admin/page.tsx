import { Header } from '@/components/header'

export default async function AdminPage() {
  return (
    <div>
      <div className="pt-6">
        <Header />
      </div>
      <main className="mx-auto w-full max-w-[1200px] py-4">
        <h1>Selecione uma organização</h1>
      </main>
    </div>
  )
}
