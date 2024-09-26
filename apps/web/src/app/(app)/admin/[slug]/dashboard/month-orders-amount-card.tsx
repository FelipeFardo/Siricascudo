import { getCurrentOrg } from '@/auth/auth'
import { getMonthOrdersAmount } from '@/http/metrics/get-month-orders-amount'

export async function MonthOrdersAmountCard() {
  const currentOrg = getCurrentOrg()

  const monthOrdersAmount = await getMonthOrdersAmount(currentOrg!)

  return (
    <>
      <span className="text-2xl font-bold tracking-tight">
        {monthOrdersAmount.amount.toLocaleString('pt-BR')}
      </span>
      <p className="text-sm text-muted-foreground">
        {monthOrdersAmount.diffFromLastMonth >= 0 ? (
          <>
            <span className="text-emerald-500 dark:text-emerald-400">
              +{monthOrdersAmount.diffFromLastMonth}%
            </span>{' '}
            em relação ao mês passado
          </>
        ) : (
          <>
            <span className="text-rose-500 dark:text-rose-400">
              {monthOrdersAmount.diffFromLastMonth}%
            </span>{' '}
            em relação ao mês passado
          </>
        )}
      </p>
    </>
  )
}
