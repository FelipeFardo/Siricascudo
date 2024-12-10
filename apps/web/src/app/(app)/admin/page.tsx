import { Suspense } from 'react'

import { Header } from '@/components/header'

import PageLoading from './admin-loading'

export default async function AdminPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <div>
        <div className="pt-6">
          <Header />
        </div>
        <main className="mx-auto w-full max-w-[1200px] py-4">
          <h1>Selecione uma organização</h1>
        </main>
      </div>
    </Suspense>
  )
}
