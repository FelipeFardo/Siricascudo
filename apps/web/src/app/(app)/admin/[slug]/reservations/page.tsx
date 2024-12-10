'use client'

import { getReservations } from '@/http/reservation/get-reservations'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { z } from 'zod'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ReservationTableRow } from './reservation-table-row'
import { ReservationTableFilters } from './reservation-table-filters'
import { Skeleton } from '@/components/ui/skeleton'
import { ReservationTableSkeleton } from './reservation-table-skeleton'
import { Pagination } from '@/components/pagination'

export default function ReservationPage() {
  const { slug: orgSlug } = useParams<{
    slug: string
  }>()

  const [filters, setFilters] = useQueryStates({
    date: parseAsString.withDefault(new Date().toISOString().split('T')[0]),
    page: parseAsInteger.withDefault(1),
  })

  const { date, page } = filters

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(page ?? '1')

  const { data: result, isLoading: isLoadingReservations } = useQuery({
    queryKey: ['reservations', date, pageIndex],
    queryFn: () =>
      getReservations({
        org: orgSlug,
        date: new Date(date),
        pageIndex,
      }),
  })

  function handlePaginate(pageIndex: number) {
    setFilters({ page: pageIndex + 1 })
  }

  const reservations = result?.reservations

  return (
    <div className="m-2 flex w-full flex-col gap-4">
      <h1 className="text-2xl font-bold">Reservas</h1>

      <div className="space-y-2.5">
        <ReservationTableFilters />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Chegou</TableHead>
                <TableHead className="w-[200px]">Nome</TableHead>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead className="w-[50px]">Pessoas</TableHead>
                <TableHead className="w-[180px]">Data da reserva</TableHead>
                <TableHead className="w-[250px]">Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingReservations && <ReservationTableSkeleton />}
              {reservations &&
                reservations.map((reservation) => {
                  return (
                    <ReservationTableRow
                      key={reservation.id}
                      reservation={reservation}
                    />
                  )
                })}
            </TableBody>
          </Table>
        </div>
        {result && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={result.meta.pageIndex}
            totalCount={result.meta.totalCount}
            perPage={result.meta.perPage}
          />
        )}
      </div>
    </div>
  )
}
