'use client'

import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

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

export function Reservation() {
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <form>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="date">Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toDateString() : 'Selecione uma data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Horário</Label>
          <Select>
            <SelectTrigger id="time">
              <SelectValue placeholder="Selecione um horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18:00">18:00</SelectItem>
              <SelectItem value="19:00">19:00</SelectItem>
              <SelectItem value="20:00">20:00</SelectItem>
              <SelectItem value="21:00">21:00</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="guests">Número de Convidados</Label>
          <Select>
            <SelectTrigger id="guests">
              <SelectValue placeholder="Selecione o número de convidados" />
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
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Digite seu nome" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Digite seu email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="special-requests">Pedidos Especiais</Label>
          <Textarea
            id="special-requests"
            placeholder="Algum pedido especial ou exigência alimentar?"
          />
        </div>
        <Button className="w-full">Reservar Mesa</Button>
      </div>
    </form>
  )
}
