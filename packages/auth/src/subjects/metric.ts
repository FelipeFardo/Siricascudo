import { z } from 'zod'

export const metricSubject = z.tuple([z.literal('get'), z.literal('Metric')])

export type MetricSubject = z.infer<typeof metricSubject>
