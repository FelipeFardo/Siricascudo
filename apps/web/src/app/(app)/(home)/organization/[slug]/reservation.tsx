'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { pt } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { createReservation } from '@/http/reservation/create-reservations'
import { cn } from '@/lib/utils'

const reservationSchema = z.object({
  date: z.date({ required_error: 'Selecione uma data' }),
  time: z
    .string({ message: 'Selecione um horário' })
    .min(1, { message: 'Selecione um horário' }),
  guests: z
    .string({ message: 'Número de pessoas é necessário' })
    .min(1, { message: 'Número de pessoas é necessário' }),
  name: z
    .string({ message: 'Nome é obrigatório ' })
    .min(1, { message: 'Nome é obrigatório ' }),
  email: z
    .string({ message: 'Digite um email válido' })
    .email({ message: 'Digite um email válido' }),
  specialRequests: z.string().optional(),
})

export type ReservationData = z.infer<typeof reservationSchema>

export function Reservation() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { slug: orgSlug } = useParams<{
    slug: string
  }>()

  const [calendarIsOpen, setCalendarIsOpen] = useState(true)

  const { toast } = useToast()

  const form = useForm<ReservationData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: new Date(),
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  async function onSubmit(data: ReservationData) {
    try {
      await createReservation({
        date: data.date,
        email: data.email,
        guests: Number(data.guests),
        name: data.name,
        slug: orgSlug,
        time: data.time,
        specialRequests: data.specialRequests,
      })
      reset()

      setDialogOpen(false)
      toast({
        variant: 'default',
        title: 'Agendamento confirmado!',
        duration: 5000,
        description: 'Seu horário foi reservado com sucesso.',
        action: <ToastAction altText="Fechar">Fechar</ToastAction>,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 w-full">Reservar mesa</Button>
      </DialogTrigger>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Reserva mesa</DialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <ScrollArea className="max-h-[60vh] ">
              <div className="px-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover
                        onOpenChange={setCalendarIsOpen}
                        open={calendarIsOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? field.value.toLocaleDateString('pt-BR')
                                : 'Selecione o dia'}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setCalendarIsOpen(false)
                            }}
                            locale={pt}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
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

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero de pessoas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o número de pessoas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 pessoa</SelectItem>
                          <SelectItem value="2">2 pessoas</SelectItem>
                          <SelectItem value="3">3 pessoas</SelectItem>
                          <SelectItem value="4">4 pessoas</SelectItem>
                          <SelectItem value="5">5 pessoas</SelectItem>
                          <SelectItem value="6">6 pessoas</SelectItem>
                          <SelectItem value="7">7 pessoas</SelectItem>
                          <SelectItem value="8">8 pessoas</SelectItem>
                          <SelectItem value="9">9 pessoas</SelectItem>
                          <SelectItem value="10">10 pessoas</SelectItem>
                          <SelectItem value="11">11 pessoas</SelectItem>
                          <SelectItem value="12">12 pessoas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="seu nome.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anotações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Alguns pedidos especiais ou restrições alimentares?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Reservando...' : 'Reservar mesa'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
