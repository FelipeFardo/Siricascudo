'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { GetReservationsResponse } from '@/http/reservation/get-reservations'
import { updateReservation } from '@/http/reservation/update-reservation'
import { dayjs } from '@/lib/day-js'

export interface ReservationTableRowProps {
  reservation: {
    id: string
    description: string | null
    createdAt: Date
    customerName: string
    organizationId: string
    customerEmail: string
    numberOfPeople: number
    reservationDate: string
    reservationTime: string
    hasArrived: boolean
  }
}

export function ReservationTableRow({ reservation }: ReservationTableRowProps) {
  const { slug } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateReservation,
    onSuccess: (_, { reservationId }) => {
      updateReservationStatusOnCache(reservationId)
    },
  })

  function updateReservationStatusOnCache(reservationId: string) {
    const ordersListCache = queryClient.getQueriesData<GetReservationsResponse>(
      {
        queryKey: ['reservations'],
      },
    )

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return
      }
      queryClient.setQueryData<GetReservationsResponse>(cacheKey, {
        ...cacheData,
        reservations: cacheData.reservations.map((reservation) => {
          if (reservation.id === reservationId) {
            return {
              ...reservation,
              hasArrived: true,
            }
          }
          return reservation
        }),
      })
    })
  }

  function formatDate(date: Date) {
    const reservationDate = dayjs(date).add(1, 'day') // Adiciona 1 dia

    const reservationDateFormat = reservationDate.format(
      'DD [de] MMMM [de] YYYY',
    )

    return reservationDateFormat
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex justify-center">
          <Button
            onClick={() => mutateAsync({ slug, reservationId: reservation.id })}
            disabled={reservation.hasArrived || isPending}
            variant={reservation.hasArrived ? 'outline' : 'default'}
            size="icon"
            className="h-8 w-8"
            aria-label={
              reservation.hasArrived
                ? 'Customer has arrived'
                : 'Confirm customer arrival'
            }
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check
                className={
                  reservation.hasArrived ? 'h-4 w-4 text-green-500' : 'h-4 w-4'
                }
              />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[200px]">
          <span className="truncate text-left">{reservation.customerName}</span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[200px]">
          <span className="truncate text-left">
            {reservation.customerEmail}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[50px]">
          <span className="truncate text-left">
            {reservation.numberOfPeople}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[180px]">
          <span className="truncate text-left">
            {formatDate(new Date(reservation.reservationDate))}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[250px]">
          <span className="truncate text-left">{reservation.description}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}
