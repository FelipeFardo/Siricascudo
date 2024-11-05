import Image from 'next/image'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getOrganization } from '@/http/orgs/get-organization'

export default async function organizationPage() {
  const currentOrg = await getCurrentOrg()
  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="mx-auto my-8 flex max-w-[1200px] flex-col">
      <div className="flex gap-x-12">
        <Image
          height={100}
          width={100}
          src={organization.avatarUrl || '/placeholder-image-2.webp'}
          alt={organization.name}
          className="rounded-lg"
        />
        <div className="flex flex-col justify-center truncate">
          <h1 className="text-md truncate font-semibold">
            {organization.name}
          </h1>
          <p className="text-gray-600">{organization.category}</p>
        </div>
      </div>
      <Tabs defaultValue="products" className="my-8">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reserva">Reservas</TabsTrigger>
        </TabsList>
        <TabsContent value="reserva">
          <Card>
            <CardHeader>
              <CardTitle>Reserva</CardTitle>
              <CardDescription>
                Escolha um dia que gostaria de vir em nosso restaurante.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex space-x-8">
                <Calendar
                  mode="single"
                  // selected={date}
                  // onSelect={setDate}

                  className="rounded-md border"
                />
                <div>
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@peduarte" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
