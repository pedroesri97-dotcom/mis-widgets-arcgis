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
import Point from 'esri/geometry/Point'
import Polygon from 'esri/geometry/Polygon'
import Slice from 'esri/widgets/Slice'
import SceneFilter from 'esri/layers/support/SceneFilter'
import { CUTOFF_STATE_KEY, SCHEDULE, isoDay, scheduleClass, timelapseWhere, today } from './avance-schedule'
import { SchedulePanel } from './avance-schedule-panel'
import { packageFootprint } from './package-footprint'
import type { IMConfig } from '../config'
import { FIELD_NAMES, ID_FIELD } from '../output-schema'

// Status rule of build_avance.py: no % -> Sin dato, >= 100 -> Terminado, <= 0 -> No iniciado, else En curso.
const STATUS = [
  { value: 'Terminado', color: [68, 197, 138], css: '#44c58a' },
  { value: 'En curso', color: [242, 201, 76], css: '#f2c94c' },
  { value: 'No iniciado', color: [239, 100, 100], css: '#ef6464' },
  { value: 'Sin dato', color: [154, 165, 177], css: '#9aa5b1' }
]
const SECTION_LABELS = { E15: 'Estación 15 · Calle 63', I16: 'Interestación 16 · viaducto', E16: 'Estación 16 · Calle 72' }
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

const serviceUrl = (url: string): string => url?.replace(/\/layers\/\d+\/?$/, '').replace(/\/$/, '').toLowerCase()
const sceneLayers = (map: __esri.Map) => map.allLayers.filter(l => l.type === 'scene').toArray() as __esri.SceneLayer[]
const findLayer = (map: __esri.Map, url: string, title: RegExp) => {
  const layers = sceneLayers(map)
  return layers.find(l => serviceUrl(l.url) === serviceUrl(url)) ?? layers.find(l => title.test(l.title ?? ''))
}

const meshFill = (color: number[] | null) => ({ type: 'mesh-3d', symbolLayers: [{ type: 'fill', material: color ? { color, colorMixMode: 'replace' } : undefined }] })
const RENDERERS = {
  status: {
    type: 'unique-value',
    field: 'EstadoAvance',
    uniqueValueInfos: STATUS.map(s => ({ value: s.value, label: s.value, symbol: meshFill([...s.color, s.value === 'Sin dato' ? 0.55 : 1]) })),
    defaultSymbol: meshFill([154, 165, 177, 0.55])
  },
  source: { type: 'simple', symbol: meshFill(null) }
}
// Schedule colours depend on the cut-off date, so each section gets a unique-value renderer on its object ids; only
// elements with activity dates are listed, the rest take the «Sin programación» default.
function scheduleRenderer (elements: Array<{ [field: string]: any }>, cutoff: number) {
  const byClass = new Map<string, number[]>()
  for (const a of elements) {
    const value = scheduleClass(a, cutoff)
    if (!byClass.has(value)) byClass.set(value, [])
    byClass.get(value).push(a.OID)
  }
  const symbols = new Map(SCHEDULE.map(s => [s.value, meshFill([...s.color, s.value === 'Sin programación' ? 0.35 : 1])]))
  return {
    type: 'unique-value',
    field: 'OBJECTID_1',
    uniqueValueInfos: [...byClass].flatMap(([value, oids]) => oids.map(oid => ({ value: oid, label: value, symbol: symbols.get(value) }))),
    defaultSymbol: symbols.get('Sin programación')
  }
}
const number = (value: number) => Number(value).toLocaleString('es-CO')
const statusCss = (value: string) => STATUS.find(s => s.value === value)?.css ?? '#9aa5b1'
const scheduleCss = (value: string) => SCHEDULE.find(s => s.value === value)?.css ?? '#9aa5b1'

interface Section { code: string, layer: __esri.SceneLayer, layerView?: __esri.SceneLayerView }
interface Table {
  attributes: Array<{ [field: string]: any }> // index = record id - 1
  recordIdByElement: Map<string, number> // `${Seccion}:${OID}` -> record id
  matcher: __esri.FeatureLayer // client-side copy that evaluates the data source's where clauses
}

const style = css`
  position: relative; height: 100%; overflow: hidden; font-size: 12px;
  .scene { position: absolute; inset: 0; background: #0b1117; }
  .panel {
    height: 100%; overflow: auto; padding: 10px 12px;
    background: var(--sys-color-surface-paper, #101820); color: var(--sys-color-surface-paper-text, #e6edf3);
  }
  .scene + .panel {
    position: absolute; top: 10px; left: 10px; width: 300px; height: auto; max-height: calc(100% - 20px);
    background: rgba(16, 24, 32, 0.92); color: #e6edf3; border-radius: 6px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }
  .collapse { position: absolute; top: 10px; left: 10px; }
  h2 { font-size: 13px; margin: 0 0 6px; }
  h3 { font-size: 12px; margin: 10px 0 4px; font-weight: 600; }
  label { display: flex; align-items: center; gap: 6px; margin: 2px 0; cursor: pointer; }
  label span { flex: 1; }
  input[type=range] { width: 100%; }
  button { font-size: 12px; padding: 2px 8px; border-radius: 4px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
  button[aria-pressed=true] { background: rgba(78, 168, 255, 0.25); }
  .note { opacity: 0.75; margin: 4px 0 0; line-height: 1.35; }
  .legend div { margin: 2px 0; }
  .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; margin: 4px 0 0; }
  dt { opacity: 0.75; } dd { margin: 0; word-break: break-word; }
  .tools { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
  .status { margin-top: 8px; opacity: 0.75; }
`
// The hover card is drawn over the map widget's view, outside this widget's box.
const tipStyle = css`
  position: absolute; pointer-events: none; max-width: 280px; background: rgba(16, 24, 32, 0.95); color: #e6edf3;
  border: 1px solid #344453; border-radius: 4px; padding: 6px 8px; font-size: 12px; line-height: 1.35; z-index: 10;
  b { display: block; margin-bottom: 2px; }
  span { color: #8fa3b5; }
  .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
`

export default function Widget (props: AllWidgetProps<IMConfig>) {
  const server = (props.config?.serverUrl ?? 'https://dureyes97.github.io/avance-plmb').replace(/\/$/, '')
  const mapWidgetId = props.useMapWidgetIds?.[0]
  const outputId = props.outputDataSources?.[0]
  const useDataSource = React.useMemo(() => outputId ? Immutable({ dataSourceId: outputId, mainDataSourceId: outputId }) : null, [outputId])

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)
  // Own scene when no Map widget is chosen.
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
  // Cut-off date in the app state, so other widgets of the experience can read or set it.
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
    const undo: Array<() => void> = [] // restores the scene as it was
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
      const list: Section[] = Object.keys(SECTION_URLS).map(code => {
        const layer = findLayer(map, SECTION_URLS[code], new RegExp(`\\b${code}\\b`, 'i'))
        return layer ? { code, layer } : null
      }).filter(Boolean)
      if (!list.length) { setStatusText('La escena del mapa no tiene las capas de avance E15, I16 ni E16.'); return }
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

      // Volumetry without the buildings that touch a station: predial footprints plus the packages' leaf boxes.
      const volumetry = findLayer(map, VOLUMETRY_URL, /volumetr/i)
      volumetryRef.current = volumetry
      setVolumetryFound(!!volumetry)
      if (volumetry) {
        const { filter, visible } = volumetry
        setVolumetryOn(visible)
        undo.push(() => { volumetry.set({ filter, visible }) })
      }
      const footprints = await fetch(`${server}/predial-station-footprints.json`).then(async r => r.ok ? await r.json() : { stations: [] }, () => ({ stations: [] }))
      if (cancelled) return
      const stationRings: Array<Array<[number, number]>> = []
      for (const { code } of list) {
        for (const part of footprints.stations?.find(s => s.station === code)?.parts ?? []) {
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

  // Ground opacity; a see-through surface is only useful if the camera may also go below it.
  React.useEffect(() => {
    const ground = view?.map.ground
    if (!ground) return
    const { opacity, navigationConstraint } = ground
    ground.opacity = groundOpacity / 100
    if (groundOpacity < 100) ground.navigationConstraint = { type: 'none' } as any
    return () => { ground.opacity = opacity; ground.navigationConstraint = navigationConstraint }
  }, [view, groundOpacity])

  // Scheduled elements per section, for the schedule renderer.
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
      s.layer.renderer = (colorMode === 'schedule' ? scheduleRenderer(scheduledBySection.get(s.code) ?? [], cutoff) : RENDERERS[colorMode]) as any
    }
  }, [sections, colorMode, scheduledBySection, cutoff])

  // Slice tool in the view's top-right corner while «Cortar» is on.
  React.useEffect(() => {
    if (!slicing || !view) return
    const slice = new Slice({ view })
    view.ui.add(slice, 'top-right')
    return () => { view.ui.remove(slice); slice.destroy() }
  }, [slicing, view])

  // Orbit around the centre of the view; any drag or zoom by the user stops it.
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
    fetch(`${server}/data/avance-elements.json`).then(async r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return await r.json()
    }).then(({ columns, rows }: { columns: string[], rows: any[][] }) => {
      if (cancelled) return
      const attributes = rows.map((row, i) => {
        const record: { [field: string]: any } = { [ID_FIELD]: i + 1 }
        columns.forEach((column, c) => { if (FIELD_NAMES.includes(column)) record[column] = row[c] })
        return record
      })
      const recordIdByElement = new Map(attributes.map(a => [`${a.Seccion}:${a.OID}`, a[ID_FIELD]]))
      const lon = columns.indexOf('lon'); const lat = columns.indexOf('lat')
      const matcher = new FeatureLayer({
        source: attributes.map((a, i) => new Graphic({ attributes: a, geometry: new Point({ longitude: rows[i][lon] ?? 0, latitude: rows[i][lat] ?? 0 }) })),
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
    }).catch(error => { console.error(error); setStatusText(`No se pudo leer la tabla de elementos de ${server}: ${error.message}`) })
    return () => { cancelled = true }
  }, [server])

  React.useEffect(() => {
    if (!ds || !table) return
    // Same mechanism as the Chart widget's output: records kept in the data source instance.
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
      for (const id of ids) {
        const a = table.attributes[Number(id) - 1]
        if (!bySection.has(a.Seccion)) bySection.set(a.Seccion, [])
        bySection.get(a.Seccion).push(a.OID)
      }
      // Filtered-out elements are neither drawn nor returned by hitTest.
      for (const s of sectionsRef.current) if (s.layerView) s.layerView.filter = { objectIds: bySection.get(s.code) ?? [-1] } as any
      setVisibleCount(ids.length)
    }
    apply().catch(error => { console.error('filtro', error); setStatusText(`No se pudo aplicar el filtro: ${error.message}`) })
    return () => { cancelled = true }
  }, [ds, table, queryVersion, layerViewsReady, timelapse])

  // ---------- Selection (from any widget) -> highlight ----------
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

  // A click selects the element's record, so Table, List and Chart follow the scene.
  async function onSceneClick (event: __esri.ViewClickEvent) {
    if (!viewRef.current || !sectionsRef.current.length) return
    const hit = await hitTest(event)
    if (!hit) return
    const recordId = recordOf(hit)
    if (recordId == null) { setStatusText('El elemento no está en la tabla de avance: regenera avance-elements.json.'); return }
    if (dsRef.current) dsRef.current.selectRecordsByIds([recordId]); else setSelection([recordId])
  }

  // Hover card: one hitTest at a time, the latest pointer position wins.
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

  // The view's listeners are set once per view; they call the latest handlers.
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
    <div css={style} className="jimu-widget widget-avance-obra-escena">
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
          <i className="swatch" style={{ background: statusCss(tip.a.EstadoAvance) }} />{tip.a.EstadoAvance}{tip.a.Avance != null ? ` · ${number(tip.a.Avance)} %` : ''}<br />
          <i className="swatch" style={{ background: scheduleCss(scheduleClass(tip.a, cutoff)) }} />{scheduleClass(tip.a, cutoff)} al {isoDay(cutoff)}<br />
          {tip.a.Actividad && <React.Fragment><span>Actividad</span> {tip.a.Actividad}<br /></React.Fragment>}
          {(tip.a.FechaInicio || tip.a.FechaFin) && <React.Fragment><span>Programado</span> {tip.a.FechaInicio ?? '?'} → {tip.a.FechaFin ?? '?'}</React.Fragment>}
        </div>,
        tipHost
      )}

      {!mapWidgetId && <div className="scene" ref={sceneBox} />}
      {collapsed
        ? <button type="button" className="collapse" onClick={() => { setCollapsed(false) }}>Avance ▸</button>
        : (
      <div className="panel">
      <h2>
        Avance de obra · E15 · I16 · E16
        {!mapWidgetId && <button type="button" style={{ float: 'right' }} onClick={() => { setCollapsed(true) }} title="Ocultar panel">◂</button>}
      </h2>
      {sections.length > 0 && (
        <React.Fragment>
          <h3>Secciones</h3>
          {sections.map(s => (
            <label key={s.code}>
              <input type="checkbox" defaultChecked onChange={e => { s.layer.visible = e.target.checked }} />
              <span>{SECTION_LABELS[s.code] ?? s.code}</span>
              <button type="button" onClick={e => { e.preventDefault(); goTo(s) }}>Ir</button>
            </label>
          ))}
          {volumetryFound && (
            <label>
              <input type="checkbox" checked={volumetryOn} onChange={e => { setVolumetryOn(e.target.checked); if (volumetryRef.current) volumetryRef.current.visible = e.target.checked }} />
              <span>Volumetría (sin las estaciones)</span>
            </label>
          )}
          <h3>Color</h3>
          <label><input type="radio" name={`${props.id}-color`} checked={colorMode === 'status'} onChange={() => { setColorMode('status') }} /><span>Estado de avance</span></label>
          <label><input type="radio" name={`${props.id}-color`} checked={colorMode === 'schedule'} onChange={() => { setColorMode('schedule') }} /><span>Cronograma (4D)</span></label>
          <label><input type="radio" name={`${props.id}-color`} checked={colorMode === 'source'} onChange={() => { setColorMode('source') }} /><span>Colores del modelo</span></label>
          {colorMode === 'status' && (
            <div className="legend">
              {STATUS.map(s => <div key={s.value}><i className="swatch" style={{ background: s.css }} />{s.value} · {number(statusCounts[s.value] ?? 0)}</div>)}
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
            />
          )}
          <h3>Terreno · {groundOpacity} %</h3>
          <input type="range" min={0} max={100} step={5} value={groundOpacity} aria-label="Opacidad del terreno" onChange={e => { setGroundOpacity(Number(e.target.value)) }} />
          <h3>Elemento seleccionado</h3>
          {selected
            ? (
              <dl>
                <dt>Estado</dt><dd><i className="swatch" style={{ background: statusCss(selected.EstadoAvance) }} />{selected.EstadoAvance}</dd>
                {KEY_FIELDS.filter(([field]) => selected[field] != null && selected[field] !== '').map(([field, label]) => (
                  <React.Fragment key={field}><dt>{label}</dt><dd>{String(selected[field])}</dd></React.Fragment>
                ))}
              </dl>
              )
            : <p className="note">{selection.length > 1 ? `${number(selection.length)} elementos seleccionados${selection.length > HIGHLIGHT_LIMIT ? ` (se resaltan ${number(HIGHLIGHT_LIMIT)})` : ''}.` : 'Haz clic en un elemento de la escena o selecciónalo en una tabla, lista o gráfico.'}</p>}
          <div className="tools">
            <button type="button" onClick={() => { home() }}>Encuadrar todo</button>
            <button type="button" aria-pressed={slicing} onClick={() => { setSlicing(!slicing) }} title="Plano de corte para ver el interior">Cortar</button>
            <button type="button" aria-pressed={spinning} onClick={() => { setSpinning(!spinning) }} title="Gira alrededor del centro de la vista; arrastrar lo detiene">Girar</button>
          </div>
        </React.Fragment>
      )}
      <p className="status" role="status">{statusText}</p>
      </div>
          )}
    </div>
  )
}
