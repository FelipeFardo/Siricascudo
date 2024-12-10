'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { CalendarIcon, Search, X } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components//ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const reservationFiltersSchema = z.object({
  date: z.date(),
})

type ReservationFiltersSchema = z.infer<typeof reservationFiltersSchema>

export function ReservationTableFilters() {
  const [_filters, setFilters] = useQueryStates({
    date: parseAsString.withDefault(new Date().toISOString().split('T')[0]),
    page: parseAsInteger.withDefault(1),
  })

  const form = useForm<ReservationFiltersSchema>({
    resolver: zodResolver(reservationFiltersSchema),
    defaultValues: {
      date: new Date(),
    },
  })

  const { handleSubmit, reset } = form

  function handleFilter({ date }: ReservationFiltersSchema) {
    setFilters({
      date: date.toISOString().split('T')[0],
    })
  }

  function handleClearFilters() {
    setFilters({
      date: new Date().toISOString().split('T')[0],
    })
    reset({
      date: new Date(),
    })
  }

  function formatDate(date: Date) {
    const dateDayJS = dayjs(date)

    const dateFormatada = dateDayJS.format('D [de] MMMM [de] YYYY')
    return dateFormatada
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-2"
        onSubmit={handleSubmit(handleFilter)}
      >
        <span className="text-sm font-semibold">Filtros:</span>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary" size="xs">
          <Search className="mr-2 h-4 w-4" />
          Filtrar resultado
        </Button>
        <Button
          onClick={() => handleClearFilters()}
          type="button"
          variant="outline"
          size="xs"
        >
          <X className="mr-2 h-4 w-4" />
          Remover filtros
        </Button>
      </form>
    </Form>
  )
}
