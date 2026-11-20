import type { ImmutableObject } from 'seamless-immutable'

export type DataServiceActionType = 'url' | 'window'

export interface DataServiceCardConfig {
  id: string
  title: string
  source: string
  dataType: string
  updateDate?: string
  url?: string
  targetType?: DataServiceActionType
  dialogId?: string
  buttonText?: string
  description?: string
  nonOpenDataNotice?: string
  accentColor?: string
}

export interface Config {
  headerSubtitle?: string
  headerTitle?: string
  headerDescription?: string
  cards: DataServiceCardConfig[]
}

export type IMConfig = ImmutableObject<Config>
