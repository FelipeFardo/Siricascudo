import { DollarSign, Utensils } from 'lucide-react'
import { Suspense } from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { DayOrdersAmountCard } from './day-orders-amount-card'
import { MetricCardSkeleton } from './metric-card-skeleton'
import { MonthCanceledOrdersAmountCard } from './month-canceled-orders-amount'
import { MonthOrdersAmountCard } from './month-orders-amount-card'
import { MonthRevenueCard } from './month-revenue-card'
import { PopularProductsChart } from './popular-products-chart'
import { RevenueChart } from './revenue-chart'

export default function DashboardPage() {
  return (
    <div className="m-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex-row  items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              Receita total (mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <Suspense fallback={<MetricCardSkeleton />}>
              <MonthRevenueCard />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row  items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              Pedidos (mês)
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <Suspense fallback={<MetricCardSkeleton />}>
              <MonthOrdersAmountCard />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row  items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              Pedidos (dia)
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <Suspense fallback={<MetricCardSkeleton />}>
              <DayOrdersAmountCard />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row  items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              Cancelamentos (mês)
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <Suspense fallback={<MetricCardSkeleton />}>
              <MonthCanceledOrdersAmountCard />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-9 gap-4">
        <RevenueChart />
        <PopularProductsChart />
      </div>
    </div>
  )
}
