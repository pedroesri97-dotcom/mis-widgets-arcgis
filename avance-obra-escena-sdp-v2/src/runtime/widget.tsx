/** @jsxRuntime classic */
/** @jsx jsx */
// Construction progress of E15, I16 and E16 on the web scene «Avance de obra - PLMB» of the SDP portal: the widget opens
// that scene in its own box, or, when a native Map widget is chosen in its settings, works on that map's scene instead. It finds the scene's progress layers and the
// volumetry, colours them by status or schedule (4D), hides the volumetry over the stations and fills an output data
// source with one record per element from /data/avance-elements.json. Native Chart, Table, Filter and List widgets use
// that data source; filters hide elements in the scene, selections are highlighted and a click selects the record.
// Everything it changes on the scene's layers is restored when the widget is removed or connected to another map.
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
import Polygon from 'esri/geometry/Polygon'
import Slice from 'esri/widgets/Slice'
import SceneFilter from 'esri/layers/support/SceneFilter'
import { CUTOFF_STATE_KEY, SCHEDULE, isoDay, scheduleClass, timelapseWhere, today } from './avance-schedule'
import { SchedulePanel } from './avance-schedule-panel'
import { packageFootprint } from './package-footprint'
import type { IMConfig } from '../config'
import { FIELD_NAMES, ID_FIELD } from '../output-schema'

// Scene services of the progress packages; a scene layer of the map is a section if it points to one of them or its
// title names the section. Same OBJECTID_1 as the packages, so avance-elements.json matches them.
const SECTION_URLS = {
  E15: 'https://tiles.arcgis.com/tiles/BQTQBNBsmxjF8vus/arcgis/rest/services/E15_Avance_3DObject/SceneServer/layers/0',
  I16: 'https://tiles.arcgis.com/tiles/BQTQBNBsmxjF8vus/arcgis/rest/services/I16_Avance_3DObject_/SceneServer/layers/0',
  E16: 'https://tiles.arcgis.com/tiles/BQTQBNBsmxjF8vus/arcgis/rest/services/E16_Avance_3DObject/SceneServer/layers/0'
}
// Scene opened when no Map widget is chosen.
const WEB_SCENE = { portalUrl: 'https://sinupotdes.sdp.gov.co/portalp', id: '839de5bdfa814f60b2a1baa743bc7f56' }
// Public building volumetry (facades) from the Esri Colombia portal, item 935c0605d691425ab55fd4e63c8c544d.
const VOLUMETRY_URL = 'https://arcgis.esri.co/server/rest/services/Hosted/Volumetria_2021__Octubre_2026_Fachada/SceneServer/layers/0'
const KEY_FIELDS: Array<[string, string]> = [
  ['Avance', 'Avance (%)'], ['Actividad', 'Actividad'], ['ActividadNombre', 'Nombre de actividad'], ['FechaInicio', 'Inicio'],
  ['FechaFin', 'Fin'], ['Contratista', 'Contratista'], ['UE', 'Unidad de ejecución'], ['Categoria', 'Categoría'], ['Family', 'Familia'],
  ['Type', 'Tipo'], ['Nivel', 'Nivel'], ['IfcGUID', 'IfcGUID'], ['ExtId', 'ID de Revit'], ['Seccion', 'Sección'], ['Modelo', 'Modelo Revit']
]
const HIGHLIGHT_LIMIT = 5000 // larger selections are counted but not highlighted, to keep the view responsive
const SPIN_DEGREES_PER_SECOND = 6

// Cache en memoria para requests de datos compartidos entre montajes
let cachedElementsPromise: Promise<{ columns: string[], rows: any[][] }> | null = null
let cachedFootprintsPromise: Promise<any> | null = null

function fetchElements (server: string) {
  if (!cachedElementsPromise) {
    cachedElementsPromise = fetch(`${server}/data/avance-elements.json`).then(async r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return await r.json()
    })
  }
  return cachedElementsPromise
}

function fetchFootprints (server: string) {
  if (!cachedFootprintsPromise) {
    cachedFootprintsPromise = fetch(`${server}/predial-station-footprints.json`).then(async r => {
      return r.ok ? await r.json() : { stations: [] }
    }).catch(() => ({ stations: [] }))
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
const findLayer = (map: __esri.Map, url: string, title: RegExp) => {
  const targetUrl = serviceUrl(url)
  return map.allLayers.find(l => l.type === 'scene' && (serviceUrl((l as any).url) === targetUrl || title.test(l.title ?? ''))) as __esri.SceneLayer
}

const meshFill = (color: number[] | null) => ({ type: 'mesh-3d', symbolLayers: [{ type: 'fill', material: color ? { color, colorMixMode: 'replace' } : undefined }] })

// Símbolos estáticos reutilizables para el renderer de cronograma 4D (evita instanciaciones repetitivas)
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
  attributes: Array<{ [field: string]: any }> // index = record id - 1
  recordIdByElement: Map<string, number> // `${Seccion}:${OID}` -> record id
  matcher: __esri.FeatureLayer // client-side copy that evaluates the data source's where clauses
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

  /* PANEL PRINCIPAL */
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

  /* PANEL FLOTANTE SOBRE ESCENA PROPIA */
  .scene + .panel {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 330px;
    height: auto;
    max-height: calc(100% - 24px);
    background: #111822 !important;
    border: 1px solid #1e293b;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    z-index: 5;
  }

  .collapse {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 6;
    background: var(--calcite-primary, #0284c7);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 3px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  }
  .collapse:hover {
    filter: brightness(1.1);
  }

  /* CABECERA CALCITE */
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 2px;
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

  .btn-collapse {
    width: 22px;
    height: 22px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    background: #151f2b;
    border: 1px solid #1e293b;
    color: #94a3b8;
    font-size: 10px;
    cursor: pointer;
  }
  .btn-collapse:hover {
    background: #1e293b;
    color: #ffffff;
  }

  /* TARJETAS CALCITE */
  .calcite-card {
    background: var(--calcite-card-bg, #151f2b);
    border: 1px solid #1e293b;
    border-radius: 3px;
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

  /* FILAS Y ELEMENTOS DE SECCIÓN */
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
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .btn-action-sm:hover {
    background: #243447;
    border-color: #3b4d63;
    color: #ffffff;
  }

  /* OPCIONES DE COLOR */
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
    font-size: 11px;
    color: #cbd5e1;
    cursor: pointer;
    user-select: none;
    padding: 2px 0;
  }
  .color-mode-option input[type=radio] {
    accent-color: var(--calcite-primary, #0284c7);
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  /* LEYENDA */
  .legend-box {
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 3px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2px;
  }
  .legend-item {
    font-size: 11px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .legend-swatch-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-count {
    font-size: 10px;
    font-weight: 600;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
  }

  .swatch {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  /* SLIDERS */
  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: #111822;
    outline: none;
    cursor: pointer;
    margin: 4px 0 2px;
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
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type=range]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid var(--calcite-primary, #0284c7);
    cursor: pointer;
  }

  /* ELEMENTO SELECCIONADO */
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 10px;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    font-size: 11px;
  }
  dl::-webkit-scrollbar {
    width: 3px;
  }
  dl::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 2px;
  }
  dt {
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  dd {
    font-size: 11px;
    color: #ffffff;
    margin: 0;
    word-break: break-word;
    display: flex;
    align-items: center;
  }

  .note {
    font-size: 10px;
    color: #64748b;
    margin: 2px 0;
    line-height: 1.4;
  }

  /* BARRA DE HERRAMIENTAS */
  .tools-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .btn-tool {
    flex: 1;
    min-width: 80px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 2px;
    border: 1px solid #243447;
    background: #1e293b;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: center;
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

  /* ESTADO INFERIOR */
  .status-footer {
    font-size: 10px;
    color: #64748b;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.3;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    flex-shrink: 0;
  }
`

const tipStyle = css`
  position: absolute;
  pointer-events: none;
  max-width: 280px;
  background: #151f2b;
  color: #ffffff;
  border: 1px solid #1e293b;
  border-radius: 3px;
  padding: 8px 10px;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 11px;
  line-height: 1.4;
  z-index: 999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  user-select: none;

  b {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--calcite-accent, #00b4d8);
    margin-bottom: 4px;
  }
  span {
    color: #94a3b8;
  }
  .swatch {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: -1px;
  }
`

export default function Widget (props: AllWidgetProps<IMConfig>) {
  const cfgHeaderTitle = props.config?.headerTitle || 'Avance de Obra'
  const cfgSectionsTitle = props.config?.sectionsTitle || 'Secciones de obra'
  const cfgColorModeTitle = props.config?.colorModeTitle || 'Modo de color'
  const cfgTerrainTitle = props.config?.terrainTitle || 'Transparencia del terreno'
  const cfgSelectedTitle = props.config?.selectedTitle || 'Elemento seleccionado'
  const cfgToolsTitle = props.config?.toolsTitle || 'Herramientas 3D'

  const cfgAccentColor = props.config?.accentColor || '#00b4d8'
  const cfgPrimaryColor = props.config?.primaryColor || '#0284c7'
  const cfgCardBackground = props.config?.cardBackground || '#151f2b'

  const cfgColorTerminado = props.config?.colorTerminado || '#44c58a'
  const cfgColorEnCurso = props.config?.colorEnCurso || '#f2c94c'
  const cfgColorNoIniciado = props.config?.colorNoIniciado || '#ef6464'
  const cfgColorSinDato = props.config?.colorSinDato || '#9aa5b1'

  const cfgColorCurva = props.config?.colorCurvaProgramada || '#00b4d8'
  const cfgColorCorte = props.config?.colorFechaCorte || '#fbbf24'
  const cfgColorReal = props.config?.colorRealHoy || '#34d399'

  const sectionLabels: { [code: string]: string } = React.useMemo(() => ({
    E15: props.config?.sectionLabelE15 || 'Estación 15 · Calle 63',
    I16: props.config?.sectionLabelI16 || 'Interestación 16 · viaducto',
    E16: props.config?.sectionLabelE16 || 'Estación 16 · Calle 72'
  }), [props.config?.sectionLabelE15, props.config?.sectionLabelI16, props.config?.sectionLabelE16])

  const getStatusDisplayName = React.useCallback((value: string) => {
    switch (value) {
      case 'Terminado': return props.config?.statusTerminadoLabel || 'Terminado'
      case 'En curso': return props.config?.statusEnCursoLabel || 'En curso'
      case 'No iniciado': return props.config?.statusNoIniciadoLabel || 'No iniciado'
      case 'Sin dato': return props.config?.statusSinDatoLabel || 'Sin dato'
      default: return value
    }
  }, [props.config?.statusTerminadoLabel, props.config?.statusEnCursoLabel, props.config?.statusNoIniciadoLabel, props.config?.statusSinDatoLabel])

  const statusItems = React.useMemo(() => [
    { value: 'Terminado', color: hexToRgb(cfgColorTerminado, [68, 197, 138]), css: cfgColorTerminado },
    { value: 'En curso', color: hexToRgb(cfgColorEnCurso, [242, 201, 76]), css: cfgColorEnCurso },
    { value: 'No iniciado', color: hexToRgb(cfgColorNoIniciado, [239, 100, 100]), css: cfgColorNoIniciado },
    { value: 'Sin dato', color: hexToRgb(cfgColorSinDato, [154, 165, 177]), css: cfgColorSinDato }
  ], [cfgColorTerminado, cfgColorEnCurso, cfgColorNoIniciado, cfgColorSinDato])

  const statusRenderer = React.useMemo(() => ({
    type: 'unique-value',
    field: 'EstadoAvance',
    uniqueValueInfos: statusItems.map(s => ({
      value: s.value,
      label: s.value,
      symbol: meshFill([...s.color, s.value === 'Sin dato' ? 0.55 : 1])
    })),
    defaultSymbol: meshFill([...hexToRgb(cfgColorSinDato, [154, 165, 177]), 0.55])
  }), [statusItems, cfgColorSinDato])

  const statusCss = React.useCallback((value: string) => {
    return statusItems.find(s => s.value === value)?.css ?? cfgColorSinDato
  }, [statusItems, cfgColorSinDato])

  const server = (props.config?.serverUrl ?? 'https://dureyes97.github.io/avance-plmb').replace(/\/$/, '')
  const mapWidgetId = props.useMapWidgetIds?.[0]
  const outputId = props.outputDataSources?.[0]
  const useDataSource = React.useMemo(() => outputId ? Immutable({ dataSourceId: outputId, mainDataSourceId: outputId }) : null, [outputId])

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)
  const sceneBox = React.useRef<HTMLDivElement>(null)
  const [ownView, setOwnView] = React.useState<__esri.SceneView>(null)
  React.useEffect(() => {
    if (mapWidgetId || !sceneBox.current) return
    const own = new SceneView({
      container: sceneBox.current,
      map: new WebScene({ portalItem: { id: WEB_SCENE.id, portal: { url: WEB_SCENE.portalUrl } } as any }),
      qualityProfile: 'medium',
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
  const [statusText, setStatusText] = React.useState('Conectando con el mapa…')
  const [visibleCount, setVisibleCount] = React.useState<number>(null)

  // ---------- The map widget's scene: progress layers, volumetry, footprints ----------
  React.useEffect(() => {
    if (!view) {
      setSections([])
      setStatusText(mapWidgetId && jimuMapView ? 'El mapa conectado no es una escena 3D: elige un widget Mapa con un web scene.' : 'Abriendo la escena…')
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

      // Optimización: buscar capas candidatas sin obligar a cargar todas las demás capas del mapa
      const list: Section[] = Object.keys(SECTION_URLS).map(code => {
        const layer = findLayer(map, SECTION_URLS[code], new RegExp(`\\b${code}\\b`, 'i'))
        return layer ? { code, layer } : null
      }).filter(Boolean)
      if (!list.length) { setStatusText('La escena del mapa no tiene las capas de avance E15, I16 ni E16.'); return }

      const volumetry = findLayer(map, VOLUMETRY_URL, /volumetr/i)
      volumetryRef.current = volumetry
      setVolumetryFound(!!volumetry)

      // Cargar únicamente las capas requeridas en paralelo
      const layersToLoad = [...list.map(s => s.layer), volumetry].filter(Boolean)
      await Promise.all(layersToLoad.map(l => l.load().catch(() => null)))
      if (cancelled) return

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
        }, error => { console.error(section.code, error); setStatusText(`No se pudo dibujar ${section.code}: ${error.message}`) })
      }

      if (volumetry) {
        const { filter, visible } = volumetry
        setVolumetryOn(visible)
        undo.push(() => { volumetry.set({ filter, visible }) })
      }

      // Descarga de huellas prediales con caché en memoria
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

      // Aplicar filtro de volumetría de inmediato con las huellas prediales directas
      if (volumetry && stationRings.length > 0) {
        volumetry.filter = new SceneFilter({
          geometries: stationRings.map(ring => new Polygon({ rings: [ring], spatialReference: { wkid: 4326 } })),
          spatialRelationship: 'disjoint'
        })

        // En segundo plano y sin bloquear la interfaz, afinar con las cajas de hojas (I3S leaf boxes) cacheadas
        Promise.all(list.map(s => packageFootprint(`${s.layer.url}/layers/${s.layer.layerId}`))).then(packages => {
          if (cancelled || !volumetryRef.current) return
          const extraRings = packages.flat()
          if (extraRings.length > 0) {
            volumetryRef.current.filter = new SceneFilter({
              geometries: [...stationRings, ...extraRings].map(ring => new Polygon({ rings: [ring], spatialReference: { wkid: 4326 } })),
              spatialRelationship: 'disjoint'
            })
          }
        }).catch(() => null)
      }
    }).catch(error => { console.error(error); setStatusText(`No se pudo leer la escena del mapa: ${error.message}`) })

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
  }, [view, jimuMapView, mapWidgetId, server])

  // Ground opacity
  React.useEffect(() => {
    const ground = view?.map.ground
    if (!ground) return
    const { opacity, navigationConstraint } = ground
    ground.opacity = groundOpacity / 100
    if (groundOpacity < 100) ground.navigationConstraint = { type: 'none' } as any
    return () => { ground.opacity = opacity; ground.navigationConstraint = navigationConstraint }
  }, [view, groundOpacity])

  // Scheduled elements per section
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
    if (!sections.length) return
    // Evita doble cómputo si el modo es cronograma pero la tabla aún no ha terminado de cargar
    if (colorMode === 'schedule' && !table) return
    for (const s of sections) {
      s.layer.renderer = (colorMode === 'schedule'
        ? scheduleRenderer(scheduledBySection.get(s.code) ?? [], cutoff)
        : colorMode === 'status'
          ? statusRenderer
          : { type: 'simple', symbol: meshFill(null) }) as any
    }
  }, [sections, colorMode, scheduledBySection, cutoff, statusRenderer, table])

  // Slice tool
  React.useEffect(() => {
    if (!slicing || !view) return
    const slice = new Slice({ view })
    view.ui.add(slice, 'top-right')
    return () => { view.ui.remove(slice); slice.destroy() }
  }, [slicing, view])

  // Orbit around the centre of the view
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

  // ---------- Element table -> output data source ----------
  React.useEffect(() => {
    let cancelled = false
    fetchElements(server).then(({ columns, rows }) => {
      if (cancelled) return
      const attributes = rows.map((row, i) => {
        const record: { [field: string]: any } = { [ID_FIELD]: i + 1 }
        columns.forEach((column, c) => { if (FIELD_NAMES.includes(column)) record[column] = row[c] })
        return record
      })
      const recordIdByElement = new Map(attributes.map(a => [`${a.Seccion}:${a.OID}`, a[ID_FIELD]]))

      // Optimización clave: Matcher ligero sin instanciar miles de geometrías Point innecesarias
      const matcher = new FeatureLayer({
        source: attributes.map(a => new Graphic({ attributes: a })),
        objectIdField: ID_FIELD,
        fields: FIELD_NAMES.map(name => ({
          name,
          type: name === ID_FIELD ? 'oid' : name.endsWith('Date') ? 'date' : ['OID', 'Avance', 'z'].includes(name) ? 'double' : 'string'
        })) as any
      })
      const loaded = { attributes, recordIdByElement, matcher }
      tableRef.current = loaded
      setTable(loaded)
    }).catch(error => { console.error(error); setStatusText(`No se pudo leer la tabla de elementos de ${server}: ${error.message}`) })
    return () => { cancelled = true }
  }, [server])

  const recordsPopulatedRef = React.useRef(false)
  React.useEffect(() => {
    if (!ds || !table || recordsPopulatedRef.current) return
    recordsPopulatedRef.current = true
    ds.setSourceRecords(table.attributes.map(attributes => ds.buildRecord({ attributes } as any)))
    ds.setStatus(DataSourceStatus.Unloaded)
    ds.setCountStatus(DataSourceStatus.Unloaded)
    setQueryVersion(v => v + 1)
  }, [ds, table])

  // ---------- Filters set by other widgets, plus this panel's timelapse -> scene ----------
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
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        const a = table.attributes[Number(id) - 1]
        if (!a) continue
        let list = bySection.get(a.Seccion)
        if (!list) {
          list = []
          bySection.set(a.Seccion, list)
        }
        list.push(a.OID)
      }
      for (const s of sectionsRef.current) if (s.layerView) s.layerView.filter = { objectIds: bySection.get(s.code) ?? [-1] } as any
      setVisibleCount(ids.length)
    }
    apply().catch(error => { console.error('filtro', error); setStatusText(`No se pudo aplicar el filtro: ${error.message}`) })
    return () => { cancelled = true }
  }, [ds, table, queryVersion, layerViewsReady, timelapse])

  // ---------- Selection -> highlight ----------
  React.useEffect(() => {
    for (const h of highlights.current) h.remove()
    highlights.current = []
    if (!table || !selection.length) return
    const bySection = new Map<string, number[]>()
    for (const id of selection.slice(0, HIGHLIGHT_LIMIT)) {
      const a = table.attributes[Number(id) - 1]
      if (!a) continue
      let list = bySection.get(a.Seccion)
      if (!list) {
        list = []
        bySection.set(a.Seccion, list)
      }
      list.push(a.OID)
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
    if (recordId == null) { setStatusText('El elemento no está en la tabla de avance: regenera avance-elements.json.'); return }
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

  // ---------- Panel ----------
  const total = table?.attributes.length ?? 0
  React.useEffect(() => {
    if (!table || !sections.length) return
    const filtered = visibleCount == null ? '' : ` · ${number(visibleCount)} visibles con el filtro`
    setStatusText(`${sections.length} secciones · ${number(total)} elementos${filtered}${outputId ? '' : ' · abre la configuración del widget para crear la fuente de datos'}`)
  }, [table, sections.length, total, visibleCount, outputId])

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

      {!mapWidgetId && <div className="scene" ref={sceneBox} />}
      {collapsed
        ? <button type="button" className="collapse" onClick={() => { setCollapsed(false) }}>{cfgHeaderTitle} ▸</button>
        : (
      <div className="panel">
        <div className="panel-header">
          <h2>
            {cfgHeaderTitle}
          </h2>
          {!mapWidgetId && (
            <button
              type="button"
              className="btn-collapse"
              onClick={() => { setCollapsed(true) }}
              title="Ocultar panel"
            >
              ◂
            </button>
          )}
        </div>

        {sections.length > 0 && (
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
                </div>
              )}

              {colorMode === 'schedule' && (
                <SchedulePanel
                  elements={table?.attributes ?? []}
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
