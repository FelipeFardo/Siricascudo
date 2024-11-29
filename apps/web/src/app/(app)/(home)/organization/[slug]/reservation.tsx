'use client'

import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

import { createReservation } from './actions'

export function Reservation() {
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [calendarIsOpen, setIsCalendarOpen] = useState(true)
  const { executeFormAction, isPending, error } = useServerAction(
    createReservation,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Agendamento confirmado!',
          description: 'Seu horário foi reservado com sucesso.',
          action: <ToastAction altText="Fechar">Fechar</ToastAction>,
        })
      },
    }
  )

  function handleSelectDate(date: Date | undefined) {
    setIsCalendarOpen(false)
    setDate(date)
  }

  return (
    <form action={executeFormAction} className="grid gap-4 py-4">
      <div className="grid gap-4">
        <Label htmlFor="date">Data</Label>

        <Popover
          defaultOpen={true}
          open={calendarIsOpen}
          onOpenChange={setIsCalendarOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
              id="date"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString('pt-BR') : 'Selecione o dia'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              className="rounded-md border"
              mode="single"
              locale={ptBR}
              initialFocus
              selected={date}
              onSelect={handleSelectDate}
            />
            <input
              type="hidden"
              name="date"
              value={date?.toISOString() || ''}
            />
          </PopoverContent>
        </Popover>

        {error?.fieldErrors?.date && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.date[0]}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <Label htmlFor="time">Horário</Label>

        <Select name="time">
          <SelectTrigger id="time">
            <SelectValue placeholder="Selecione o horário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10:00">10:00</SelectItem>
            <SelectItem value="11:00">11:00</SelectItem>
            <SelectItem value="12:00">12:00</SelectItem>
            <SelectItem value="13:00">13:00</SelectItem>
            <SelectItem value="18:00">18:00</SelectItem>
            <SelectItem value="19:00">19:00</SelectItem>
            <SelectItem value="20:00">20:00</SelectItem>
            <SelectItem value="21:00">21:00</SelectItem>
            <SelectItem value="22:00">22:00</SelectItem>
          </SelectContent>
        </Select>
        {error?.fieldErrors?.time && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.time[0]}
          </p>
        )}
      </div>
      <div className="grid gap-4">
        <Label htmlFor="guests">Numero de pessoas</Label>

        <Select name="guests">
          <SelectTrigger id="guests">
            <SelectValue placeholder="Selecione o número de pessoas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 pessoa</SelectItem>
            <SelectItem value="2">2 pessoas</SelectItem>
            <SelectItem value="3">3 pessoas</SelectItem>
            <SelectItem value="4">4 pessoas</SelectItem>
            <SelectItem value="5">5 pessoas</SelectItem>
            <SelectItem value="6">6 pessoas</SelectItem>
          </SelectContent>
        </Select>
        {error?.fieldErrors?.guests && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.guests[0]}
          </p>
        )}
      </div>
      <div className="grid gap-4">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Digite seu nome" name="name" />
        {error?.fieldErrors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.name[0]}
          </p>
        )}
      </div>
      <div className="grid gap-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email"
          name="email"
        />
        {error?.fieldErrors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.email[0]}
          </p>
        )}
      </div>
      <div className="grid gap-4">
        <Label htmlFor="specialRequests">Anotações</Label>
        <Textarea
          id="specialRequests"
          name="specialRequests"
          placeholder="Alguns pedidos especiais ou restrições alimentares?"
        />
        {error?.fieldErrors?.specialRequests && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error?.fieldErrors?.specialRequests[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Reservando...' : 'Reservar mesa'}
      </Button>
    </form>
  )
}
