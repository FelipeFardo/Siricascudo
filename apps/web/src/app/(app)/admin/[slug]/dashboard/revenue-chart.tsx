'use client'
import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Label } from '@/components/ui/label'
import { getDailyRevenueInPeriod } from '@/http/metrics/get-daily-revenue-in-period'

const chartConfig = {
  receipt: {
    label: 'Receipt',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function RevenueChart() {
  const { slug: orgSlug } = useParams<{
    slug: string
  }>()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const { data: dailyRevenueInPeriod } = useQuery({
    queryKey: ['metrics', 'daily-revenue-in-period', dateRange],
    queryFn: () =>
      getDailyRevenueInPeriod({
        org: orgSlug,
        from: dateRange?.from,
        to: dateRange?.to,
      }),
  })

  const chartData = useMemo(() => {
    return dailyRevenueInPeriod?.map((chartItem) => {
      return {
        date: chartItem.date,
        receipt: chartItem.receipt / 100,
      }
    })
  }, [dailyRevenueInPeriod])

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Label>Período</Label>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        {chartData ? (
          <ChartContainer config={chartConfig}>
            {/* <pre>{JSON.stringify(chartData, null, 2)}</pre> */}
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="receipt"
                type="natural"
                fill="var(--color-receipt)"
                fillOpacity={0.4}
                stroke="var(--color-receipt)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
