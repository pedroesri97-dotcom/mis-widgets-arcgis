import type { ImmutableObject } from 'jimu-core'

export interface Config {
  // Vinculación de capas desde la escena del mapa
  layerIdE15?: string
  layerIdI16?: string
  layerIdE16?: string
  layerIdVolumetry?: string

  // URL del servidor de datos de avance (opcional)
  serverUrl?: string

  // Textos y títulos principales
  headerTitle?: string
  sectionsTitle?: string
  colorModeTitle?: string
  terrainTitle?: string
  selectedTitle?: string
  toolsTitle?: string

  // Nombres de elementos en Secciones de Obra
  sectionLabelE15?: string
  sectionLabelI16?: string
  sectionLabelE16?: string
  volumetryLabel?: string

  // Nombres de opciones en Modo de Color
  modeStatusLabel?: string
  modeScheduleLabel?: string
  modeSourceLabel?: string

  // Nombres de estados de avance (leyenda y fichas)
  statusTerminadoLabel?: string
  statusEnCursoLabel?: string
  statusNoIniciadoLabel?: string
  statusSinDatoLabel?: string

  // Colores de interfaz
  accentColor?: string
  primaryColor?: string
  cardBackground?: string

  // Colores por estado de avance
  colorTerminado?: string
  colorEnCurso?: string
  colorNoIniciado?: string
  colorSinDato?: string

  // Colores de cronograma 4D
  colorCurvaProgramada?: string
  colorFechaCorte?: string
  colorRealHoy?: string
}

export type IMConfig = ImmutableObject<Config>
