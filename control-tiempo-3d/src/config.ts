import type { ImmutableObject } from 'seamless-immutable'

export interface Config {
  headerTitle?: string
  defaultHour?: number
  animationSpeed?: number
  defaultShadows?: boolean
  timeFormat?: '12h' | '24h'
}

export type IMConfig = ImmutableObject<Config>
