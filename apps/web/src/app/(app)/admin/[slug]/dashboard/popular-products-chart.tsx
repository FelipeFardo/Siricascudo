'use client'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Pie, PieChart } from 'recharts'
import colors from 'tailwindcss/colors'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getPopularProducts } from '@/http/metrics/get-popular-products'

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500],
]

interface Item {
  product: string
  amount: number
}

interface ItemWithFill extends Item {
  fill: string
}

export function PopularProductsChart() {
  const { slug: orgSlug } = useParams<{
    slug: string
  }>()
  const { data: popularProducts } = useQuery({
    queryKey: ['metrics', 'popular-products'],
    queryFn: () => getPopularProducts(orgSlug),
  })

  let itemsWithFill: ItemWithFill[] = []
  let chartConfig: ChartConfig = {}
  if (popularProducts) {
    itemsWithFill = popularProducts.map((item, index) => ({
      ...item,
      product: item.product,
      fill: COLORS[index % COLORS.length],
    }))

    // Criando o chartConfig dinamicamente
    chartConfig = popularProducts.reduce<ChartConfig>((config, item) => {
      config[item.product] = {
        label: item.product,
        color: COLORS[2],
      }
      return config
    }, {} as ChartConfig)
  }

  const mostSoldProduct = popularProducts?.reduce((max, product) =>
    product.amount > max.amount ? product : max,
  )
  const totalAmount = popularProducts?.reduce(
    (sum, product) => sum + product.amount,
    0,
  )

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Produto Populares
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {popularProducts ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, { payload }) => [
                      <span
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: payload.fill }}
                      ></span>,
                      <span className="text-sm">{name}</span>,
                      <div key="separator" className="h-1" />,
                      <span className="text-sm font-bold">{value}</span>,
                    ]}
                  />
                }
              />
              <Pie data={itemsWithFill} dataKey="amount" nameKey="product" />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
      {mostSoldProduct && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-center font-medium leading-none">
            O produto mais vendido foi {mostSoldProduct.product} com{' '}
            {mostSoldProduct.amount} vendas
          </div>
          <div className="leading-none text-muted-foreground">
            Os produtos mais vendidos somam {totalAmount} vendas
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
