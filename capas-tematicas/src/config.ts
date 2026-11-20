import type { ImmutableObject } from 'seamless-immutable'

/**
 * ============================================================================
 * MODELO DE DATOS Y CONFIGURACIÓN: WIDGET DE CAPAS TEMÁTICAS
 * ============================================================================
 * 
 * Este archivo define los tipos de datos principales que estructuran el widget.
 * Permite gestionar categorías, subgrupos y capas individuales tanto en vistas
 * bidimensionales (Mapas 2D) como tridimensionales (Escenas 3D).
 * 
 * CONSIDERACIONES DE SEGURIDAD Y PRIVACIDAD:
 * 1. No se almacenan credenciales, tokens ni URLs de servicios expuestos.
 * 2. La comunicación con las capas se realiza exclusivamente a través de los
 *    mecanismos nativos autenticados de ArcGIS Experience Builder (JimuMapView).
 * 3. Todo el acceso a datos respeta los permisos y roles de ArcGIS Enterprise / Portal.
 */

/**
 * Representa la configuración individual de una capa geográfica dentro del widget.
 */
export interface LayerItemConfig {
  /** Identificador único dentro de la aplicación (ej: 'base-fachadas-v2', 'base-parque') */
  id: string

  /** Nombre visible para el usuario en la interfaz del panel */
  title: string

  /** Título de la capa tal como aparece en el Web Map 2D de ArcGIS */
  mapLayerTitle: string

  /** Título de la capa en la Web Scene 3D de ArcGIS (opcional si coincide con el mapa) */
  sceneLayerTitle?: string

  /** Subgrupo temático opcional para agrupar capas afines (ej: 'Telecomunicaciones', 'Acueducto') */
  group?: string

  /** Etiqueta destacada o pill visual (ej: '2025 OFICIAL', 'POT') */
  badge?: string

  /** Color distintivo del indicador / viñeta en formato hexadecimal o CSS */
  color?: string

  /** Estado de visibilidad inicial al cargar el aplicativo (por defecto: false) */
  visibleByDefault?: boolean

  /** Descripción corta o texto de ayuda para el usuario */
  description?: string
}

/**
 * Representa una categoría temática principal (acordeón contenedor de capas y subgrupos).
 */
export interface LayerCategoryConfig {
  /** Identificador único de la categoría (ej: 'cat-base', 'cat-social') */
  id: string

  /** Código numérico o nemotécnico (ej: '0', '1', 'base', 'metro') */
  code: string

  /** Título principal de la categoría (ej: 'INFORMACIÓN BASE', 'SOCIAL', 'ESTACIONES DE METRO') */
  title: string

  /** Subtítulo descriptivo de apoyo */
  subtitle?: string

  /** Etiqueta de cantidad de capas (ej: '17 CAPAS') */
  badge?: string

  /** Color distintivo del borde o acento de la categoría */
  color?: string

  /** Determina si el acordeón arranca desplegado o comprimido (por defecto: false) */
  expandedByDefault?: boolean

  /** Listado de capas que pertenecen a esta categoría */
  layers: LayerItemConfig[]
}

/**
 * Configuración general del widget almacenada en Experience Builder.
 */
export interface Config {
  /** Subtítulo superior de la cabecera (ej: 'EXPLORACIÓN TERRITORIAL') */
  headerSubtitle?: string

  /** Título principal de la cabecera (ej: 'Capas Temáticas') */
  headerTitle?: string

  /** Si está activo, añade capas detectadas automáticamente a las listas */
  autoDetectMapLayers?: boolean

  /** Si es true, garantiza que todas las capas inicien apagadas al cargar */
  allOffByDefault?: boolean

  /** Muestra u oculta el bloque de fecha y hora en la cabecera */
  showClock?: boolean

  /** Muestra u oculta la etiqueta 'No disponible 2D' si aplicara */
  showUnavailableTag?: boolean

  /** Permite o bloquea el encendido masivo por subgrupos y cabecera */
  allowGroupToggle?: boolean

  /** Colección completa de categorías y capas configuradas */
  categories: LayerCategoryConfig[]
}

/**
 * Tipo inmutable requerido por la arquitectura de ArcGIS Experience Builder.
 */
export type IMConfig = ImmutableObject<Config>
