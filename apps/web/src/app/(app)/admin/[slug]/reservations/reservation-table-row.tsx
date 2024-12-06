'use client'

import { TableCell, TableRow } from '@/components/ui/table'
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
  }
}

export function ReservationTableRow({ reservation }: ReservationTableRowProps) {
  function formatDistanceToNow(date: Date) {
    const createdAt = dayjs(date)
    const now = dayjs()
    const formattedDate = createdAt.from(now)
    return formattedDate
  }

  function formatDate(date: Date) {
    const reservationDate = dayjs(date).add(1, 'day') // Adiciona 1 dia

    const reservationDateFormat = reservationDate.format(
      'DD [de] MMMM [de] YYYY'
    )

    return reservationDateFormat
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[300px]">
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
        <div className="flex h-full w-[300px]">
          <span className="truncate text-left">{reservation.description}</span>
        </div>
      </TableCell>
      {/* <TableCell className="font-mono text-xs font-medium">
        <div className="flex h-full w-[130px]">
          <span className="truncate text-left">
            {formatDistanceToNow(reservation.createdAt)}
          </span>
        </div>
      </TableCell> */}
    </TableRow>
  )
}
