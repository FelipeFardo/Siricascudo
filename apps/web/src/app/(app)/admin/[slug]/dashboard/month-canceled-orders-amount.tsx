import { getCurrentOrg } from '@/auth/auth'
import { getMonthCanceledOrdersAmount } from '@/http/metrics/get-month-canceled-orders-amount'

export async function MonthCanceledOrdersAmountCard() {
  const currentOrg = getCurrentOrg()

  const monthCanceledOrdersAmount = await getMonthCanceledOrdersAmount(
    currentOrg!,
  )

  return (
    <>
      <span className="text-2xl font-bold tracking-tight">
        {monthCanceledOrdersAmount.amount.toLocaleString('pt-BR')}
      </span>
      <p className="text-sm text-muted-foreground">
        {monthCanceledOrdersAmount.diffFromLastMonth < 0 ? (
          <>
            <span className="text-emerald-500 dark:text-emerald-400">
              {monthCanceledOrdersAmount.diffFromLastMonth}%
            </span>{' '}
            em relação ao mês passado
          </>
        ) : (
          <>
            <span className="text-rose-500 dark:text-rose-400">
              +{monthCanceledOrdersAmount.diffFromLastMonth}%
            </span>{' '}
            em relação ao mês passado
          </>
        )}
      </p>
    </>
  )
}
