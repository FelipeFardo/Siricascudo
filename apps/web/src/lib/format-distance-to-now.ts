import { dayjs } from './day-js'

export function formatDistanceToNow(date: Date) {
  const createdAt = dayjs(date)
  const now = dayjs()
  const formattedDate = createdAt.from(now)
  return formattedDate
}
