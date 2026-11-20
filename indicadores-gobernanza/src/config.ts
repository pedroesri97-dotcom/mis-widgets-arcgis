import type { ImmutableObject } from 'seamless-immutable'

export interface GovernanceCardConfig {
  id: string
  title: string
  currentValue: number
  unit: string
  deltaText?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  comparisonTitle: string
  comparisonSample?: string
  prevPeriodLabel: string
  prevValue: number
  currentPeriodLabel: string
  currValue: number
  description?: string
  accentColor?: string
}

export interface Config {
  headerSubtitle?: string
  headerTitle?: string
  headerDescription?: string
  cards: GovernanceCardConfig[]
}

export type IMConfig = ImmutableObject<Config>
