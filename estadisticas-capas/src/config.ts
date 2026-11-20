import type { ImmutableObject } from 'seamless-immutable'

export type StatType = 'count' | 'sum' | 'avg' | 'min' | 'max'

export interface ExtraModalStat {
  id: string
  label: string // Título o nombre del indicador (ej: "Superficie total construida")
  valueMode?: 'fixed' | 'layer' // Origen: calculado de la capa o valor fijo
  value?: string // Valor manual si es fixed, o valor de respaldo
  statType?: StatType // 'count' | 'sum' | 'avg' | 'min' | 'max'
  statField?: string // Campo numérico seleccionado de la capa
  decimalPlaces?: number // Decimales (0, 1, 2)
  unit?: string // Unidad (ej: "m²", "ha", "%", etc.)
}

export interface InfoModalConfig {
  title?: string // Título de la ventana emergente (ej: "Limitación permanente")
  description?: string // Párrafo explicativo amplio
  source?: string // Fuente oficial (ej: "Secretaría Distrital de Planeación (SDP)")
  lastUpdate?: string // Última actualización (ej: "07/07/2026")
  frequency?: string // Frecuencia (ej: "Tiempo real")

  // Hasta 3 estadísticas adicionales que solo aparecen en la ventana emergente
  extraStats?: ExtraModalStat[]

  // Botón opcional con URL
  buttonText?: string // Ej: "Ver información oficial"
  buttonUrl?: string // Enlace web (ej: "https://sinupot.sdp.gov.co")
}

export interface LayerStatCardConfig {
  id: string
  layerTrigger: string // Nombre o ID de la capa (2D o 3D) o '__all_layers__' para recuento global
  valueMode?: 'fixed' | 'layer'
  value?: string
  statType?: StatType
  statField?: string
  decimalPlaces?: number
  useThousandsSeparator?: boolean

  // Textos y estilo visual
  cardTitle: string
  unit: string
  description?: string
  accentColor?: string
  descriptionColor?: string
  unitColor?: string

  // Ventana emergente de información configurable
  infoModal?: InfoModalConfig
}

export interface Config {
  headerTitle?: string
  noLayerMessage?: string
  cards: LayerStatCardConfig[]
}

export type IMConfig = ImmutableObject<Config>
