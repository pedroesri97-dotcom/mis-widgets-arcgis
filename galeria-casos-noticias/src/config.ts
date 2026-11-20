import type { ImmutableObject } from 'jimu-core'

export interface NewsCaseItem {
  id: string
  title: string
  source?: string
  date?: string
  imageUrl?: string
  url?: string
  dialogId?: string
  targetType?: 'url' | 'window'
  buttonText?: string
}

export interface ThemeColors {
  widgetBg: string
  cardBg: string
  accentColor: string
  cardBorder: string
}

export interface Config {
  headerSubtitle?: string
  headerTitle?: string
  headerDescription?: string
  autoplay?: boolean
  autoplaySpeed?: number
  newsItems: NewsCaseItem[]
  themeColors?: ThemeColors
}

export type IMConfig = ImmutableObject<Config>
