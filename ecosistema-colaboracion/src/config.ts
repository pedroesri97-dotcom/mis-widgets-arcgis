import type { ImmutableObject } from 'jimu-core'

export interface ThemeColors {
  widgetBg: string
  cardBg: string
  accentColor: string
  cardBorder: string
}

export interface ChannelItem {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonType?: 'primary' | 'secondary'
  targetType: 'window' | 'url'
  dialogId?: string
  url?: string
  features?: string[]
}

export interface Config {
  showDividerBar?: boolean
  headerTitle?: string
  headerDescription?: string
  entityChannel: ChannelItem
  feedbackEnabled?: boolean
  feedbackChannel: ChannelItem
  themeColors?: ThemeColors
}

export type IMConfig = ImmutableObject<Config>
