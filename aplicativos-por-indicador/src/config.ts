import type { ImmutableObject } from 'seamless-immutable'

export type DimensionType = 'Ambiental' | 'Urbanística' | 'Social' | 'Económica'
export type StatusType = 'En producción' | 'Activo' | 'Inactivo' | 'En actualización'
export type ActionTargetType = 'window' | 'url'

export interface BoardCardConfig {
  id: string
  kpiCode: string
  title: string
  dimension: DimensionType
  status: StatusType
  description: string
  updateDate?: string
  targetType?: ActionTargetType
  dialogId?: string
  appUrl?: string
  buttonText?: string
  updateNotice?: string
  accentColor?: string
}

export interface Config {
  headerSubtitle?: string
  headerTitle?: string
  headerDescription?: string
  cards: BoardCardConfig[]
}

export type IMConfig = ImmutableObject<Config>
