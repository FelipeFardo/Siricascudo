import { getCurrentOrg } from '@/auth/auth'
import { Currency } from '@/components/currency'
import { getMonthRevenue } from '@/http/metrics/get-month-revenue'

export async function MonthRevenueCard() {
  const currentOrg = getCurrentOrg()

  const monthRevenue = await getMonthRevenue(currentOrg!)

  return (
    <>
      <span className="text-2xl font-bold tracking-tight">
        <Currency value={monthRevenue.receipt} />
      </span>
      <p className="text-sm text-muted-foreground">
        {monthRevenue.diffFromLastMonth >= 0 ? (
          <>
            <span className="text-emerald-500 dark:text-emerald-400">
              +{monthRevenue.diffFromLastMonth}%
            </span>{' '}
            em relação ao mês passado
          </>
        ) : (
          <>
            <span className="text-rose-500 dark:text-rose-400">
              {monthRevenue.diffFromLastMonth}%
            </span>{' '}
            em relação ao mês passado
          </>
        )}
      </p>
    </>
  )
}
