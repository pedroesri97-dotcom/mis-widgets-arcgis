/** @jsxRuntime classic */
/** @jsx jsx */
// Seguimiento y simulación 4D de obra para E15, I16 y E16 en ArcGIS Experience Builder:
// Opera conectado a un widget de Mapa o de forma autónoma abriendo la escena web oficial de la SDP.
// Identifica las capas de avance y volumetría (por configuración, URL de servicio o título),
// aplica simbología por avance o cronograma (4D), oculta volumetría en huellas prediales,
// expone la fuente de datos «Elementos de avance» y provee herramientas 3D interactivas.
import {
  React, ReactDOM, jsx, css, Immutable, DataSourceComponent, DataSourceStatus, ReactRedux, getAppStore, appActions,
  type AllWidgetProps, type FeatureLayerDataSource, type ImmutableArray, type IMState
} from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import WebScene from 'esri/WebScene'
import SceneView from 'esri/views/SceneView'
import FeatureLayer from 'esri/layers/FeatureLayer'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import Graphic from 'esri/Graphic'
import Point from 'esri/geometry/Point'
import Polygon from 'esri/geometry/Polygon'
import Slice from 'esri/widgets/Slice'
import SceneFilter from 'esri/layers/support/SceneFilter'
import esriRequest from 'esri/request'
import { CUTOFF_STATE_KEY, SCHEDULE, isoDay, scheduleClass, timelapseWhere, today } from './avance-schedule'
import { SchedulePanel } from './avance-schedule-panel'
import { packageFootprint } from './package-footprint'
import type { IMConfig } from '../config'
import { FIELD_NAMES, ID_FIELD } from '../output-schema'

const WEB_SCENE = { portalUrl: 'https://sinupotdes.sdp.gov.co/portalp', id: '839de5bdfa814f60b2a1baa743bc7f56' }

const DEFAULT_STATUS = [
  { value: 'Terminado', color: [68, 197, 138], css: '#44c58a' },
  { value: 'En curso', color: [242, 201, 76], css: '#f2c94c' },
  { value: 'No iniciado', color: [239, 100, 100], css: '#ef6464' },
  { value: 'Sin dato', color: [154, 165, 177], css: '#9aa5b1' }
]

const DEFAULT_SECTION_LABELS: { [code: string]: string } = {
  E15: 'Estación 15 · Calle 63',
  I16: 'Interestación 16 · viaducto',
  E16: 'Estación 16 · Calle 72'
}

const SECTION_URLS: { [code: string]: string } = {
  E15: 'https://tiles.arcgis.com/tiles/BQTQBNBsmxjF8vus/arcgis/rest/services/E15_Avance_3DObject/SceneServer/layers/0',
  I16: 'https://tiles.arcgis.com/tiles/BQTQBNBsmxjF8vus/arcgis/rest/services/I16_Avance_3DObject_/SceneServer/layers/0',
  E16: 'https://tiles.arcgis.com/tiles/BQTQBNBsmxjF8vus/arcgis/rest/services/E16_Avance_3DObject/SceneServer/layers/0'
}

const VOLUMETRY_URL = 'https://arcgis.esri.co/server/rest/services/Hosted/Volumetria_2021__Octubre_2026_Fachada/SceneServer/layers/0'

const KEY_FIELDS: Array<[string, string]> = [
  ['Avance', 'Avance (%)'], ['Actividad', 'Actividad'], ['ActividadNombre', 'Nombre de actividad'], ['FechaInicio', 'Inicio'],
  ['FechaFin', 'Fin'], ['Contratista', 'Contratista'], ['UE', 'Unidad de ejecución'], ['Categoria', 'Categoría'], ['Family', 'Familia'],
  ['Type', 'Tipo'], ['Nivel', 'Nivel'], ['IfcGUID', 'IfcGUID'], ['ExtId', 'ID de Revit'], ['Seccion', 'Sección'], ['Modelo', 'Modelo Revit']
]

const HIGHLIGHT_LIMIT = 5000
const SPIN_DEGREES_PER_SECOND = 6

let cachedElementsUrl: string | null = null
let cachedElementsPromise: Promise<{ columns: string[], rows: any[][] }> | null = null
let cachedFootprintsUrl: string | null = null
let cachedFootprintsPromise: Promise<any> | null = null

function getElementsUrl (server: string, portalUrl?: string): string {
  const target = (server || '').trim().replace(/\/$/, '')
  if (!target) return ''
  const basePortal = (portalUrl || WEB_SCENE.portalUrl).replace(/\/$/, '')
  if (/^[0-9a-fA-F]{32}$/.test(target)) {
    return `${basePortal}/sharing/rest/content/items/${target}/data`
  }
  if (target.includes('/sharing/rest/content/items/')) {
    return target
  }
  if (target.endsWith('.json') || target.endsWith('.geojson') || target.endsWith('.txt')) {
    return target
  }
  return `${target}/data/avance-elements.json`
}

function getFootprintsUrl (server: string): string {
  const target = (server || '').trim().replace(/\/$/, '')
  if (!target) return ''
  if (target.includes('/sharing/rest/content/items/') || /^[0-9a-fA-F]{32}$/.test(target) || target.endsWith('.json') || target.endsWith('.geojson') || target.endsWith('.txt')) {
    return ''
  }
  return `${target}/predial-station-footprints.json`
}

function fetchElements (server: string, portalUrl?: string) {
  const url = getElementsUrl(server, portalUrl)
  if (!url) {
    return Promise.reject(new Error('No se ha configurado la URL o el ID del ítem JSON de avance.'))
  }
  if (url !== cachedElementsUrl || !cachedElementsPromise) {
    cachedElementsUrl = url
    cachedElementsPromise = esriRequest(url, { responseType: 'json' })
      .then(response => response.data)
      .catch((err: any) => {
        return esriRequest(url, { responseType: 'text' })
          .then(textResp => JSON.parse(textResp.data))
          .catch(() => { throw err })
      })
  }
  return cachedElementsPromise
}

function fetchFootprints (server: string) {
  const url = getFootprintsUrl(server)
  if (!url) return Promise.resolve({ stations: [] })
  if (url !== cachedFootprintsUrl || !cachedFootprintsPromise) {
    cachedFootprintsUrl = url
    cachedFootprintsPromise = esriRequest(url, { responseType: 'json' })
      .then(response => response.data)
      .catch(() => ({ stations: [] }))
  }
  return cachedFootprintsPromise
}

function hexToRgb (hex: string, fallback: [number, number, number]): [number, number, number] {
  if (!hex) return fallback
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? fallback : [r, g, b]
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? fallback : [r, g, b]
  }
  return fallback
}

const serviceUrl = (url: string): string => url?.replace(/\/layers\/\d+\/?$/, '').replace(/\/$/, '').toLowerCase()
const sceneLayers = (map: __esri.Map) => map ? map.allLayers.filter(l => l.type === 'scene').toArray() as __esri.SceneLayer[] : []

// Búsqueda inteligente de capas por configuración explícita, URL de servicio o título
const findSectionLayer = (map: __esri.Map, configuredId: string, serviceEndpoint: string, defaultRegex: RegExp): __esri.SceneLayer | null => {
  if (!map) return null
  const layers = sceneLayers(map)
  if (configuredId) {
    const clean = configuredId.trim().toLowerCase()
    const match = layers.find(l => l.id === configuredId || (l.title && l.title.trim().toLowerCase() === clean))
    if (match) return match
  }
  if (serviceEndpoint) {
    const matchUrl = layers.find(l => serviceUrl(l.url) === serviceUrl(serviceEndpoint))
    if (matchUrl) return matchUrl
  }
  return layers.find(l => defaultRegex.test(l.title ?? '')) || null
}

const meshFill = (color: number[] | null) => ({ type: 'mesh-3d', symbolLayers: [{ type: 'fill', material: color ? { color, colorMixMode: 'replace' } : undefined }] })

const scheduleSymbols = new Map(SCHEDULE.map(s => [s.value, meshFill([...s.color, s.value === 'Sin programación' ? 0.35 : 1])]))
const defaultScheduleSymbol = scheduleSymbols.get('Sin programación')

function scheduleRenderer (elements: Array<{ [field: string]: any }>, cutoff: number) {
  const byClass = new Map<string, number[]>()
  for (let i = 0; i < elements.length; i++) {
    const a = elements[i]
    const value = scheduleClass(a, cutoff)
    let list = byClass.get(value)
    if (!list) {
      list = []
      byClass.set(value, list)
    }
    list.push(a.OID)
  }
  const uniqueValueInfos: any[] = []
  for (const [value, oids] of byClass) {
    const symbol = scheduleSymbols.get(value)
    for (let j = 0; j < oids.length; j++) {
      uniqueValueInfos.push({ value: oids[j], label: value, symbol })
    }
  }
  return {
    type: 'unique-value',
    field: 'OBJECTID_1',
    uniqueValueInfos,
    defaultSymbol: defaultScheduleSymbol
  }
}

const number = (value: number) => Number(value).toLocaleString('es-CO')
const scheduleCss = (value: string) => SCHEDULE.find(s => s.value === value)?.css ?? '#9aa5b1'

interface Section { code: string, layer: __esri.SceneLayer, layerView?: __esri.SceneLayerView }
interface Table {
  attributes: Array<{ [field: string]: any }>
  recordIdByElement: Map<string, number>
  matcher: __esri.FeatureLayer
}

const style = css`
  position: relative;
  height: 100%;
  overflow: hidden;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 11px;
  color: #ffffff;
  user-select: none;

  .scene {
    position: absolute;
    inset: 0;
    background: #0b1117;
  }

  .panel {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 14px;
    background: #111822;
    color: #ffffff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .scene + .panel {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 320px;
    height: auto;
    max-height: calc(100% - 20px);
    background: rgba(17, 24, 34, 0.94);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    z-index: 5;
  }

  .collapse {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 6;
    background: #151f2b;
    border: 1px solid #1e293b;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  .panel::-webkit-scrollbar {
    width: 4px;
  }
  .panel::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.15);
  }
  .panel::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 2px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  h2 {
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.02em;
    margin: 0;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .calcite-card {
    background: var(--calcite-card-bg, #151f2b);
    border: 1px solid #1e293b;
    border-radius: 4px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
  }

  h3 {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 2px 0;
  }
  .section-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    cursor: pointer;
    font-size: 11px;
    color: #ffffff;
  }
  .section-info input[type=checkbox] {
    accent-color: var(--calcite-primary, #0284c7);
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .section-info span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-action-sm {
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 500;
    background: #1e293b;
    border: 1px solid #243447;
    color: #cbd5e1;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .btn-action-sm:hover {
    background: #243447;
    border-color: #3b4d63;
    color: #ffffff;
  }

  .color-mode-pills {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 2px;
  }
  .color-mode-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 11px;
    color: #cbd5e1;
    padding: 3px 0;
  }
  .color-mode-option input[type=radio] {
    accent-color: var(--calcite-primary, #0284c7);
    cursor: pointer;
    width: 13px;
    height: 13px;
  }

  .legend-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 3px;
    padding: 6px 8px;
    margin-top: 4px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #94a3b8;
  }
  .legend-swatch-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-count {
    font-weight: 600;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
  }

  .swatch {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    flex: none;
    display: inline-block;
  }

  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: #111822;
    outline: none;
    cursor: pointer;
    margin: 6px 0 2px;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid var(--calcite-primary, #0284c7);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.1s ease;
  }
  input[type=range]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid var(--calcite-primary, #0284c7);
    cursor: pointer;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    margin: 0;
    font-size: 11px;
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 3px;
    padding: 8px 10px;
  }
  dt {
    color: #94a3b8;
    font-weight: 500;
  }
  dd {
    margin: 0;
    color: #ffffff;
    word-break: break-word;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .note {
    color: #64748b;
    margin: 0;
    font-size: 10px;
    line-height: 1.4;
    font-style: italic;
  }

  .tools-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .btn-tool {
    padding: 6px 4px;
    font-size: 10px;
    font-weight: 600;
    background: #1e293b;
    border: 1px solid #243447;
    color: #ffffff;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    user-select: none;
  }
  .btn-tool:hover {
    background: #243447;
    border-color: #3b4d63;
  }
  .btn-tool[aria-pressed=true] {
    background: var(--calcite-primary, #0284c7);
    border-color: var(--calcite-primary, #0284c7);
    color: #ffffff;
  }

  .status-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: #64748b;
    margin-top: 2px;
    line-height: 1.3;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--calcite-accent, #00b4d8);
    flex: none;
  }
`

const tipStyle = css`
  position: absolute;
  pointer-events: none;
  max-width: 280px;
  background: rgba(17, 24, 34, 0.95);
  backdrop-filter: blur(6px);
  color: #ffffff;
  border: 1px solid #1e293b;
  border-radius: 4px;
  padding: 8px 10px;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  font-size: 11px;
  line-height: 1.4;
  z-index: 100;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);

  b {
    display: block;
    font-size: 12px;
    color: #ffffff;
    margin-bottom: 4px;
    font-weight: 600;
  }
  span {
    color: #64748b;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: -1px;
  }
`

export default function Widget (props: AllWidgetProps<IMConfig>) {
  const server = (props.config?.serverUrl || '').trim().replace(/\/$/, '')
  const mapWidgetId = props.useMapWidgetIds?.[0]
  const outputId = props.outputDataSources?.[0]
  const useDataSource = React.useMemo(() => outputId ? Immutable({ dataSourceId: outputId, mainDataSourceId: outputId }) : null, [outputId])

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)

  // Escena propia cuando no se selecciona ningún widget de Mapa
  const sceneBox = React.useRef<HTMLDivElement>(null)
  const [ownView, setOwnView] = React.useState<__esri.SceneView>(null)
  React.useEffect(() => {
    if (mapWidgetId || !sceneBox.current) return
    const own = new SceneView({
      container: sceneBox.current,
      map: new WebScene({ portalItem: { id: WEB_SCENE.id, portal: { url: WEB_SCENE.portalUrl } } as any }),
      qualityProfile: 'high',
      ui: { components: ['zoom', 'compass'] }
    })
    setOwnView(own)
    return () => { setOwnView(null); own.destroy() }
  }, [mapWidgetId])

  const [collapsed, setCollapsed] = React.useState(false)
  const view = (mapWidgetId ? (jimuMapView?.view?.type === '3d' ? jimuMapView.view : null) : ownView) as __esri.SceneView
  const viewRef = React.useRef<__esri.SceneView>(null)
  viewRef.current = view
  const sectionsRef = React.useRef<Section[]>([])
  const highlights = React.useRef<__esri.Handle[]>([])
  const tableRef = React.useRef<Table>(null)
  const volumetryRef = React.useRef<__esri.SceneLayer>(null)

  const [ds, setDs] = React.useState<FeatureLayerDataSource>(null)
  const dsRef = React.useRef<FeatureLayerDataSource>(null)
  dsRef.current = ds
  const [table, setTable] = React.useState<Table>(null)
  const [sections, setSections] = React.useState<Section[]>([])
  const [layerViewsReady, setLayerViewsReady] = React.useState(0)
  const [queryVersion, setQueryVersion] = React.useState(0)
  const [selection, setSelection] = React.useState<Array<string | number>>([])
  const [colorMode, setColorMode] = React.useState<'status' | 'schedule' | 'source'>('schedule')

  const sharedCutoff = ReactRedux.useSelector((state: IMState) => state.widgetsState?.[CUTOFF_STATE_KEY]?.cutoff as number)
  const cutoff = sharedCutoff ?? today()
  const setCutoff = React.useCallback((value: number) => { getAppStore().dispatch(appActions.widgetStatePropChange(CUTOFF_STATE_KEY, 'cutoff', value)) }, [])

  const [buildUp, setBuildUp] = React.useState(false)
  const [hideUnscheduled, setHideUnscheduled] = React.useState(false)
  const timelapse = colorMode === 'schedule' ? timelapseWhere(cutoff, buildUp, hideUnscheduled) : null
  const [tip, setTip] = React.useState<{ x: number, y: number, a: { [field: string]: any } }>(null)
  const [tipHost, setTipHost] = React.useState<HTMLElement>(null)
  const [slicing, setSlicing] = React.useState(false)
  const [spinning, setSpinning] = React.useState(false)
  const [groundOpacity, setGroundOpacity] = React.useState(100)
  const [volumetryOn, setVolumetryOn] = React.useState(true)
  const [volumetryFound, setVolumetryFound] = React.useState(false)
  const [statusText, setStatusText] = React.useState('Conectando con la escena…')
  const [visibleCount, setVisibleCount] = React.useState<number>(null)

  // Configuración de textos y colores
  const cfgHeaderTitle = props.config?.headerTitle || 'Avance de Obra · PLMB'
  const cfgSectionsTitle = props.config?.sectionsTitle || 'Secciones de obra'
  const cfgColorModeTitle = props.config?.colorModeTitle || 'Modo de color'
  const cfgTerrainTitle = props.config?.terrainTitle || 'Transparencia del terreno'
  const cfgSelectedTitle = props.config?.selectedTitle || 'Elemento seleccionado'
  const cfgToolsTitle = props.config?.toolsTitle || 'Herramientas 3D'

  const sectionLabels: { [code: string]: string } = {
    E15: props.config?.sectionLabelE15 || DEFAULT_SECTION_LABELS.E15,
    I16: props.config?.sectionLabelI16 || DEFAULT_SECTION_LABELS.I16,
    E16: props.config?.sectionLabelE16 || DEFAULT_SECTION_LABELS.E16
  }

  const cfgAccentColor = props.config?.accentColor || '#00b4d8'
  const cfgPrimaryColor = props.config?.primaryColor || '#0284c7'
  const cfgCardBackground = props.config?.cardBackground || '#151f2b'
  const cfgColorCurva = props.config?.colorCurvaProgramada || '#00b4d8'
  const cfgColorCorte = props.config?.colorFechaCorte || '#fbbf24'
  const cfgColorReal = props.config?.colorRealHoy || '#34d399'

  const statusItems = React.useMemo(() => [
    { value: 'Terminado', color: hexToRgb(props.config?.colorTerminado, [68, 197, 138]), css: props.config?.colorTerminado || '#44c58a' },
    { value: 'En curso', color: hexToRgb(props.config?.colorEnCurso, [242, 201, 76]), css: props.config?.colorEnCurso || '#f2c94c' },
    { value: 'No iniciado', color: hexToRgb(props.config?.colorNoIniciado, [239, 100, 100]), css: props.config?.colorNoIniciado || '#ef6464' },
    { value: 'Sin dato', color: hexToRgb(props.config?.colorSinDato, [154, 165, 177]), css: props.config?.colorSinDato || '#9aa5b1' }
  ], [props.config?.colorTerminado, props.config?.colorEnCurso, props.config?.colorNoIniciado, props.config?.colorSinDato])

  const renderers = React.useMemo(() => ({
    status: {
      type: 'unique-value',
      field: 'EstadoAvance',
      uniqueValueInfos: statusItems.map(s => ({
        value: s.value,
        label: s.value,
        symbol: meshFill([...s.color, s.value === 'Sin dato' ? 0.55 : 1])
      })),
      defaultSymbol: meshFill([154, 165, 177, 0.55])
    },
    source: { type: 'simple', symbol: meshFill(null) }
  }), [statusItems])

  const getStatusDisplayName = (raw: string) => {
    switch (raw) {
      case 'Terminado': return props.config?.statusTerminadoLabel || 'Terminado'
      case 'En curso': return props.config?.statusEnCursoLabel || 'En curso'
      case 'No iniciado': return props.config?.statusNoIniciadoLabel || 'No iniciado'
      case 'Sin dato': return props.config?.statusSinDatoLabel || 'Sin dato'
      default: return raw || 'Sin dato'
    }
  }

  const statusCss = (value: string) => statusItems.find(s => s.value === value)?.css ?? '#9aa5b1'

  // Conexión con la escena del mapa: capas de avance, volumetría y huellas prediales
  React.useEffect(() => {
    if (!view) {
      setSections([])
      setStatusText(mapWidgetId && jimuMapView ? 'El mapa seleccionado no es una escena 3D.' : 'Abriendo escena 3D…')
      return
    }
    let cancelled = false
    const undo: Array<() => void> = []
    const footprintLayer = new GraphicsLayer({ title: 'Huellas prediales', listMode: 'hide', elevationInfo: { mode: 'on-the-ground' } })
    const host = document.createElement('div')
    host.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:10'
    view.container?.appendChild(host)
    setTipHost(host)
    undo.push(() => { host.remove(); setTipHost(null) })

    view.when().then(async () => {
      const map = view.map
      await Promise.all(sceneLayers(map).map(async l => await l.load().catch(() => null)))
      if (cancelled) return

      const layerConfigMap: { [code: string]: string } = {
        E15: props.config?.layerIdE15,
        I16: props.config?.layerIdI16,
        E16: props.config?.layerIdE16
      }

      const list: Section[] = (['E15', 'I16', 'E16'] as const).map(code => {
        const layer = findSectionLayer(map, layerConfigMap[code], SECTION_URLS[code], new RegExp(`\\b${code}\\b`, 'i'))
        return layer ? { code, layer } : null
      }).filter(Boolean)

      if (!list.length) {
        setStatusText('La escena no contiene las capas de avance E15, I16 o E16.')
        return
      }

      for (const { layer } of list) {
        const { renderer, popupEnabled, visible } = layer
        layer.set({ popupEnabled: false, visible: true })
        undo.push(() => { layer.set({ renderer, popupEnabled, visible }) })
      }
      map.add(footprintLayer)
      undo.push(() => { map.remove(footprintLayer); footprintLayer.destroy() })
      sectionsRef.current = list
      setSections(list)

      for (const section of list) {
        view.whenLayerView(section.layer).then(layerView => {
          section.layerView = layerView as __esri.SceneLayerView
          setLayerViewsReady(n => n + 1)
        }, error => {
          console.error(section.code, error)
          setStatusText(`Error al cargar ${section.code}: ${error.message}`)
        })
      }

      // Volumetría urbana sin las edificaciones que tocan las estaciones
      const volumetry = findSectionLayer(map, props.config?.layerIdVolumetry, VOLUMETRY_URL, /volumetr/i)
      volumetryRef.current = volumetry
      setVolumetryFound(!!volumetry)
      if (volumetry) {
        const { filter, visible } = volumetry
        setVolumetryOn(visible)
        undo.push(() => { volumetry.set({ filter, visible }) })
      }

      const footprints = await fetchFootprints(server)
      if (cancelled) return
      const stationRings: Array<Array<[number, number]>> = []
      for (const { code } of list) {
        for (const part of footprints.stations?.find((s: any) => s.station === code)?.parts ?? []) {
          stationRings.push(part.coordinates)
          footprintLayer.add(new Graphic({
            geometry: new Polygon({ rings: [part.coordinates], spatialReference: { wkid: 4326 } }),
            symbol: { type: 'simple-fill', color: [255, 159, 67, 0.2], outline: { color: [255, 209, 161], width: 1.2 } } as any
          }))
        }
      }

      if (!volumetry) return
      const packages = await Promise.all(list.map(async s => await packageFootprint(`${s.layer.url}/layers/${s.layer.layerId}`)))
      if (cancelled) return
      volumetry.filter = new SceneFilter({
        geometries: [...stationRings, ...packages.flat()].map(ring => new Polygon({ rings: [ring], spatialReference: { wkid: 4326 } })),
        spatialRelationship: 'disjoint'
      })
    }).catch(error => {
      console.error(error)
      setStatusText(`Error al leer la escena: ${error.message}`)
    })

    const handles = [
      view.on('click', event => { handlers.current.click(event) }),
      view.on('pointer-move', event => { handlers.current.move(event) }),
      view.on('pointer-leave', () => { setTip(null) })
    ]
    return () => {
      cancelled = true
      handles.forEach(h => { h.remove() })
      for (const h of highlights.current) h.remove()
      highlights.current = []
      for (const s of sectionsRef.current) if (s.layerView) s.layerView.filter = null
      undo.reverse().forEach(f => { f() })
      sectionsRef.current = []
      volumetryRef.current = null
    }
  }, [view, jimuMapView, mapWidgetId, server, props.config?.layerIdE15, props.config?.layerIdI16, props.config?.layerIdE16, props.config?.layerIdVolumetry])

  // Opacidad del terreno y navegación subterránea
  React.useEffect(() => {
    const ground = view?.map.ground
    if (!ground) return
    const { opacity, navigationConstraint } = ground
    ground.opacity = groundOpacity / 100
    if (groundOpacity < 100) ground.navigationConstraint = { type: 'none' } as any
    return () => { ground.opacity = opacity; ground.navigationConstraint = navigationConstraint }
  }, [view, groundOpacity])

  // Elementos con programación agrupados por sección
  const scheduledBySection = React.useMemo(() => {
    const map = new Map<string, Array<{ [field: string]: any }>>()
    for (const a of table?.attributes ?? []) {
      if (a.FechaInicioDate == null && a.FechaFinDate == null) continue
      if (!map.has(a.Seccion)) map.set(a.Seccion, [])
      map.get(a.Seccion).push(a)
    }
    return map
  }, [table])

  React.useEffect(() => {
    for (const s of sections) {
      s.layer.renderer = (colorMode === 'schedule' ? scheduleRenderer(scheduledBySection.get(s.code) ?? [], cutoff) : renderers[colorMode]) as any
    }
  }, [sections, colorMode, scheduledBySection, cutoff, renderers])

  // Herramienta de corte 3D (Slice)
  React.useEffect(() => {
    if (!slicing || !view) return
    const slice = new Slice({ view })
    view.ui.add(slice, 'top-right')
    return () => { view.ui.remove(slice); slice.destroy() }
  }, [slicing, view])

  // Giro orbital continuo alrededor del centro
  React.useEffect(() => {
    if (!spinning || !view) return
    let frame = 0
    let last = performance.now()
    const turn = (now: number) => {
      const heading = (view.camera.heading + SPIN_DEGREES_PER_SECOND * (now - last) / 1000) % 360
      last = now
      view.goTo({ target: view.center, heading, tilt: view.camera.tilt, scale: view.scale }, { animate: false }).catch(() => null)
      frame = requestAnimationFrame(turn)
    }
    frame = requestAnimationFrame(turn)
    const stop = view.on(['drag', 'mouse-wheel'] as any, () => { setSpinning(false) })
    return () => { cancelAnimationFrame(frame); stop.remove() }
  }, [spinning, view])

  function home () {
    const extents = sectionsRef.current.filter(s => s.layer.visible).map(s => s.layer.fullExtent).filter(Boolean)
    if (!view || !extents.length) return
    const union = extents.reduce((a, b) => a.clone().union(b))
    view.goTo({ target: union.expand(1.1), tilt: 55, heading: 15 }, { duration: 1200 }).catch(error => { console.warn('goTo', error) })
  }
  function goTo (section: Section) {
    view?.goTo({ target: section.layer.fullExtent, tilt: 60, heading: 20 }, { duration: 1200 }).catch(error => { console.warn('goTo', error) })
  }

  // Descarga de datos JSON -> Fuente de datos de salida
  React.useEffect(() => {
    let cancelled = false
    if (!server) {
      tableRef.current = null
      setTable(null)
      setStatusText('Configure el origen de datos (URL o Item ID) en los ajustes del widget.')
      return
    }

    setStatusText('Cargando datos de avance...')
    fetchElements(server, props.portalUrl).then((data: any) => {
      if (cancelled) return
      let attributes: Array<{ [field: string]: any }> = []
      let pointGraphics: Graphic[] = []

      if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
        // Formato GeoJSON estándar (RFC 7946)
        attributes = data.features.map((f: any, i: number) => {
          const record: { [field: string]: any } = { [ID_FIELD]: i + 1 }
          const props = f.properties || {}
          FIELD_NAMES.forEach(col => { if (props[col] !== undefined) record[col] = props[col] })
          return record
        })
        pointGraphics = data.features.map((f: any, i: number) => {
          const coords = f.geometry?.coordinates || [0, 0, 0]
          return new Graphic({
            attributes: attributes[i],
            geometry: new Point({ longitude: coords[0] ?? 0, latitude: coords[1] ?? 0, z: coords[2] ?? 0 })
          })
        })
      } else if (data && Array.isArray(data.columns) && Array.isArray(data.rows)) {
        // Formato tabular compacto { columns, rows }
        const { columns, rows } = data
        attributes = rows.map((row: any[], i: number) => {
          const record: { [field: string]: any } = { [ID_FIELD]: i + 1 }
          columns.forEach((column: string, c: number) => { if (FIELD_NAMES.includes(column)) record[column] = row[c] })
          return record
        })
        const lon = columns.indexOf('lon')
        const lat = columns.indexOf('lat')
        pointGraphics = attributes.map((a, i) => new Graphic({
          attributes: a,
          geometry: new Point({ longitude: rows[i][lon] ?? 0, latitude: rows[i][lat] ?? 0 })
        }))
      } else if (Array.isArray(data)) {
        // Formato array de objetos
        attributes = data.map((item: any, i: number) => {
          const record: { [field: string]: any } = { [ID_FIELD]: i + 1 }
          FIELD_NAMES.forEach(col => { if (item[col] !== undefined) record[col] = item[col] })
          return record
        })
        pointGraphics = attributes.map(a => new Graphic({
          attributes: a,
          geometry: new Point({ longitude: a.lon ?? 0, latitude: a.lat ?? 0 })
        }))
      } else {
        throw new Error('Estructura de datos no reconocida (se esperaba GeoJSON o columnas/filas).')
      }

      const recordIdByElement = new Map(attributes.map(a => [`${a.Seccion}:${a.OID}`, a[ID_FIELD]]))
      const matcher = new FeatureLayer({
        source: pointGraphics,
        objectIdField: ID_FIELD,
        geometryType: 'point',
        spatialReference: { wkid: 4326 },
        fields: FIELD_NAMES.map(name => ({
          name,
          type: name === ID_FIELD ? 'oid' : name.endsWith('Date') ? 'date' : ['OID', 'Avance', 'z'].includes(name) ? 'double' : 'string'
        })) as any
      })
      const loaded = { attributes, recordIdByElement, matcher }
      tableRef.current = loaded
      setTable(loaded)
      setStatusText(null)
    }).catch(error => {
      console.error(error)
      tableRef.current = null
      setTable(null)
      setStatusText(`No se pudo leer la fuente de datos: ${error.message}`)
    })
    return () => { cancelled = true }
  }, [server, props.portalUrl])

  React.useEffect(() => {
    if (!ds || !table) return
    ds.setSourceRecords(table.attributes.map(attributes => ds.buildRecord({ attributes } as any)))
    ds.setStatus(DataSourceStatus.Unloaded)
    ds.setCountStatus(DataSourceStatus.Unloaded)
    setQueryVersion(v => v + 1)
  }, [ds, table])

  // Filtros aplicados por otros widgets y timelapse
  React.useEffect(() => {
    if (!table) return
    let cancelled = false
    const experience = (ds?.getCurrentQueryParams() as any)?.where
    const where = [experience && experience !== '1=1' ? `(${experience as string})` : null, timelapse].filter(Boolean).join(' AND ')
    const apply = async () => {
      if (!where) {
        for (const s of sectionsRef.current) if (s.layerView) s.layerView.filter = null
        setVisibleCount(null)
        return
      }
      const ids = await table.matcher.queryObjectIds({ where })
      if (cancelled) return
      const bySection = new Map<string, number[]>()
      for (const id of ids) {
        const a = table.attributes[Number(id) - 1]
        if (!bySection.has(a.Seccion)) bySection.set(a.Seccion, [])
        bySection.get(a.Seccion).push(a.OID)
      }
      for (const s of sectionsRef.current) if (s.layerView) s.layerView.filter = { objectIds: bySection.get(s.code) ?? [-1] } as any
      setVisibleCount(ids.length)
    }
    apply().catch(error => { console.error('filtro', error); setStatusText(`Error en filtro: ${error.message}`) })
    return () => { cancelled = true }
  }, [ds, table, queryVersion, layerViewsReady, timelapse])

  // Selección (desde cualquier widget de la experiencia)
  React.useEffect(() => {
    for (const h of highlights.current) h.remove()
    highlights.current = []
    if (!table || !selection.length) return
    const bySection = new Map<string, number[]>()
    for (const id of selection.slice(0, HIGHLIGHT_LIMIT)) {
      const a = table.attributes[Number(id) - 1]
      if (!a) continue
      if (!bySection.has(a.Seccion)) bySection.set(a.Seccion, [])
      bySection.get(a.Seccion).push(a.OID)
    }
    for (const s of sectionsRef.current) {
      const oids = bySection.get(s.code)
      if (oids && s.layerView) highlights.current.push(s.layerView.highlight(oids))
    }
  }, [table, selection, layerViewsReady])

  const recordOf = (hit: __esri.GraphicHit) => {
    const section = hit && sectionsRef.current.find(s => s.layer === hit.graphic.layer)
    return section && tableRef.current?.recordIdByElement.get(`${section.code}:${hit.graphic.getObjectId()}`)
  }
  const hitTest = async (point: __esri.ScreenPoint) => {
    const { results } = await viewRef.current.hitTest(point, { include: sectionsRef.current.filter(s => s.layer.visible).map(s => s.layer) })
    return results.find(r => r.type === 'graphic') as __esri.GraphicHit
  }

  async function onSceneClick (event: __esri.ViewClickEvent) {
    if (!viewRef.current || !sectionsRef.current.length) return
    const hit = await hitTest(event)
    if (!hit) return
    const recordId = recordOf(hit)
    if (recordId == null) return
    if (dsRef.current) dsRef.current.selectRecordsByIds([recordId]); else setSelection([recordId])
  }

  const hover = React.useRef<{ busy: boolean, next: __esri.ViewPointerMoveEvent }>({ busy: false, next: null })
  async function onPointerMove (event: __esri.ViewPointerMoveEvent) {
    hover.current.next = event
    if (hover.current.busy || !sectionsRef.current.length) return
    hover.current.busy = true
    try {
      while (hover.current.next) {
        const current = hover.current.next
        hover.current.next = null
        if (!viewRef.current) return
        const recordId = recordOf(await hitTest(current))
        setTip(recordId ? { x: current.x, y: current.y, a: tableRef.current.attributes[recordId - 1] } : null)
      }
    } catch { setTip(null) } finally { hover.current.busy = false }
  }

  const handlers = React.useRef({ click: onSceneClick, move: onPointerMove })
  handlers.current = { click: onSceneClick, move: onPointerMove }

  const total = table?.attributes.length ?? 0
  React.useEffect(() => {
    if (!table || !sections.length) return
    const filtered = visibleCount == null ? '' : ` · ${number(visibleCount)} visibles`
    setStatusText(`${sections.length} secciones · ${number(total)} elementos${filtered}`)
  }, [table, sections.length, total, visibleCount])

  const selected = selection.length === 1 && table ? table.attributes[Number(selection[0]) - 1] : null
  const statusCounts = React.useMemo(() => {
    const counts: { [status: string]: number } = {}
    for (const a of table?.attributes ?? []) counts[a.EstadoAvance] = (counts[a.EstadoAvance] ?? 0) + 1
    return counts
  }, [table])

  return (
    <div
      css={style}
      className="jimu-widget widget-avance-obra-escena"
      style={{
        '--calcite-accent': cfgAccentColor,
        '--calcite-primary': cfgPrimaryColor,
        '--calcite-card-bg': cfgCardBackground
      } as React.CSSProperties}
    >
      {mapWidgetId && <JimuMapViewComponent useMapWidgetId={mapWidgetId} onActiveViewChange={(jmv: JimuMapView) => { setJimuMapView(jmv) }} />}
      {useDataSource && (
        <DataSourceComponent
          widgetId={props.id}
          useDataSource={useDataSource}
          onDataSourceCreated={created => { setDs(created as FeatureLayerDataSource) }}
          onQueryRequired={() => { setQueryVersion(v => v + 1) }}
          onDataSourceInfoChange={() => { setQueryVersion(v => v + 1) }}
          onSelectionChange={(ids: ImmutableArray<string | number>) => { setSelection(ids ? ids.asMutable() : []) }}
        />
      )}
      {tip && tipHost && ReactDOM.createPortal(
        <div css={tipStyle} style={{ left: tip.x + 14, top: tip.y + 14 }}>
          <b>{tip.a.Family || tip.a.Categoria || 'Elemento'}{tip.a.Nivel ? ` · ${tip.a.Nivel}` : ''}</b>
          <i className="swatch" style={{ background: statusCss(tip.a.EstadoAvance) }} />{getStatusDisplayName(tip.a.EstadoAvance)}{tip.a.Avance != null ? ` · ${number(tip.a.Avance)} %` : ''}<br />
          <i className="swatch" style={{ background: scheduleCss(scheduleClass(tip.a, cutoff)) }} />{scheduleClass(tip.a, cutoff)} al {isoDay(cutoff)}<br />
          {tip.a.Actividad && <React.Fragment><span>Actividad</span> {tip.a.Actividad}<br /></React.Fragment>}
          {(tip.a.FechaInicio || tip.a.FechaFin) && <React.Fragment><span>Programado</span> {tip.a.FechaInicio ?? '?'} → {tip.a.FechaFin ?? '?'}</React.Fragment>}
        </div>,
        tipHost
      )}

      {/* Escena 3D embebida (cuando opera sin widget de Mapa) */}
      {!mapWidgetId && <div className="scene" ref={sceneBox} />}

      {/* Botón para expandir panel en modo flotante */}
      {!mapWidgetId && collapsed && (
        <button type="button" className="collapse" onClick={() => { setCollapsed(false) }}>
          Avance 4D ▸
        </button>
      )}

      {(!collapsed || mapWidgetId) && (
        <div className="panel">
          <div className="panel-header">
            <h2>{cfgHeaderTitle}</h2>
            {!mapWidgetId && (
              <button
                type="button"
                className="btn-action-sm"
                onClick={() => { setCollapsed(true) }}
                title="Minimizar panel flotante"
              >
                ◂
              </button>
            )}
          </div>

          {sections.length > 0 ? (
            <React.Fragment>
              {/* SECCIÓN 1: SECCIONES */}
              <div className="calcite-card">
                <h3>{cfgSectionsTitle}</h3>
                {sections.map(s => (
                  <div key={s.code} className="section-row">
                    <label className="section-info">
                      <input
                        type="checkbox"
                        defaultChecked
                        onChange={e => { s.layer.visible = e.target.checked }}
                      />
                      <span title={sectionLabels[s.code] ?? s.code}>
                        {sectionLabels[s.code] ?? s.code}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="btn-action-sm"
                      onClick={e => { e.preventDefault(); goTo(s) }}
                      title="Enfocar en la escena"
                    >
                      Ir
                    </button>
                  </div>
                ))}
                {volumetryFound && (
                  <div className="section-row" style={{ paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <label className="section-info">
                      <input
                        type="checkbox"
                        checked={volumetryOn}
                        onChange={e => {
                          setVolumetryOn(e.target.checked)
                          if (volumetryRef.current) volumetryRef.current.visible = e.target.checked
                        }}
                      />
                      <span>{props.config?.volumetryLabel || 'Volumetría (sin estaciones)'}</span>
                    </label>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: MODO DE COLOR */}
              <div className="calcite-card">
                <h3>{cfgColorModeTitle}</h3>
                <div className="color-mode-pills">
                  <label className="color-mode-option">
                    <input
                      type="radio"
                      name={`${props.id}-color`}
                      checked={colorMode === 'status'}
                      onChange={() => { setColorMode('status') }}
                    />
                    <span>{props.config?.modeStatusLabel || 'Estado de avance'}</span>
                  </label>
                  <label className="color-mode-option">
                    <input
                      type="radio"
                      name={`${props.id}-color`}
                      checked={colorMode === 'schedule'}
                      onChange={() => { setColorMode('schedule') }}
                    />
                    <span>{props.config?.modeScheduleLabel || 'Cronograma (4D)'}</span>
                  </label>
                  <label className="color-mode-option">
                    <input
                      type="radio"
                      name={`${props.id}-color`}
                      checked={colorMode === 'source'}
                      onChange={() => { setColorMode('source') }}
                    />
                    <span>{props.config?.modeSourceLabel || 'Colores del modelo'}</span>
                  </label>
                </div>

                {colorMode === 'status' && (
                  <div className="legend-box">
                    {statusItems.map(s => (
                      <div key={s.value} className="legend-item">
                        <div className="legend-swatch-group">
                          <i className="swatch" style={{ background: s.css }} />
                          <span>{getStatusDisplayName(s.value)}</span>
                        </div>
                        <span className="legend-count">{number(statusCounts[s.value] ?? 0)}</span>
                      </div>
                    ))}
                    {!table && (
                      <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#f87171' }}>
                        ⚠️ Ingrese el origen de datos en los ajustes para ver las cantidades y colorear el avance.
                      </p>
                    )}
                  </div>
                )}

                {colorMode === 'schedule' && table && (
                  <SchedulePanel
                    elements={table.attributes}
                    cutoff={cutoff}
                    onCutoffChange={setCutoff}
                    buildUp={buildUp}
                    onBuildUpChange={setBuildUp}
                    hideUnscheduled={hideUnscheduled}
                    onHideUnscheduledChange={setHideUnscheduled}
                    accentColor={cfgAccentColor}
                    primaryColor={cfgPrimaryColor}
                    colorCurvaProgramada={cfgColorCurva}
                    colorFechaCorte={cfgColorCorte}
                    colorRealHoy={cfgColorReal}
                  />
                )}
                {colorMode === 'schedule' && !table && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#f87171' }}>⚠️ Sin datos de cronograma 4D</p>
                    <p style={{ margin: '6px 0 0', fontSize: '0.8rem', lineHeight: '1.4' }}>
                      Configure la URL o el Item ID del JSON de avance en los ajustes del widget para activar la simulación 4D.
                    </p>
                  </div>
                )}
              </div>

              {/* SECCIÓN 3: TERRENO */}
              <div className="calcite-card">
                <h3>
                  <span>{cfgTerrainTitle}</span>
                  <span style={{ color: cfgAccentColor, fontVariantNumeric: 'tabular-nums' }}>{groundOpacity}%</span>
                </h3>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={groundOpacity}
                  aria-label="Opacidad del terreno"
                  onChange={e => { setGroundOpacity(Number(e.target.value)) }}
                />
              </div>

              {/* SECCIÓN 4: ELEMENTO SELECCIONADO */}
              <div className="calcite-card">
                <h3>{cfgSelectedTitle}</h3>
                {selected ? (
                  <dl>
                    <dt>Estado</dt>
                    <dd>
                      <i className="swatch" style={{ background: statusCss(selected.EstadoAvance) }} />
                      <span>{getStatusDisplayName(selected.EstadoAvance)}</span>
                    </dd>
                    {KEY_FIELDS.filter(([field]) => selected[field] != null && selected[field] !== '').map(([field, label]) => (
                      <React.Fragment key={field}>
                        <dt>{label}</dt>
                        <dd>{String(selected[field])}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                ) : (
                  <p className="note">
                    {selection.length > 1
                      ? `${number(selection.length)} elementos seleccionados${selection.length > HIGHLIGHT_LIMIT ? ` (resaltados ${number(HIGHLIGHT_LIMIT)})` : ''}.`
                      : 'Haz clic en un elemento de la escena o elígelo en la tabla/gráfico.'}
                  </p>
                )}
              </div>

              {/* SECCIÓN 5: HERRAMIENTAS 3D */}
              <div className="calcite-card">
                <h3>{cfgToolsTitle}</h3>
                <div className="tools-row">
                  <button
                    type="button"
                    className="btn-tool"
                    onClick={() => { home() }}
                    title="Restablecer vista inicial"
                  >
                    Encuadrar
                  </button>
                  <button
                    type="button"
                    className="btn-tool"
                    aria-pressed={slicing}
                    onClick={() => { setSlicing(!slicing) }}
                    title="Plano de corte para inspeccionar el interior"
                  >
                    Cortar
                  </button>
                  <button
                    type="button"
                    className="btn-tool"
                    aria-pressed={spinning}
                    onClick={() => { setSpinning(!spinning) }}
                    title="Giro orbital continuo alrededor del centro"
                  >
                    Girar
                  </button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div className="calcite-card" style={{ padding: '16px', textAlign: 'center' }}>
              <p className="note" style={{ fontStyle: 'normal', color: '#94a3b8' }}>{statusText}</p>
            </div>
          )}

          {/* PIE DE ESTADO */}
          <div className="status-footer" role="status">
            <span className="status-dot" />
            <span>{statusText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
