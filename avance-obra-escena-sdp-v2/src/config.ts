import type { ImmutableObject } from 'jimu-core'

export interface Config {
  /** Base URL of /data/avance-elements.json and /predial-station-footprints.json: the published site
   *  (dureyes97.github.io/avance-plmb) or the local arcgis-poc/serve.mjs. */
  serverUrl: string

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
