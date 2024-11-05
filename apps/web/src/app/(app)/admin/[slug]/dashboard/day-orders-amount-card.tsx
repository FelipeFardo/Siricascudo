import { getCurrentOrg } from '@/auth/auth'
import { getDayOrdersAmount } from '@/http/metrics/get-day-orders-amount'

export async function DayOrdersAmountCard() {
  const currentOrg = await getCurrentOrg()

  const dayOrdersAmount = await getDayOrdersAmount(currentOrg!)

  return (
    <>
      <span className="text-2xl font-bold tracking-tight">
        {dayOrdersAmount.amount.toLocaleString('pt-BR')}
      </span>
      <p className="text-sm text-muted-foreground">
        {dayOrdersAmount.diffFromYesterday >= 0 ? (
          <>
            <span className="text-emerald-500 dark:text-emerald-400">
              +{dayOrdersAmount.diffFromYesterday}%
            </span>{' '}
            em relação a ontem
          </>
        ) : (
          <>
            <span className="text-rose-500 dark:text-rose-400">
              {dayOrdersAmount.diffFromYesterday}%
            </span>{' '}
            em relação a ontem
          </>
        )}
      </p>
    </>
  )
}
