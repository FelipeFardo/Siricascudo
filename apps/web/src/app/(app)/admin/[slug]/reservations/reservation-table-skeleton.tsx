import { Search } from 'lucide-react'

import { Button } from '@/components//ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function ReservationTableSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-[300px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[50px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[180px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[140px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[130px]" />
        </TableCell>
      </TableRow>
    )
  })
}
