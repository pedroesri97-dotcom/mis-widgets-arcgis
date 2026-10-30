/**
 * ============================================================================
 * WIDGET RUNTIME: CAPAS TEMÁTICAS BOGOTÁ (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Componente principal de ejecución para la exploración territorial y control
 * unificado de capas geográficas temáticas en ArcGIS Experience Builder.
 * 
 * FUNCIONALIDADES CLAVE:
 * 1. Sincronización Dual 2D y 3D: Conecta y controla simultáneamente vistas de
 *    Web Map (MapView) y Web Scene (SceneView) apuntando a las capas de servicios GIS.
 * 2. Capa Fachadas v2: Primera capa con control interactivo de transparencia (0-100%).
 * 3. Aislamiento de Fachadas: Control estricto e independiente sin mezclar con Volumetría.
 * 4. Subgrupos organizados: Gestión granular de Telecomunicaciones, Acueducto,
 *    Equipamientos, Arbolado y Parques, y Estaciones de Metro.
 * 5. Rendimiento de alta velocidad:
 *    - Caché inteligente de candidatos de capas (`candidatesCacheRef`).
 *    - Reloj en tiempo real memoizado (`LiveClock`) para evitar re-renderizados de capas.
 *    - Escaneo dinámico adaptativo de vistas (`scanAllViews`).
 * 6. Protocolos de Seguridad:
 *    - No expone URLs ni tokens; opera dentro del contexto seguro de ArcGIS API for JavaScript.
 *    - Respeta estrictamente permisos, roles y políticas del Portal / ArcGIS Enterprise.
 */

import { React, type AllWidgetProps, getAppStore } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView, MapViewManager } from 'jimu-arcgis'
import type { IMConfig, LayerCategoryConfig, LayerItemConfig } from '../config'
import { styleText } from './style'

const { useState, useEffect, useMemo, useCallback, useRef } = React

// Normalizador tolerante a tildes, mayúsculas y espacios
const normalizeStr = (str: any): string => {
  if (!str && str !== 0) return ''
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

// Normalizador tolerante específico para escenas 3D (remueve sufijos 3D/2D, "edificaciones", "mesh" y prefijos numéricos)
const normalize3DStr = (str: any): string => {
  if (!str && str !== 0) return ''
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(3d|2d|mesh|scene|escena|capa|layer|edificaciones|modelo|poligono)\b/gi, '')
    .replace(/^\d+[\s.-]+/, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

// Filtro estricto para ignorar capas de mapa base de ArcGIS
const isBasemap = (layer: any, map: any): boolean => {
  if (!layer || !map) return false
  if (layer.isBasemap) return true
  if (map.basemap) {
    try {
      const baseList = map.basemap.baseLayers?.toArray ? map.basemap.baseLayers.toArray() : (Array.isArray(map.basemap.baseLayers) ? map.basemap.baseLayers : [])
      const refList = map.basemap.referenceLayers?.toArray ? map.basemap.referenceLayers.toArray() : (Array.isArray(map.basemap.referenceLayers) ? map.basemap.referenceLayers : [])
      if (baseList.some((bl: any) => bl === layer || (bl && bl.id === layer.id))) return true
      if (refList.some((rl: any) => rl === layer || (rl && rl.id === layer.id))) return true
    } catch (e) {}
  }
  const idLower = String(layer.id ?? '').toLowerCase()
  const titleLower = String(layer.title ?? '').toLowerCase()
  if (idLower.includes('basemap') || idLower.includes('defaultbasemap')) return true
  if (titleLower.includes('mapa base') || titleLower === 'basemap') return true
  return false
}

// Extractor robusto de color de simbología nativa de ArcGIS
const extractSymbologyColor = (layer: any): string | null => {
  try {
    if (!layer) return null
    const renderer = layer.renderer

    const getColorFromSymbol = (sym: any): string | null => {
      if (!sym) return null
      if (sym.color) {
        const c = sym.color
        const alpha = typeof c.a === 'number' ? c.a : (c.alpha !== undefined ? c.alpha : 1)
        if (alpha > 0.05) {
          if (typeof c.toHex === 'function') return c.toHex()
          if (typeof c.toCss === 'function') return c.toCss(true)
          if (c.r !== undefined && c.g !== undefined && c.b !== undefined) {
            return `rgb(${c.r}, ${c.g}, ${c.b})`
          }
        }
      }
      if (sym.outline?.color) {
        const oc = sym.outline.color
        const oAlpha = typeof oc.a === 'number' ? oc.a : (oc.alpha !== undefined ? oc.alpha : 1)
        if (oAlpha > 0.05) {
          if (typeof oc.toHex === 'function') return oc.toHex()
          if (typeof oc.toCss === 'function') return oc.toCss(true)
          if (oc.r !== undefined && oc.g !== undefined && oc.b !== undefined) {
            return `rgb(${oc.r}, ${oc.g}, ${oc.b})`
          }
        }
      }
      return null
    }

    if (renderer) {
      if (renderer.symbol) {
        const c = getColorFromSymbol(renderer.symbol)
        if (c) return c
      }
      if (renderer.uniqueValueInfos && renderer.uniqueValueInfos.length > 0) {
        for (const info of renderer.uniqueValueInfos) {
          const c = getColorFromSymbol(info.symbol)
          if (c) return c
        }
      }
      if (renderer.classBreakInfos && renderer.classBreakInfos.length > 0) {
        for (const info of renderer.classBreakInfos) {
          const c = getColorFromSymbol(info.symbol)
          if (c) return c
        }
      }
    }
  } catch (e) {}
  return null
}

// Colores por defecto para preservar la estética de cada capa
const getDefaultColor = (layer: LayerItemConfig, catId?: string): string => {
  if (layer.color) return layer.color
  const g = String(layer.group || '').toLowerCase()
  const t = String(layer.title || '').toLowerCase()
  const c = String(catId || '').toLowerCase()

  if (g.includes('suelo')) {
    if (t.includes('manzana')) return '#f97316'
    return '#22c55e'
  }
  if (g.includes('proyect')) {
    return t.includes('lote') ? '#f43f5e' : '#d946ef'
  }
  if (g.includes('movil')) {
    if (t.includes('troncal')) return '#06b6d4'
    if (t.includes('psitp') || t.includes('sitp')) return '#34d399'
    return '#10b981'
  }

  if (t.includes('limitacion')) return '#f59e0b'
  if (t.includes('sisben') && t.includes('promedio')) return '#fbbf24'
  if (t.includes('sisben')) return '#f97316'
  if (t.includes('hogar')) return '#00e5ff'
  if (t.includes('cuarto')) return '#f43f5e'
  if (t.includes('fachada') || t.includes('volumetria') || t.includes('piloto') || t.includes('ortofoto')) return '#00e5ff'
  if (t.includes('potencial') || t.includes('pot')) return '#eab308'
  if (t.includes('ruido')) return '#06b6d4'
  if (t.includes('aire')) return '#38bdf8'
  if (t.includes('cambio')) return '#3b82f6'
  if (t.includes('economica')) return '#a855f7'

  if (c.includes('base')) return '#00e5ff'
  if (c.includes('social')) return '#f59e0b'
  if (c.includes('econom')) return '#22c55e'
  if (c.includes('urban')) return '#06b6d4'
  if (c.includes('ambien')) return '#38bdf8'

  return '#00e5ff'
}

// Obtener el color efectivo del punto
const getEffectiveDotColor = (layer: LayerItemConfig, symbologyMap: { [id: string]: string }, catId?: string): string => {
  const mapColor = symbologyMap[layer.id]
  if (mapColor && mapColor !== '#000000' && mapColor !== 'transparent' && !mapColor.includes(',0)')) {
    return mapColor
  }
  if (layer.color) {
    return layer.color
  }
  return getDefaultColor(layer, catId)
}

// Estructura canónica garantizada para 2D y 3D
const DEFAULT_CATEGORIES: LayerCategoryConfig[] = [
  {
    id: 'cat-base',
    code: 'base',
    title: 'INFORMACIÓN BASE',
    badge: '17 CAPAS',
    expandedByDefault: false,
    layers: [
      { id: 'base-fachadas-v2', title: 'Fachadas v2', mapLayerTitle: 'Fachadas v2', sceneLayerTitle: 'Fachadas v2', color: '#00e5ff', visibleByDefault: false },
      { id: 'base-zona-piloto', title: 'Zona piloto', mapLayerTitle: 'Zona piloto', sceneLayerTitle: 'Zona piloto', color: '#00e5ff', visibleByDefault: false },
      { id: 'base-volumetria', title: 'Fachadas', mapLayerTitle: 'Fachadas', sceneLayerTitle: 'Fachadas', color: '#00e5ff', visibleByDefault: false },
      { id: 'base-ortofoto', title: 'Ortofotomosaico urbano de Bogotá D.C. Año 2025', mapLayerTitle: 'Ortofotomosaico urbano de Bogotá D.C. Año 2025', sceneLayerTitle: 'Ortofotomosaico urbano de Bogotá D.C. Año 2025', color: '#00e5ff', visibleByDefault: false },
      { id: 'base-canalizacion', title: 'Canalizacion', mapLayerTitle: 'Canalizacion', sceneLayerTitle: 'Canalizacion', group: 'Telecomunicaciones', color: '#00e5ff', visibleByDefault: false },
      { id: 'base-poste-telecom', title: 'Poste telecomunicaciones', mapLayerTitle: 'Poste telecomunicaciones', sceneLayerTitle: 'Poste telecomunicaciones', group: 'Telecomunicaciones', color: '#06b6d4', visibleByDefault: false },
      { id: 'base-armario-tel', title: 'Armario Telefonico', mapLayerTitle: 'Armario Telefonico', sceneLayerTitle: 'Armario Telefonico', group: 'Telecomunicaciones', color: '#38bdf8', visibleByDefault: false },
      { id: 'base-sumidero-comb', title: 'Sumidero Sanitario Combinado', mapLayerTitle: 'Sumidero Sanitario Combinado', sceneLayerTitle: 'Sumidero Sanitario Combinado', group: 'Acueducto', color: '#00e5ff', visibleByDefault: false },
      { id: 'base-red-troncal', title: 'Red troncal sanitario combinado', mapLayerTitle: 'Red troncal sanitario combinado', sceneLayerTitle: 'Red troncal sanitario combinado', group: 'Acueducto', color: '#06b6d4', visibleByDefault: false },
      { id: 'base-red-local', title: 'Red Local Sanitario Combinado', mapLayerTitle: 'Red Local Sanitario Combinado', sceneLayerTitle: 'Red Local Sanitario Combinado', group: 'Acueducto', color: '#38bdf8', visibleByDefault: false },
      { id: 'base-hidrante', title: 'Hidrante', mapLayerTitle: 'Hidrante', sceneLayerTitle: 'Hidrante', group: 'Acueducto', color: '#0ea5e9', visibleByDefault: false },
      { id: 'base-equip-salud', title: 'Equipamiento Salud', mapLayerTitle: 'Equipamiento Salud', sceneLayerTitle: 'Equipamiento Salud', group: 'Equipamientos', color: '#ef4444', visibleByDefault: false },
      { id: 'base-equip-educativo', title: 'Equipamiento Educativo', mapLayerTitle: 'Equipamiento Educativo', sceneLayerTitle: 'Equipamiento Educativo', group: 'Equipamientos', color: '#3b82f6', visibleByDefault: false },
      { id: 'base-equip-cultura', title: 'Equipamiento Cultura', mapLayerTitle: 'Equipamiento Cultura', sceneLayerTitle: 'Equipamiento Cultura', group: 'Equipamientos', color: '#a855f7', visibleByDefault: false },
      { id: 'base-equip-bienestar', title: 'Equipamiento Bienestar Social', mapLayerTitle: 'Equipamiento Bienestar Social', sceneLayerTitle: 'Equipamiento Bienestar Social', group: 'Equipamientos', color: '#f59e0b', visibleByDefault: false },
      { id: 'base-parque', title: 'Parque', mapLayerTitle: 'Parque', sceneLayerTitle: 'Parque', group: 'Arbolado y parques', color: '#10b981', visibleByDefault: false },
      { id: 'base-arbolado-urbano', title: 'Arbolado urbano', mapLayerTitle: 'Arbolado urbano', sceneLayerTitle: 'Arbolado urbano', group: 'Arbolado y parques', color: '#22c55e', visibleByDefault: false }
    ]
  },
  {
    id: 'cat-estaciones-metro',
    code: 'estaciones-metro',
    title: 'ESTACIONES DE METRO',
    badge: '11 CAPAS',
    expandedByDefault: false,
    layers: [
      { id: 'metro-inter-1100', title: 'L1T1 1100 216 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1100 216 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1100 216 CON ED EST MO 0001', group: 'Intersección', color: '#10b981', visibleByDefault: false },
      { id: 'metro-inter-1150', title: 'L1T1 1150 216 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1150 216 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1150 216 CON ED EST MO 0001', group: 'Intersección', color: '#059669', visibleByDefault: false },
      { id: 'metro-e16-1310', title: 'L1T1 1310 416 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1310 416 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1310 416 CON ED EST MO 0001', group: 'Estación 16', color: '#06b6d4', visibleByDefault: false },
      { id: 'metro-e16-1300-2', title: 'L1T1 1300 416 CON ED EST MO 0002', mapLayerTitle: 'L1T1 1300 416 CON ED EST MO 0002', sceneLayerTitle: 'L1T1 1300 416 CON ED EST MO 0002', group: 'Estación 16', color: '#0891b2', visibleByDefault: false },
      { id: 'metro-e16-1300-1', title: 'L1T1 1300 416 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1300 416 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1300 416 CON ED EST MO 0001', group: 'Estación 16', color: '#0e7490', visibleByDefault: false },
      { id: 'metro-e16-1150', title: 'L1T1 1150 316 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1150 316 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1150 316 CON ED EST MO 0001', group: 'Estación 16', color: '#0284c7', visibleByDefault: false },
      { id: 'metro-e16-1100', title: 'L1T1 1100 316 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1100 316 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1100 316 CON ED EST MO 0001', group: 'Estación 16', color: '#0369a1', visibleByDefault: false },
      { id: 'metro-e16-0000', title: 'L1T1 0000 316 CON ED ARQ MO 0001 V00', mapLayerTitle: 'L1T1 0000 316 CON ED ARQ MO 0001 V00', sceneLayerTitle: 'L1T1 0000 316 CON ED ARQ MO 0001 V00', group: 'Estación 16', color: '#38bdf8', visibleByDefault: false },
      { id: 'metro-e15-1150', title: 'L1T1 1150 315 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1150 315 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1150 315 CON ED EST MO 0001', group: 'Estación 15', color: '#6366f1', visibleByDefault: false },
      { id: 'metro-e15-1100', title: 'L1T1 1100 315 CON ED EST MO 0001', mapLayerTitle: 'L1T1 1100 315 CON ED EST MO 0001', sceneLayerTitle: 'L1T1 1100 315 CON ED EST MO 0001', group: 'Estación 15', color: '#4f46e5', visibleByDefault: false },
      { id: 'metro-e15-0000', title: 'L1T1 0000 315 CON ED ARQ MO 0001 V00', mapLayerTitle: 'L1T1 0000 315 CON ED ARQ MO 0001 V00', sceneLayerTitle: 'L1T1 0000 315 CON ED ARQ MO 0001 V00', group: 'Estación 15', color: '#818cf8', visibleByDefault: false }
    ]
  },
  {
    id: 'cat-social',
    code: 'social',
    title: 'SOCIAL',
    badge: '5 CAPAS',
    expandedByDefault: false,
    layers: [
      { id: 'soc-limitaciones', title: 'Limitaciones permanentes manzana', mapLayerTitle: 'Limitaciones permantenes manzana', sceneLayerTitle: 'Limitaciones permantenes manzana', color: '#f59e0b', visibleByDefault: false },
      { id: 'soc-sisben-mzn', title: 'Manzana sisbén promedio', mapLayerTitle: 'Manzana sisbén promedio', sceneLayerTitle: 'Manzana sisbén promedio', color: '#fbbf24', visibleByDefault: false },
      { id: 'soc-personas-hogar', title: 'Personas por hogar', mapLayerTitle: 'Personas por hogar', sceneLayerTitle: 'Personas por hogar', color: '#00e5ff', visibleByDefault: false },
      { id: 'soc-cuartos', title: 'Número de cuartos', mapLayerTitle: 'Número de cuartos', sceneLayerTitle: 'Número de cuartos', color: '#f43f5e', visibleByDefault: false },
      { id: 'soc-puntos-sisben', title: 'Puntos de sisben', mapLayerTitle: 'Puntos de sisben', sceneLayerTitle: 'Puntos de sisben', color: '#f97316', visibleByDefault: false }
    ]
  },
  {
    id: 'cat-economico',
    code: 'economico',
    title: 'ECONÓMICO',
    badge: '7 CAPAS',
    expandedByDefault: false,
    layers: [
      { id: 'econ-suelo-sector', title: 'Sector', mapLayerTitle: 'Sector', sceneLayerTitle: 'Sector', group: 'Valor Suelo Comercial', color: '#22c55e', visibleByDefault: false },
      { id: 'econ-suelo-lote', title: 'Lote', mapLayerTitle: 'Lote', sceneLayerTitle: 'Lote', group: 'Valor Suelo Comercial', color: '#22c55e', visibleByDefault: false },
      { id: 'econ-suelo-manzana', title: 'Manzana', mapLayerTitle: 'Manzana', sceneLayerTitle: 'Manzana', group: 'Valor Suelo Comercial', color: '#f97316', visibleByDefault: false },
      { id: 'econ-actividad-cambio', title: 'Actividad Económica cambio', mapLayerTitle: 'Actividad Economica cambio', sceneLayerTitle: 'Actividad Economica cambio', color: '#3b82f6', visibleByDefault: false },
      { id: 'econ-actividad-eco', title: 'Actividad económica', mapLayerTitle: 'Actividad económica', sceneLayerTitle: 'Actividad económica', color: '#a855f7', visibleByDefault: false },
      { id: 'econ-proy-bogota', title: 'Proyectos Bogotá', mapLayerTitle: 'Proyectos Bogota', sceneLayerTitle: 'Proyectos Bogota', group: 'Nuevos Proyectos', color: '#d946ef', visibleByDefault: false },
      { id: 'econ-proy-lote', title: 'Lote', mapLayerTitle: 'Lote', sceneLayerTitle: 'Lote', group: 'Nuevos Proyectos', color: '#f43f5e', visibleByDefault: false }
    ]
  },
  {
    id: 'cat-urbanistico',
    code: 'urbanistico',
    title: 'URBANÍSTICO',
    badge: '4 CAPAS',
    expandedByDefault: false,
    layers: [
      { id: 'urb-potencial', title: 'Potencial Edificatorio', mapLayerTitle: 'Potencial Edificatorio', sceneLayerTitle: 'Potencial Edificatorio', color: '#eab308', visibleByDefault: false },
      { id: 'urb-metro', title: 'Estación Metro', mapLayerTitle: 'EstacionMetro', sceneLayerTitle: 'EstacionMetro', group: 'Movilidad', color: '#10b981', visibleByDefault: false },
      { id: 'urb-psitp', title: 'PSITP', mapLayerTitle: 'PSITP', sceneLayerTitle: 'PSITP', group: 'Movilidad', color: '#34d399', visibleByDefault: false },
      { id: 'urb-troncal', title: 'Estación Troncal', mapLayerTitle: 'EstacionTronca', sceneLayerTitle: 'EstacionTronca', group: 'Movilidad', color: '#06b6d4', visibleByDefault: false }
    ]
  },
  {
    id: 'cat-ambiente',
    code: 'ambiente',
    title: 'AMBIENTE',
    badge: '2 CAPAS',
    expandedByDefault: false,
    layers: [
      { id: 'amb-ruido', title: 'Mapa ruido 2d - Niveles de Ruido (dB)', mapLayerTitle: 'Mapa ruido 2d - Niveles de Ruido (dB)', sceneLayerTitle: 'Mapa ruido 2d - Niveles de Ruido (dB)', color: '#06b6d4', visibleByDefault: false },
      { id: 'amb-calidad-aire', title: 'Simulación Calidad Aire Bogotá', mapLayerTitle: 'Simulacion Calidad Aire Bogota', sceneLayerTitle: 'Simulacion Calidad Aire Bogota', color: '#38bdf8', visibleByDefault: false }
    ]
  }
]

// Helper seguro para comprobar si una capa existe en una vista de mapa o escena
const isLayerInView = (item: LayerItemConfig, jmv: JimuMapView): boolean => {
  if (!jmv?.view?.map) return false
  return true // Todo apunta al mismo servicio unificado
}

/**
 * Componente memoizado para el reloj en tiempo real.
 * Al estar aislado, las actualizaciones de cada segundo NO re-renderizan el widget ni sus capas,
 * optimizando notablemente el rendimiento y reduciendo el consumo de CPU.
 */
const LiveClock = React.memo(({ showClock }: { showClock?: boolean }) => {
  const [currentDate, setCurrentDate] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    if (showClock === false) return

    const updateDateTime = () => {
      const now = new Date()
      const dateStr = now.toLocaleDateString('es-CO', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      const timeStr = now.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
      const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
      setCurrentDate(formattedDate.replace(/\./g, '').trim())
      setCurrentTime(timeStr.replace(/\./g, '').trim())
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [showClock])

  if (showClock === false || !currentDate) return null

  return (
    <div className="header-datetime-block">
      <span className="header-date">{currentDate}</span>
      <span className="header-time">{currentTime}</span>
    </div>
  )
})

const Widget = (props: AllWidgetProps<IMConfig>) => {
  // Colección de todas las vistas de mapas 2D y escenas 3D conectadas
  const [allJimuMapViews, setAllJimuMapViews] = useState<{ [viewId: string]: JimuMapView }>({})
  const [activeJimuMapViewId, setActiveJimuMapViewId] = useState<string>('')
  const [visibilityMap, setVisibilityMap] = useState<{ [layerId: string]: boolean }>({})
  const [symbologyMap, setSymbologyMap] = useState<{ [layerId: string]: string }>({})
  const [expandedCats, setExpandedCats] = useState<{ [catId: string]: boolean }>({})
  const [expandedSubgroups, setExpandedSubgroups] = useState<{ [subgroupKey: string]: boolean }>({})
  const [fachadasV2Transparency, setFachadasV2Transparency] = useState<number>(0)
  const syncedViewsRef = useRef<Set<string>>(new Set())
  const visibilityMapRef = useRef<{ [layerId: string]: boolean }>({})

  // Caché de candidatos de capas por vista para acelerar la búsqueda y evitar recorridos redundantes
  const candidatesCacheRef = useRef<Map<string, { timestamp: number; layerCount: number; candidates: any[] }>>(new Map())
  const loadedLayersSetRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    visibilityMapRef.current = visibilityMap
  }, [visibilityMap])

  const config = props.config
  const useMapWidgetIds = props.useMapWidgetIds

  // Estructura garantizada con Información Base, Estaciones de Metro y demás categorías
  const categories: LayerCategoryConfig[] = useMemo(() => {
    const rawCategories: LayerCategoryConfig[] = (config?.categories as any) || []
    if (!rawCategories || rawCategories.length === 0) {
      return DEFAULT_CATEGORIES
    }

    const baseDef = DEFAULT_CATEGORIES.find((c) => c.id === 'cat-base')!
    const metroDef = DEFAULT_CATEGORIES.find((c) => c.id === 'cat-estaciones-metro')!

    const sanitized = rawCategories.map((cat) => {
      // INFORMACIÓN BASE
      if (cat.id === 'cat-base' || cat.code === 'base' || cat.title.toLowerCase().includes('base')) {
        const cleanLayers = (cat.layers || [])
          .filter((l) => l && !String(l?.title || '').toLowerCase().includes('wms'))
          .map((l) => ({
            ...l,
            visibleByDefault: false
          }))

        return {
          ...cat,
          title: (cat.title || 'INFORMACIÓN BASE').replace(/^\d+\.\s*/, ''),
          badge: `${cleanLayers.length} CAPAS`,
          expandedByDefault: false,
          layers: cleanLayers
        }
      }

      // ESTACIONES DE METRO
      if (cat.id === 'cat-estaciones-metro' || cat.code === 'estaciones-metro' || String(cat.title || '').toLowerCase().includes('metro')) {
        const cleanLayers = (cat.layers || [])
          .filter((l) => l && !String(l?.title || '').toLowerCase().includes('wms'))
          .map((l) => ({
            ...l,
            visibleByDefault: false
          }))

        return {
          ...cat,
          title: (cat.title || 'ESTACIONES DE METRO').replace(/^\d+\.\s*/, ''),
          badge: `${cleanLayers.length} CAPAS`,
          expandedByDefault: false,
          layers: cleanLayers
        }
      }

      // URBANÍSTICO: asegurar capas apagadas (sin duplicar Volumetría que ya está en Información Base)
      if (cat.id === 'cat-urbanistico' || cat.code === 'urbanistico' || String(cat.title || '').toLowerCase().includes('urban')) {
        const cleanUrb = (cat.layers || []).filter((l) => {
          const t = String(l?.title || '').toLowerCase()
          return !t.includes('wms') && !t.includes('volumetr')
        }).map((l) => ({
          ...l,
          visibleByDefault: false
        }))
        return {
          ...cat,
          title: (cat.title || 'URBANÍSTICO').replace(/^\d+\.\s*/, ''),
          badge: `${cleanUrb.length} CAPAS`,
          expandedByDefault: false,
          layers: cleanUrb
        }
      }

      // AMBIENTE
      if (cat.id === 'cat-ambiente' || cat.code === 'ambiente' || String(cat.title || '').toLowerCase().includes('ambient')) {
        const filteredAmbiente = (cat.layers || [])
          .filter((l) => {
            const t = String(l?.title || '').toLowerCase()
            return !t.includes('wms') && !t.includes('ortofoto')
          })
          .map((l) => ({
            ...l,
            visibleByDefault: false
          }))
        return {
          ...cat,
          title: (cat.title || 'AMBIENTE').replace(/^\d+\.\s*/, ''),
          badge: `${filteredAmbiente.length} CAPAS`,
          layers: filteredAmbiente
        }
      }

      // Filtrar WMS y asegurar que arranquen apagadas
      const cleanedLayers = (cat.layers || [])
        .filter((l) => !String(l?.title || '').toLowerCase().includes('wms'))
        .map((l) => ({
          ...l,
          visibleByDefault: false
        }))
      return {
        ...cat,
        title: (cat.title || '').replace(/^\d+\.\s*/, ''),
        badge: `${cleanedLayers.length} CAPAS`,
        layers: cleanedLayers
      }
    })

    // Asegurar que INFORMACIÓN BASE exista
    const baseIdx = sanitized.findIndex((c) => c.id === 'cat-base' || c.code === 'base' || String(c.title || '').toLowerCase().includes('base'))
    if (baseIdx === -1) {
      sanitized.unshift(baseDef)
    }

    // Asegurar que ESTACIONES DE METRO exista directamente debajo de INFORMACIÓN BASE
    const hasMetro = sanitized.some((c) => c.id === 'cat-estaciones-metro' || c.code === 'estaciones-metro' || String(c.title || '').toLowerCase().includes('metro'))
    if (!hasMetro) {
      const targetIdx = sanitized.findIndex((c) => c.id === 'cat-base' || c.code === 'base' || String(c.title || '').toLowerCase().includes('base'))
      if (targetIdx !== -1) {
        sanitized.splice(targetIdx + 1, 0, metroDef)
      } else {
        sanitized.push(metroDef)
      }
    }

    return sanitized
  }, [config?.categories])

  // Inicializar estado de visibilidad y acordeones (todas las capas apagadas y grupos comprimidos)
  useEffect(() => {
    if (categories && categories.length > 0) {
      const initialExpCats: { [catId: string]: boolean } = {}
      const initialExpSubs: { [subKey: string]: boolean } = {}
      const initialVis: { [layerId: string]: boolean } = {}

      categories.forEach((cat) => {
        initialExpCats[cat.id] = false // Comprimido por defecto
        cat.layers?.forEach((layer) => {
          // Todas las capas deben arrancar apagadas
          initialVis[layer.id] = false
          if (layer.group) {
            initialExpSubs[`${cat.id}-${layer.group}`] = false // Subgrupo comprimido por defecto
          }
        })
      })

      setExpandedCats((prev) => {
        if (Object.keys(prev).length === 0) return initialExpCats
        return prev
      })
      setExpandedSubgroups((prev) => {
        if (Object.keys(prev).length === 0) return initialExpSubs
        return prev
      })
      setVisibilityMap((prev) => {
        if (Object.keys(prev).length === 0) return initialVis
        const next = { ...prev }
        let hasNew = false
        Object.keys(initialVis).forEach((k) => {
          if (next[k] === undefined) {
            next[k] = false
            hasNew = true
          }
        })
        return hasNew ? next : prev
      })
    }
  }, [categories])

  // Escaneo dinámico adaptativo de MapViewManager para capturar vistas 2D y 3D en la página
  useEffect(() => {
    let scanCount = 0
    let timerId: any = null

    const scanAllViews = () => {
      try {
        const mvm = MapViewManager.getInstance()
        const viewsList = mvm.getAllJimuMapViews ? mvm.getAllJimuMapViews() : []
        if (viewsList.length > 0) {
          const mapById: { [id: string]: JimuMapView } = {}
          viewsList.forEach((v) => {
            if (v?.view?.map) mapById[v.id] = v
          })
          const active = viewsList.find((v) => v.isActive)
          if (active) {
            setActiveJimuMapViewId(active.id)
          }

          // Difundir instancias de vistas globales para widgets analíticos (ej: Estadísticas)
          if (typeof window !== 'undefined') {
            try {
              (window as any).__exb_jimu_map_views__ = { ...((window as any).__exb_jimu_map_views__ || {}), ...mapById }
              if (active?.view) (window as any).__exb_active_map__ = active.view
              if (window.top && window.top !== window) {
                (window.top as any).__exb_jimu_map_views__ = { ...((window.top as any).__exb_jimu_map_views__ || {}), ...mapById }
                if (active?.view) (window.top as any).__exb_active_map__ = active.view
              }
              if (window.parent && window.parent !== window) {
                (window.parent as any).__exb_jimu_map_views__ = { ...((window.parent as any).__exb_jimu_map_views__ || {}), ...mapById }
                if (active?.view) (window.parent as any).__exb_active_map__ = active.view
              }
            } catch (eG) {}
          }

          setAllJimuMapViews((prev) => {
            const hasNew = Object.keys(mapById).some((k) => !prev[k])
            if (hasNew) {
              return { ...prev, ...mapById }
            }
            return prev
          })
        }

        scanCount++
        // Si ya capturamos las vistas esperadas o ya escaneamos varias veces, relajamos la frecuencia
        const targetViews = useMapWidgetIds?.length || 2
        const nextDelay = viewsList.length >= targetViews || scanCount > 4 ? 8000 : 1500
        timerId = setTimeout(scanAllViews, nextDelay)
      } catch (e) {
        timerId = setTimeout(scanAllViews, 5000)
      }
    }

    scanAllViews()
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [useMapWidgetIds])

  // Obtener todas las instancias de vistas conectadas (tanto MapView 2D como SceneView 3D)
  const getAllConnectedViews = useCallback((): JimuMapView[] => {
    const viewsMap: { [id: string]: JimuMapView } = { ...allJimuMapViews }
    try {
      const mvm = MapViewManager.getInstance()
      const mvmViews = mvm?.getAllJimuMapViews ? mvm.getAllJimuMapViews() : []
      mvmViews.forEach((v) => {
        if (v?.view?.map) viewsMap[v.id] = v
      })
    } catch (e) {}
    return Object.values(viewsMap)
  }, [allJimuMapViews])

  // Comprobar si hay al menos una escena 3D conectada
  const hasSceneView = useMemo(() => {
    const views = getAllConnectedViews()
    return views.some((v) => v.view?.type === '3d')
  }, [getAllConnectedViews])

  // Determinar la vista actualmente activa (o la primera vista 2D disponible)
  const currentActiveJimuMapView = useMemo((): JimuMapView | null => {
    const views = getAllConnectedViews()
    if (views.length === 0) return null
    if (activeJimuMapViewId && allJimuMapViews[activeJimuMapViewId]) {
      return allJimuMapViews[activeJimuMapViewId]
    }
    const explicitActive = views.find((v) => v.isActive)
    if (explicitActive) return explicitActive
    const view2D = views.find((v) => v.view?.type === '2d')
    if (view2D) return view2D
    return views[0]
  }, [getAllConnectedViews, activeJimuMapViewId, allJimuMapViews])

  // Comprobar si la capa debe mostrar "No disponible 2D"
  // Todas las capas apuntan al mismo servicio GIS unificado
  const isUnavailable2D = useCallback((item: LayerItemConfig): boolean => {
    return false
  }, [])

  /**
   * Buscar capas coincidentes en TODAS las vistas conectadas (Mapas 2D y Escenas 3D)
   * Devuelve un array con las capas encontradas en cada vista para encenderlas/apagarlas juntas
   */
  const findMatchingLayersAcrossViews = useCallback((item: LayerItemConfig): any[] => {
    const views = getAllConnectedViews()
    if (views.length === 0) return []

    const isGroupItem = String(item.id || '').startsWith('grp-') || String(item.id || '').startsWith('group-')
    const matchedLayers: any[] = []

    views.forEach((jmv) => {
      const view = jmv?.view
      if (!view?.map) return
      const map = view.map as any
      const isScene = view.type === '3d'

      const allLayers = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])
      const viewId = jmv.id || (isScene ? 'view-3d' : 'view-2d')

      interface Candidate {
        layer: any
        title: string
        id: string
        groupName?: string
      }

      let candidates: Candidate[] = []
      const cached = candidatesCacheRef.current.get(viewId)
      const now = Date.now()

      // Optimización de alto rendimiento: reutilizar el árbol de capas cacheado si tiene menos de 3.5 segundos
      if (cached && now - cached.timestamp < 3500 && cached.layerCount === allLayers.length) {
        candidates = cached.candidates
      } else {
        // Recorrido recursivo seguro con visited Set para evitar ciclos y bloqueos de CPU
        const visited = new Set<any>()
        const walkLayer = (l: any, parentTitle?: string) => {
          if (!l || visited.has(l)) return
          visited.add(l)
          if (isBasemap(l, map)) return

          candidates.push({
            layer: l,
            title: l.title || '',
            id: String(l.id ?? ''),
            groupName: parentTitle || l.parent?.title || ''
          })

          if (l.layers) {
            const arr = typeof l.layers.toArray === 'function' ? l.layers.toArray() : (Array.isArray(l.layers) ? l.layers : [])
            arr.forEach((child: any) => walkLayer(child, l.title || parentTitle))
          }
          if (l.sublayers) {
            const arr = typeof l.sublayers.toArray === 'function' ? l.sublayers.toArray() : (Array.isArray(l.sublayers) ? l.sublayers : [])
            arr.forEach((child: any) => walkLayer(child, l.title || parentTitle))
          }
        }

        allLayers.forEach((l: any) => walkLayer(l))
        candidatesCacheRef.current.set(viewId, { timestamp: now, layerCount: allLayers.length, candidates })
      }

      // Determinar los nombres objetivo para esta vista
      const targetTitle = (item.title || '').trim()
      const targetMapTitle = (item.mapLayerTitle || '').trim()
      const targetSceneTitle = (item.sceneLayerTitle || '').trim()
      const targetGroup = (item.group || '').trim()

      // Si es una vista 3D (Escena), priorizar sceneLayerTitle si fue configurado
      const primaryTarget = isScene && targetSceneTitle ? targetSceneTitle : (targetMapTitle || targetTitle)
      const secondaryTarget = targetTitle

      const normPrimary = normalizeStr(primaryTarget)
      const normSecondary = normalizeStr(secondaryTarget)
      const normGroup = normalizeStr(targetGroup)
      const norm3DPrimary = normalize3DStr(primaryTarget)

      const pickBest = (matches: Candidate[]): any => {
        if (matches.length === 0) return null
        if (matches.length === 1 || !normGroup) return matches[0].layer
        const withGroup = matches.find((c) => {
          const cg = normalizeStr(c.groupName || '')
          return cg && (cg === normGroup || cg.includes(normGroup) || normGroup.includes(cg))
        })
        return (withGroup || matches[0]).layer
      }

      // PRIORIDAD 1: Fachadas v2 (específica con sufijo v2 y transparencia ajustable)
      const isFachadasV2 = item.id === 'base-fachadas-v2' ||
        (normPrimary.includes('fachada') && normPrimary.includes('v2')) ||
        (normSecondary.includes('fachada') && normSecondary.includes('v2')) ||
        normPrimary === 'fachadasv2' || normPrimary === 'fachadav2'

      if (isFachadasV2) {
        const v2Matches = candidates.filter((c) => {
          const cNorm = normalizeStr(c.title)
          return cNorm.includes('v2') && (cNorm.includes('fachada') || cNorm.includes('volumetr'))
        })
        if (v2Matches.length > 0) {
          v2Matches.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
        // Fallback para cualquier capa que contenga v2
        const anyV2 = candidates.filter((c) => normalizeStr(c.title).includes('v2'))
        if (anyV2.length > 0) {
          anyV2.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
      }

      // PRIORIDAD 1.5: Fachadas original (SOLO con la capa de Fachadas, sin mezclar con otra capa)
      const isFachadas = !isFachadasV2 && (
        item.id === 'base-volumetria' ||
        normPrimary === 'fachadas' ||
        normPrimary === 'fachada' ||
        normPrimary.includes('fachada')
      )

      if (isFachadas) {
        // 1. Buscar coincidencia exacta por "fachadas" o "fachada"
        const exactFachada = candidates.filter((c) => {
          const cNorm = normalizeStr(c.title)
          if (cNorm.includes('v2')) return false
          return cNorm === 'fachadas' || cNorm === 'fachada'
        })
        if (exactFachada.length > 0) {
          exactFachada.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
        // 2. Coincidencia que contenga "fachada" (sin v2 y sin mezclar con otras capas como volumetría)
        const includesFachada = candidates.filter((c) => {
          const cNorm = normalizeStr(c.title)
          if (cNorm.includes('v2')) return false
          return cNorm.includes('fachada') && !cNorm.includes('volumetr')
        })
        if (includesFachada.length > 0) {
          includesFachada.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
        // Finalizar aquí para que Fachadas original nunca se enlace por error con volumetría u otra capa
        return
      }

      // Función para detectar si un objeto de capa es un contenedor real con hijos (GroupLayer o capa con subcapas con más de 0 elementos)
      const hasChildren = (l: any): boolean => {
        if (!l) return false
        if (l.type === 'group' || String(l.declaredClass || '').includes('GroupLayer')) return true
        const getCount = (col: any): number => {
          if (!col) return 0
          if (typeof col.length === 'number') return col.length
          if (typeof col.toArray === 'function') {
            try { return col.toArray().length } catch (e) { return 0 }
          }
          if (Array.isArray(col)) return col.length
          return 0
        }
        if (getCount(l.layers) > 0) return true
        if (getCount(l.sublayers) > 0) return true
        if (getCount(l.allSublayers) > 0) return true
        return false
      }

      // REGLAS ESPECÍFICAS PARA TELECOMUNICACIONES (aislar Canalización, Postes y Armarios)
      const isTelecomItem = !isGroupItem && (
        normGroup.includes('telecom') ||
        item.id === 'base-canalizacion' ||
        item.id === 'base-poste-telecom' ||
        item.id === 'base-armario-tel'
      )
      if (isTelecomItem) {
        const nonContainers = candidates.filter((c) => !hasChildren(c.layer))

        if (item.id === 'base-canalizacion' || normPrimary.includes('canaliz') || normSecondary.includes('canaliz')) {
          const m = nonContainers.filter((c) => {
            const cn = normalizeStr(c.title)
            return (cn.includes('canaliz') || cn.includes('ducto') || cn.includes('tuberia')) && !cn.includes('poste') && !cn.includes('armario')
          })
          if (m.length > 0) {
            m.forEach((c) => {
              if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
            })
            return
          }
        } else if (item.id === 'base-poste-telecom' || normPrimary.includes('poste') || normSecondary.includes('poste')) {
          const m = nonContainers.filter((c) => {
            const cn = normalizeStr(c.title)
            return cn.includes('poste') && !cn.includes('canaliz') && !cn.includes('armario')
          })
          if (m.length > 0) {
            m.forEach((c) => {
              if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
            })
            return
          }
        } else if (item.id === 'base-armario-tel' || normPrimary.includes('armario') || normSecondary.includes('armario')) {
          const m = nonContainers.filter((c) => {
            const cn = normalizeStr(c.title)
            return cn.includes('armario') && !cn.includes('canaliz') && !cn.includes('poste')
          })
          if (m.length > 0) {
            m.forEach((c) => {
              if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
            })
            return
          }
        }
      }

      // REGLAS ESPECÍFICAS PARA ARBOLADO Y PARQUES (aislar Parque y Arbolado urbano al 100% como capas independientes)
      const isArboladoItem = !isGroupItem && (
        normGroup.includes('arbolad') ||
        normGroup.includes('parque') ||
        item.id === 'base-parque' ||
        item.id === 'base-arbolado-urbano' ||
        normPrimary.includes('arbol') ||
        normPrimary.includes('parque')
      )
      if (isArboladoItem) {
        const nonContainers = candidates.filter((c) => !hasChildren(c.layer))

        if (item.id === 'base-parque' || (normPrimary.includes('parque') && !normPrimary.includes('arbol')) || (normSecondary.includes('parque') && !normSecondary.includes('arbol'))) {
          const m = nonContainers.filter((c) => {
            const cn = normalizeStr(c.title)
            return (cn.includes('parque') || cn === 'parques') && !cn.includes('arbol')
          })
          if (m.length > 0) {
            m.forEach((c) => {
              if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
            })
            return
          }
        } else if (item.id === 'base-arbolado-urbano' || (normPrimary.includes('arbol') && !normPrimary.includes('parque')) || (normSecondary.includes('arbol') && !normSecondary.includes('parque'))) {
          const m = nonContainers.filter((c) => {
            const cn = normalizeStr(c.title)
            return (cn.includes('arbol') || cn.includes('vegetac')) && !cn.includes('parque')
          })
          if (m.length > 0) {
            m.forEach((c) => {
              if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
            })
            return
          }
        }
      }

      // Para capas individuales (no grupo), excluir GroupLayers y contenedores en los pasos 1 a 5
      const searchCandidates = isGroupItem
        ? candidates
        : candidates.filter((c) => {
            if (hasChildren(c.layer)) return false
            if (normGroup) {
              const cNorm = normalizeStr(c.title)
              if (cNorm === normGroup || cNorm === `${normGroup}s` || `${cNorm}s` === normGroup || cNorm.includes(normGroup)) return false
            }
            return true
          })

      // PASO 1: Coincidencia EXACTA por título de mapa/escena o ID
      let found = searchCandidates.filter((c) => normalizeStr(c.title) === normPrimary || String(c.id) === primaryTarget)
      if (found.length > 0) {
        found.forEach((c) => {
          if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
        })
        return
      }

      // PASO 2: Coincidencia EXACTA por título secundario
      if (normSecondary && normSecondary !== normPrimary) {
        found = searchCandidates.filter((c) => normalizeStr(c.title) === normSecondary)
        if (found.length > 0) {
          found.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
      }

      // PASO 3: Coincidencia limpia (sin prefijos numéricos como "0. ", "1. ")
      const cleanNormPrimary = normalizeStr(primaryTarget.replace(/^\d+[\s.-]+/, ''))
      const cleanNormSecondary = normalizeStr(secondaryTarget.replace(/^\d+[\s.-]+/, ''))
      found = searchCandidates.filter((c) => {
        const cClean = normalizeStr(c.title.replace(/^\d+[\s.-]+/, ''))
        return (cleanNormPrimary && cClean === cleanNormPrimary) || (cleanNormSecondary && cClean === cleanNormSecondary)
      })
      if (found.length > 0) {
        found.forEach((c) => {
          if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
        })
        return
      }

      // PASO 3.5: Coincidencia singular/plural limpia (ej: "Parque" <-> "Parques", "Poste" <-> "Postes")
      const singularPrimary = cleanNormPrimary.replace(/s$/, '')
      found = searchCandidates.filter((c) => {
        const cClean = normalizeStr(c.title.replace(/^\d+[\s.-]+/, '')).replace(/s$/, '')
        return singularPrimary && cClean === singularPrimary
      })
      if (found.length > 0) {
        found.forEach((c) => {
          if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
        })
        return
      }

      // PASO 4: Coincidencia tolerante para 3D (removiendo sufijos "3D", "Mesh", "Edificaciones", etc.)
      if (isScene || norm3DPrimary.length >= 4) {
        found = searchCandidates.filter((c) => {
          const c3D = normalize3DStr(c.title)
          return c3D && norm3DPrimary && (c3D === norm3DPrimary || c3D.startsWith(norm3DPrimary) || norm3DPrimary.startsWith(c3D))
        })
        if (found.length > 0) {
          found.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
      }

      // PASO 5: Prefijo estricto de al menos 5 caracteres
      if (normPrimary && normPrimary.length >= 5) {
        found = searchCandidates.filter((c) => {
          const cNorm = normalizeStr(c.title)
          return cNorm.startsWith(normPrimary) || normPrimary.startsWith(cNorm)
        })
        if (found.length > 0) {
          found.forEach((c) => {
            if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
          })
          return
        }
      }

      // PASO 6 (Fallback para capas agregadas por el usuario que sean GroupLayers o servicios completos):
      const fallback = candidates.filter((c) => normalizeStr(c.title) === normPrimary || String(c.id) === primaryTarget || (normSecondary && normalizeStr(c.title) === normSecondary))
      if (fallback.length > 0) {
        fallback.forEach((c) => {
          if (c.layer && !matchedLayers.includes(c.layer)) matchedLayers.push(c.layer)
        })
        return
      }
    })

    return matchedLayers
  }, [getAllConnectedViews])

  /**
   * Desactiva de manera exhaustiva cualquier restricción de escala (minScale y maxScale a 0)
   * en una capa, sus subcapas, colecciones y contenedores superiores, garantizando que se
   * mantenga visible en cualquier nivel de zoom o escala del mapa o escena 3D (especialmente
   * crítico para modelos BIM y estaciones de metro).
   */
  const removeScaleLimitsRecursive = useCallback((node: any) => {
    if (!node) return
    try {
      if ('minScale' in node && typeof node.minScale === 'number' && node.minScale !== 0) {
        node.minScale = 0
      }
      if ('maxScale' in node && typeof node.maxScale === 'number' && node.maxScale !== 0) {
        node.maxScale = 0
      }
    } catch (e) {}

    // Recorrer subcapas (sublayers), allSublayers (BIM / BuildingSceneLayer) y layers (GroupLayer)
    const collections = [node.layers, node.sublayers, node.allSublayers]
    collections.forEach((coll) => {
      if (coll) {
        const arr = typeof coll.toArray === 'function' ? coll.toArray() : (Array.isArray(coll) ? coll : [])
        arr.forEach((child: any) => {
          if (child) {
            try {
              if ('minScale' in child && typeof child.minScale === 'number' && child.minScale !== 0) {
                child.minScale = 0
              }
              if ('maxScale' in child && typeof child.maxScale === 'number' && child.maxScale !== 0) {
                child.maxScale = 0
              }
            } catch (err) {}
            removeScaleLimitsRecursive(child)
          }
        })
      }
    })
  }, [])

  /**
   * Conmutar visibilidad en TODAS las vistas conectadas (Mapa 2D y Escena 3D)
   */
  const setLayerVisibilityInMap = useCallback((item: LayerItemConfig, targetVisibility: boolean) => {
    const matched = findMatchingLayersAcrossViews(item)
    if (matched.length === 0) return false

    const isGroupItem = String(item.id || '').startsWith('grp-') || String(item.id || '').startsWith('group-')

    matched.forEach((targetLayer) => {
      // 1. Establecer visibilidad directa en la capa o subcapa
      targetLayer.visible = targetVisibility

      // Identificar el contenedor padre real (GroupLayer o MapImageLayer)
      const parentContainer = targetLayer.parent || (targetLayer.layer && targetLayer.layer !== targetLayer ? targetLayer.layer : null)

      // 2. Si encendemos la capa:
      if (targetVisibility) {
        // Desactivar de inmediato cualquier restricción de escala para que se mantenga en todas las escalas
        removeScaleLimitsRecursive(targetLayer)

        // A. Aislar capas hermanas directas en el widget dentro del mismo grupo
        if (!isGroupItem && item.group) {
          const cat = categories.find((c) => c.layers?.some((l) => l.id === item.id))
          const siblings = cat?.layers?.filter((l) => l.group === item.group && l.id !== item.id) || []
          siblings.forEach((sibItem) => {
            if (!visibilityMapRef.current[sibItem.id]) {
              const matchedSibs = findMatchingLayersAcrossViews(sibItem)
              matchedSibs.forEach((sibLayer) => {
                if (sibLayer && 'visible' in sibLayer) {
                  sibLayer.visible = false
                }
              })
            }
          })
        }

        // C. Activar los contenedores superiores y eliminar también sus restricciones de escala
        let p = parentContainer
        while (p && p.declaredClass !== 'esri.Map' && p.declaredClass !== 'esri.WebMap' && p.declaredClass !== 'esri.WebScene') {
          if ('visible' in p && !p.visible) {
            p.visible = true
          }
          try {
            if ('minScale' in p && typeof p.minScale === 'number' && p.minScale !== 0) {
              p.minScale = 0
            }
            if ('maxScale' in p && typeof p.maxScale === 'number' && p.maxScale !== 0) {
              p.maxScale = 0
            }
          } catch (e) {}
          p = p.parent || (p.layer && p.layer !== p ? p.layer : null)
        }

        // D. Si es una acción de grupo O es un contenedor (GroupLayer, BuildingSceneLayer), encender recursivamente subcapas y quitar límites de escala
        const turnOnRecursive = (n: any) => {
          if (!n) return
          if ('visible' in n) n.visible = true
          removeScaleLimitsRecursive(n)
          const cols = [n.layers, n.sublayers, n.allSublayers]
          cols.forEach((col) => {
            if (col) {
              const arr = typeof col.toArray === 'function' ? col.toArray() : (Array.isArray(col) ? col : [])
              arr.forEach((ch: any) => turnOnRecursive(ch))
            }
          })
        }

        const isContainer = isGroupItem ||
          targetLayer.type === 'building-scene' ||
          targetLayer.type === 'group' ||
          String(targetLayer.declaredClass || '').includes('GroupLayer') ||
          String(targetLayer.declaredClass || '').includes('BuildingSceneLayer') ||
          Boolean(targetLayer.layers || targetLayer.sublayers || targetLayer.allSublayers)

        if (isContainer) {
          turnOnRecursive(targetLayer)
        }

        // Asegurar que si la capa se inicializa o carga asíncronamente, aplique minScale=0 y maxScale=0 al resolver
        if (typeof targetLayer.when === 'function') {
          targetLayer.when(() => {
            removeScaleLimitsRecursive(targetLayer)
            if (typeof targetLayer.refresh === 'function') {
              try { targetLayer.refresh() } catch (err) {}
            }
          }).catch(() => {})
        } else if (typeof targetLayer.load === 'function' && !targetLayer.loaded) {
          targetLayer.load().then(() => {
            removeScaleLimitsRecursive(targetLayer)
            if (typeof targetLayer.refresh === 'function') {
              try { targetLayer.refresh() } catch (err) {}
            }
          }).catch(() => {})
        }

        // E. Si es Fachadas v2, asegurar su opacidad configurada
        if (item.id === 'base-fachadas-v2' || item.title.toLowerCase().includes('fachadas v2')) {
          const opacityVal = Math.max(0, Math.min(1, (100 - fachadasV2Transparency) / 100))
          if ('opacity' in targetLayer) targetLayer.opacity = opacityVal
          const ch = targetLayer.layers || targetLayer.sublayers || targetLayer.allSublayers
          if (ch) {
            const arr = typeof ch.toArray === 'function' ? ch.toArray() : (Array.isArray(ch) ? ch : [])
            arr.forEach((child: any) => {
              if (child && 'opacity' in child) child.opacity = opacityVal
            })
          }
        }

        // F. Refrescar contenedor si aplica para forzar renderizado inmediato
        if (parentContainer && typeof parentContainer.refresh === 'function') {
          try { parentContainer.refresh() } catch (e) {}
        }
        if (typeof targetLayer.refresh === 'function') {
          try { targetLayer.refresh() } catch (e) {}
        }
      } else {
        // 3. Si apagamos la capa:
        // A. Si tiene subcapas o hijos (GroupLayer, MapImageLayer, BIM), apagar absolutamente todos los hijos recursivamente
        const turnOffRecursive = (node: any) => {
          if (!node) return
          if ('visible' in node) node.visible = false
          const ch = node.layers || node.sublayers || node.allSublayers
          if (ch) {
            const arr = typeof ch.toArray === 'function' ? ch.toArray() : (Array.isArray(ch) ? ch : [])
            arr.forEach((childNode: any) => turnOffRecursive(childNode))
          }
        }
        turnOffRecursive(targetLayer)

        // B. Comprobar si el contenedor GroupLayer o MapImageLayer en ArcGIS debe apagarse
        // Verificamos si queda alguna capa ACTIVA en el widget que pertenezca a este contenedor
        if (parentContainer && parentContainer.declaredClass !== 'esri.Map' && parentContainer.declaredClass !== 'esri.WebMap' && parentContainer.declaredClass !== 'esri.WebScene') {
          let hasActiveInContainer = false
          categories.forEach((cat) => {
            cat.layers?.forEach((lc) => {
              if (lc.id !== item.id && visibilityMapRef.current[lc.id]) {
                const matchedActive = findMatchingLayersAcrossViews(lc)
                if (matchedActive.some((m) => m === parentContainer || m.parent === parentContainer || m.layer === parentContainer)) {
                  hasActiveInContainer = true
                }
              }
            })
          })

          if (!hasActiveInContainer) {
            parentContainer.visible = false
            // Subir por la jerarquía apagando contenedores sin capas activas
            let anc = parentContainer.parent || (parentContainer.layer && parentContainer.layer !== parentContainer ? parentContainer.layer : null)
            while (anc && anc.declaredClass !== 'esri.Map' && anc.declaredClass !== 'esri.WebMap' && anc.declaredClass !== 'esri.WebScene') {
              let ancHasActive = false
              categories.forEach((cat) => {
                cat.layers?.forEach((lc) => {
                  if (visibilityMapRef.current[lc.id]) {
                    const matchedActive = findMatchingLayersAcrossViews(lc)
                    if (matchedActive.some((m) => m === anc || m.parent === anc || m.layer === anc)) {
                      ancHasActive = true
                    }
                  }
                })
              })
              if (!ancHasActive) {
                anc.visible = false
              }
              anc = anc.parent || (anc.layer && anc.layer !== anc ? anc.layer : null)
            }
          }
        }

        // C. Refrescar contenedor si es MapImageLayer para aplicar el apagado inmediatamente en pantalla
        if (parentContainer && typeof parentContainer.refresh === 'function') {
          try { parentContainer.refresh() } catch (e) {}
        }
        if (typeof targetLayer.refresh === 'function') {
          try { targetLayer.refresh() } catch (e) {}
        }
      }
    })

    return true
  }, [findMatchingLayersAcrossViews, categories, fachadasV2Transparency])

  // Ajustar transparencia exclusivamente para Fachadas v2 en todas las vistas (2D y 3D)
  const setLayerOpacityInMap = useCallback((item: LayerItemConfig, transparencyPercent: number) => {
    const matched = findMatchingLayersAcrossViews(item)
    if (matched.length === 0) return
    const opacityVal = Math.max(0, Math.min(1, (100 - transparencyPercent) / 100))

    matched.forEach((targetLayer) => {
      try {
        if ('opacity' in targetLayer) {
          targetLayer.opacity = opacityVal
        }
        const ch = targetLayer.layers || targetLayer.sublayers || targetLayer.allSublayers
        if (ch) {
          const arr = typeof ch.toArray === 'function' ? ch.toArray() : (Array.isArray(ch) ? ch : [])
          arr.forEach((child: any) => {
            if (child && 'opacity' in child) {
              child.opacity = opacityVal
            }
          })
        }
      } catch (e) {}
    })
  }, [findMatchingLayersAcrossViews])

  /**
   * Sincronizar automáticamente visibilidad y simbología en cada vista que cargue (2D y 3D)
   * NOTA: No depende de visibilityMap para garantizar conmutación instantánea (< 5ms)
   */
  useEffect(() => {
    const views = getAllConnectedViews()
    if (views.length === 0) return

    views.forEach((jmv) => {
      const view = jmv?.view
      if (!view) return

      const viewId = jmv.id

      const syncView = () => {
        const updatedSymb: { [layerId: string]: string } = {}
        const currentVis = visibilityMapRef.current

        // 1. Aplicar estado inicial (todas apagadas por defecto)
        categories.forEach((cat) => {
          cat.layers?.forEach((item) => {
            const isVis = currentVis[item.id] === true
            setLayerVisibilityInMap(item, isVis)

            // Extraer simbología de la capa una sola vez al montar
            const matched = findMatchingLayersAcrossViews(item)
            if (matched.length > 0) {
              const first = matched[0]
              const applySymb = (targetLayer: any) => {
                const symbolColor = extractSymbologyColor(targetLayer)
                if (symbolColor) {
                  setSymbologyMap((prev) => ({ ...prev, [item.id]: symbolColor }))
                }
              }

              if (first.loaded) {
                applySymb(first)
              } else if (typeof first.load === 'function') {
                first.load().then(() => applySymb(first)).catch(() => {})
              }
            }
          })
        })

        // 2. Apagar explícitamente los grupos de metro, arbolado y servicios en el mapa/escena
        const groupsToTurnOff = [
          'Arbolado y parques', 'Arbolado y Parques', 'Arbolado', 'Parques',
          'Telecomunicaciones', 'Acueducto', 'Equipamientos', 'Equipamiento',
          'Estaciones de metro', 'Estaciones de Metro', 'Intersección', 'Estación 15', 'Estación 16'
        ]
        groupsToTurnOff.forEach((gName) => {
          setLayerVisibilityInMap({ id: `grp-${gName}`, title: gName, mapLayerTitle: gName, sceneLayerTitle: gName }, false)
        })

        // 3. Apagado preventivo de cualquier capa de metro, telecomunicaciones, volumetría o arbolado en la escena/mapa
        if (view?.map) {
          const m = view.map as any
          const allL = m.allLayers ? m.allLayers.toArray() : (m.layers ? m.layers.toArray() : [])
          allL.forEach((l: any) => {
            if (!l || isBasemap(l, m)) return
            const normT = normalizeStr(l.title || '')
            // Desactivar límites de escala en capas de metro desde el inicio
            if (
              normT.includes('metro') ||
              normT.startsWith('l1t1') ||
              normT.includes('interseccion') ||
              normT.includes('estacion15') ||
              normT.includes('estacion16')
            ) {
              removeScaleLimitsRecursive(l)
            }

            if (
              normT.includes('metro') ||
              normT.startsWith('l1t1') ||
              normT.includes('interseccion') ||
              normT.includes('estacion15') ||
              normT.includes('estacion16') ||
              normT.includes('arbolad') ||
              normT.includes('parque') ||
              normT.includes('telecom') ||
              normT.includes('canaliza') ||
              normT.includes('poste') ||
              normT.includes('armario') ||
              normT.includes('fachada') ||
              normT.includes('representacion') ||
              normT.includes('volumetr')
            ) {
              const turnOffRecursive = (node: any) => {
                if (!node) return
                if ('visible' in node) node.visible = false
                const ch = node.layers || node.sublayers || node.allSublayers
                if (ch) {
                  const arr = typeof ch.toArray === 'function' ? ch.toArray() : (Array.isArray(ch) ? ch : [])
                  arr.forEach((childNode: any) => turnOffRecursive(childNode))
                }
              }
              turnOffRecursive(l)
            }
          })
        }

        if (Object.keys(updatedSymb).length > 0) {
          setSymbologyMap((prev) => ({ ...prev, ...updatedSymb }))
        }
      }

      if (!syncedViewsRef.current.has(viewId)) {
        syncedViewsRef.current.add(viewId)
        if (view.ready) {
          syncView()
        } else if (typeof view.when === 'function') {
          view.when(() => syncView()).catch(() => {})
        }
      }
    })
  }, [allJimuMapViews, categories, getAllConnectedViews, findMatchingLayersAcrossViews, setLayerVisibilityInMap])

  // Re-aplicar visibilidad cada vez que cambia la vista activa (ej: al pasar de mapa 2D a escena 3D o viceversa)
  useEffect(() => {
    if (!activeJimuMapViewId) return
    const jmv = allJimuMapViews[activeJimuMapViewId]
    if (!jmv?.view) return

    const syncActive = () => {
      const currentVis = visibilityMapRef.current
      categories.forEach((cat) => {
        cat.layers?.forEach((item) => {
          const isVis = !!currentVis[item.id]
          setLayerVisibilityInMap(item, isVis)
        })
      })
    }

    if (jmv.view.ready) {
      syncActive()
    } else if (typeof jmv.view.when === 'function') {
      jmv.view.when(() => syncActive()).catch(() => {})
    }
  }, [activeJimuMapViewId, allJimuMapViews, categories, setLayerVisibilityInMap])

  // Reafirmar visibilidad sin límites de escala (minScale=0, maxScale=0) en capas activas (en especial metro) al cambiar zoom o escala
  useEffect(() => {
    const views = getAllConnectedViews()
    if (views.length === 0) return

    const cleanups: Array<() => void> = []

    views.forEach((jmv) => {
      const view = jmv?.view
      if (!view) return

      const enforceActiveScales = () => {
        const currentVis = visibilityMapRef.current
        categories.forEach((cat) => {
          cat.layers?.forEach((item) => {
            if (currentVis[item.id]) {
              const matched = findMatchingLayersAcrossViews(item)
              matched.forEach((l) => {
                removeScaleLimitsRecursive(l)
                let p = l.parent || (l.layer && l.layer !== l ? l.layer : null)
                while (p && p.declaredClass !== 'esri.Map' && p.declaredClass !== 'esri.WebMap' && p.declaredClass !== 'esri.WebScene') {
                  try {
                    if ('minScale' in p && typeof p.minScale === 'number' && p.minScale !== 0) p.minScale = 0
                    if ('maxScale' in p && typeof p.maxScale === 'number' && p.maxScale !== 0) p.maxScale = 0
                  } catch (e) {}
                  p = p.parent || (p.layer && p.layer !== p ? p.layer : null)
                }
              })
            }
          })
        })
      }

      if (typeof view.watch === 'function') {
        const handle = view.watch('stationary', (isStationary) => {
          if (isStationary) {
            enforceActiveScales()
          }
        })
        cleanups.push(() => {
          try { if (typeof handle?.remove === 'function') handle.remove() } catch (e) {}
        })
      }
    })

    return () => {
      cleanups.forEach((c) => c())
    }
  }, [allJimuMapViews, categories, getAllConnectedViews, findMatchingLayersAcrossViews, removeScaleLimitsRecursive])

  // Sincronizar en vivo todas las capas del mapa y de la escena hacia el panel de configuración (window.top)
  useEffect(() => {
    const views = getAllConnectedViews()
    if (views.length === 0) return

    const syncLayers = () => {
      try {
        const detectedAll: string[] = []
        const detected2D: string[] = []
        const detected3D: string[] = []
        const fieldsCollector: { [title: string]: Array<{ name: string; alias: string; type: string }> } = {}

        const broadcastFields = (fMap: any) => {
          if (typeof window !== 'undefined' && Object.keys(fMap).length > 0) {
            try {
              const existing = (window as any).__exb_layer_fields__ || {}
              const merged = { ...existing, ...fMap }
              ;(window as any).__exb_layer_fields__ = merged
              if (window.top) (window.top as any).__exb_layer_fields__ = merged
              if (window.parent) (window.parent as any).__exb_layer_fields__ = merged
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('__exb_layer_fields__', JSON.stringify(merged))
              }
            } catch (e) {}
          }
        }

        views.forEach((jmv) => {
          const view = jmv?.view
          if (!view?.map) return
          const isScene = view.type === '3d'
          const map = view.map as any

          const scanRecursive = (layerList: any[]) => {
            if (!layerList || !Array.isArray(layerList)) return
            layerList.forEach((l: any) => {
              if (!l || isBasemap(l, map)) return
              const isGroup = l.type === 'group' || l.declaredClass === 'esri.layers.GroupLayer' || (l.layers && typeof l.layers.forEach === 'function')
              const hasSublayers = l.sublayers && typeof l.sublayers.forEach === 'function' && l.sublayers.length > 0

              if (l.title && !isGroup && !hasSublayers && !String(l.title).toLowerCase().includes('wms')) {
                const t = l.title.trim()
                detectedAll.push(t)
                if (isScene) {
                  detected3D.push(t)
                } else {
                  detected2D.push(t)
                  detected3D.push(t) // Todo lo que está en 2D también está en 3D (mismo servicio)
                }

                // Extraer campos de la capa
                if (l.fields && Array.isArray(l.fields) && l.fields.length > 0) {
                  fieldsCollector[t] = l.fields.map((f: any) => ({
                    name: f.name,
                    alias: f.alias || f.name,
                    type: f.type || 'string'
                  }))
                } else if (typeof l.load === 'function' && !l.loaded && !loadedLayersSetRef.current.has(t)) {
                  loadedLayersSetRef.current.add(t)
                  l.load().then(() => {
                    if (l.fields && Array.isArray(l.fields) && l.fields.length > 0) {
                      const asyncMap: any = {}
                      asyncMap[t] = l.fields.map((f: any) => ({
                        name: f.name,
                        alias: f.alias || f.name,
                        type: f.type || 'string'
                      }))
                      broadcastFields(asyncMap)
                    }
                  }).catch(() => {})
                }
              }

              if (l.layers && typeof l.layers.forEach === 'function') {
                const childLayers = l.layers.toArray ? l.layers.toArray() : (Array.isArray(l.layers) ? l.layers : [])
                scanRecursive(childLayers)
              }

              if (hasSublayers) {
                const subList = l.sublayers.toArray ? l.sublayers.toArray() : (Array.isArray(l.sublayers) ? l.sublayers : [])
                subList.forEach((sub: any) => {
                  if (sub?.title && !String(sub.title).toLowerCase().includes('wms')) {
                    const st = sub.title.trim()
                    detectedAll.push(st)
                    if (isScene) {
                      detected3D.push(st)
                    } else {
                      detected2D.push(st)
                      detected3D.push(st) // Todo lo que está en 2D también está en 3D (mismo servicio)
                    }
                    if (sub.fields && Array.isArray(sub.fields) && sub.fields.length > 0) {
                      fieldsCollector[st] = sub.fields.map((f: any) => ({
                        name: f.name,
                        alias: f.alias || f.name,
                        type: f.type || 'string'
                      }))
                    }
                  }
                })
              }
            })
          }

          const allL = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])
          scanRecursive(allL)
        })

        const uniqueTitles = Array.from(new Set(detectedAll)).filter(Boolean)
        const unique2D = Array.from(new Set(detected2D)).filter(Boolean)
        const unique3D = Array.from(new Set(detected3D)).filter(Boolean)

        if (typeof window !== 'undefined') {
          ;(window as any).__exb_detected_map_layers__ = uniqueTitles
          ;(window as any).__exb_detected_2d_layers__ = unique2D
          ;(window as any).__exb_detected_3d_layers__ = unique3D
          if (window.top) {
            ;(window.top as any).__exb_detected_map_layers__ = uniqueTitles
            ;(window.top as any).__exb_detected_2d_layers__ = unique2D
            ;(window.top as any).__exb_detected_3d_layers__ = unique3D
          }
          if (window.parent) {
            ;(window.parent as any).__exb_detected_map_layers__ = uniqueTitles
            ;(window.parent as any).__exb_detected_2d_layers__ = unique2D
            ;(window.parent as any).__exb_detected_3d_layers__ = unique3D
          }
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('__exb_detected_2d_layers__', JSON.stringify(unique2D))
            sessionStorage.setItem('__exb_detected_3d_layers__', JSON.stringify(unique3D))
          }
        }

        broadcastFields(fieldsCollector)
      } catch (err) {}
    }

    syncLayers()
    const interval = setInterval(syncLayers, 10000)
    return () => clearInterval(interval)
  }, [allJimuMapViews, getAllConnectedViews])

  // Notificar cambios de capas activas para widgets dependientes (ej: Estadísticas)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const activeLayers: { id: string; title: string; mapLayerTitle: string; sceneLayerTitle?: string; group?: string; categoryTitle?: string; color?: string }[] = []
    const activeTitlesSet = new Set<string>()
    const activeMapTitlesSet = new Set<string>()
    const activeSceneTitlesSet = new Set<string>()

    categories.forEach((cat) => {
      cat.layers?.forEach((l) => {
        if (visibilityMap[l.id]) {
          activeLayers.push({
            id: l.id,
            title: l.title,
            mapLayerTitle: l.mapLayerTitle || l.title,
            sceneLayerTitle: l.sceneLayerTitle,
            group: l.group,
            categoryTitle: cat.title,
            color: l.color
          })
          if (l.title) activeTitlesSet.add(l.title)
          if (l.mapLayerTitle) activeMapTitlesSet.add(l.mapLayerTitle)
          if (l.sceneLayerTitle) activeSceneTitlesSet.add(l.sceneLayerTitle)
          if (l.group) {
            activeTitlesSet.add(l.group)
            activeMapTitlesSet.add(l.group)
            activeSceneTitlesSet.add(l.group)
          }
          if (cat.title) {
            activeTitlesSet.add(cat.title)
            activeMapTitlesSet.add(cat.title)
            activeSceneTitlesSet.add(cat.title)
          }
        }
      })
    })

    const payload = {
      activeLayers,
      activeIds: activeLayers.map((l) => l.id),
      activeTitles: Array.from(activeTitlesSet),
      activeMapTitles: Array.from(activeMapTitlesSet),
      activeSceneTitles: Array.from(activeSceneTitlesSet),
      visibilityMap
    }

    try {
      ;(window as any).__exb_active_layers_data__ = payload
      if (window.top) (window.top as any).__exb_active_layers_data__ = payload
      if (window.parent) (window.parent as any).__exb_active_layers_data__ = payload
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('__exb_active_layers_data__', JSON.stringify(payload))
      }

      window.dispatchEvent(new CustomEvent('exb_active_layers_change', { detail: payload }))
      if (window.top && window.top !== window) {
        window.top.dispatchEvent(new CustomEvent('exb_active_layers_change', { detail: payload }))
      }
    } catch (e) {}
  }, [visibilityMap, categories])

  // Conmutar capa individual (controla tanto mapa 2D como escena 3D)
  const toggleLayer = (item: LayerItemConfig, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      try { e.preventDefault() } catch (err) {}
    }
    const currentVal = !!visibilityMapRef.current[item.id]
    const nextVal = !currentVal

    visibilityMapRef.current[item.id] = nextVal
    setLayerVisibilityInMap(item, nextVal)
    setVisibilityMap((prev) => ({ ...prev, [item.id]: nextVal }))
  }

  // Encender o apagar todas las capas de un grupo
  const setGroupVisibility = (groupLayers: LayerItemConfig[], targetState: boolean, groupName?: string) => {
    const newVis = { ...visibilityMapRef.current }
    groupLayers.forEach((layer) => {
      newVis[layer.id] = targetState
      visibilityMapRef.current[layer.id] = targetState
      setLayerVisibilityInMap(layer, targetState)
    })
    if (groupName) {
      setLayerVisibilityInMap({ id: `group-${groupName}`, title: groupName, mapLayerTitle: groupName, sceneLayerTitle: groupName }, targetState)
    }
    setVisibilityMap(newVis)
  }

  // Alternar acordeón de categoría
  const toggleCategory = (catId: string) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  // Alternar acordeón de subgrupo
  const toggleSubgroup = (subgroupKey: string) => {
    setExpandedSubgroups((prev) => ({ ...prev, [subgroupKey]: !prev[subgroupKey] }))
  }

  // Manejadores de vistas JimuMapViewComponent
  const handleViewsCreate = (views: { [viewId: string]: JimuMapView }) => {
    if (views) {
      setAllJimuMapViews((prev) => ({ ...prev, ...views }))
    }
  }

  const handleViewsChange = (views: { [viewId: string]: JimuMapView }) => {
    if (views) {
      setAllJimuMapViews((prev) => ({ ...prev, ...views }))
    }
  }

  const handleActiveViewChange = (jmv: JimuMapView) => {
    if (jmv) {
      setAllJimuMapViews((prev) => ({ ...prev, [jmv.id]: jmv }))
      setActiveJimuMapViewId(jmv.id)
    }
  }

  return (
    <div
      className="widget-capas-tematicas jimu-widget calcite-mode-dark"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#111822',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* Conexión con los mapas y escenas ArcGIS */}
      {useMapWidgetIds && useMapWidgetIds.length > 0 && useMapWidgetIds.map((mapWidgetId) => (
        <JimuMapViewComponent
          key={mapWidgetId}
          useMapWidgetId={mapWidgetId}
          onViewsCreate={handleViewsCreate}
          onViewsChange={handleViewsChange}
          onActiveViewChange={handleActiveViewChange}
        />
      ))}

      {/* CABECERA CALCITE */}
      <div className="header-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="header-subtitle">
              {config?.headerSubtitle || 'EXPLORACIÓN TERRITORIAL'}
            </div>
            <div className="header-title">
              {config?.headerTitle || 'Capas Temáticas'}
            </div>
            <LiveClock showClock={config?.showClock !== false} />
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              type="button"
              className="category-quick-btn"
              onClick={() => {
                const allList: LayerItemConfig[] = []
                categories.forEach((c) => c.layers?.forEach((l) => allList.push(l)))
                setGroupVisibility(allList, true)
              }}
              title="Encender todas las capas en el mapa y la escena"
            >
              TODAS ON
            </button>
            <button
              type="button"
              className="category-quick-btn"
              onClick={() => {
                const allList: LayerItemConfig[] = []
                categories.forEach((c) => c.layers?.forEach((l) => allList.push(l)))
                setGroupVisibility(allList, false)
              }}
              title="Apagar todas las capas en el mapa y la escena"
            >
              TODAS OFF
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA DE SCROLL CON LAS 5 CATEGORÍAS */}
      <div className="content-scroll">
        {categories.map((cat) => {
          const isCatExpanded = !!expandedCats[cat.id]

          // Separar capas directas y subgrupos
          const standaloneLayers: LayerItemConfig[] = []
          const subgroupsMap: { [groupName: string]: LayerItemConfig[] } = {}
          const allCatLayers = cat.layers || []

          cat.layers?.forEach((layer) => {
            if (layer.group) {
              if (!subgroupsMap[layer.group]) subgroupsMap[layer.group] = []
              subgroupsMap[layer.group].push(layer)
            } else {
              standaloneLayers.push(layer)
            }
          })

          return (
            <div key={cat.id} className="category-block">
              {/* CABECERA DE CATEGORÍA */}
              <div
                className="category-header-row"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="category-header-left">
                  <span className={`category-chevron-icon ${isCatExpanded ? '' : 'is-collapsed'}`}>
                    ▼
                  </span>
                  <span className="category-label">
                    {cat.title}
                  </span>
                </div>

                <span className="category-pill-badge">
                  {cat.badge || (allCatLayers.length ? `${allCatLayers.length} CAPAS` : '')}
                </span>
              </div>

              {/* CONTENIDO DESPLEGADO */}
              {isCatExpanded && (
                <div className="layers-list">
                  {/* 1. Capas directas con preservación estricta de color y simbología */}
                  {standaloneLayers.map((layer) => {
                    const isChecked = !!visibilityMap[layer.id]
                    const isUnavail = isUnavailable2D(layer)
                    const dotColor = getEffectiveDotColor(layer, symbologyMap, cat.id)
                    const isFachadasV2Item = layer.id === 'base-fachadas-v2' || layer.title.toLowerCase().includes('fachadas v2')

                    return (
                      <React.Fragment key={layer.id}>
                        <div
                          className={`layer-item-card ${isChecked ? 'is-active' : ''} ${isUnavail ? 'is-unavailable' : ''}`}
                          onClick={(e) => toggleLayer(layer, e)}
                        >
                          <div className="layer-left-info">
                            <span
                              className="layer-color-dot"
                              style={{
                                backgroundColor: dotColor,
                                boxShadow: isChecked ? `0 0 7px ${dotColor}` : 'none'
                              }}
                            />
                            <span className="layer-name-text" title={layer.title}>
                              {layer.title}
                            </span>
                            {config?.showUnavailableTag !== false && isUnavail && (
                              <span className="layer-unavailable-tag" title="Esta capa no está disponible en el mapa 2D, solo en la escena 3D">
                                No disponible 2D
                              </span>
                            )}
                          </div>

                          <div
                            className={`calcite-box ${isChecked ? 'is-checked' : ''}`}
                            style={{ pointerEvents: 'none' }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" style={{ pointerEvents: 'none' }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>

                        {/* Control especial de transparencia EXCLUSIVO para Fachadas v2 */}
                        {isFachadasV2Item && (
                          <div
                            className="fachadas-v2-transparency-panel"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '6px 14px 10px 36px',
                              backgroundColor: 'rgba(0, 229, 255, 0.05)',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                              <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                                Transparencia
                              </span>
                              <span style={{ color: '#00e5ff', fontWeight: 600, fontFamily: 'monospace' }}>
                                {fachadasV2Transparency}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={fachadasV2Transparency}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation()
                                const val = Number(e.target.value)
                                setFachadasV2Transparency(val)
                                setLayerOpacityInMap(layer, val)
                              }}
                              style={{
                                width: '100%',
                                height: '4px',
                                accentColor: '#00e5ff',
                                cursor: 'pointer'
                              }}
                              title="Ajustar transparencia de Fachadas v2"
                            />
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}

                  {/* 2. Subgrupos comprimibles con casilla para prender/apagar todo */}
                  {Object.keys(subgroupsMap).map((groupName) => {
                    const subKey = `${cat.id}-${groupName}`
                    const isSubExpanded = !!expandedSubgroups[subKey]
                    const subLayers = subgroupsMap[groupName]
                    const isAllSubGroupChecked = subLayers.length > 0 && subLayers.every((l) => !!visibilityMap[l.id])

                    return (
                      <div key={subKey} className="subgroup-container">
                        {/* Cabecera del subgrupo */}
                        <div
                          className="subgroup-header"
                          onClick={() => toggleSubgroup(subKey)}
                        >
                          <div className="subgroup-title-left">
                            <span className={`subgroup-chevron ${isSubExpanded ? '' : 'is-collapsed'}`}>
                              ▼
                            </span>
                            <span className="subgroup-title-text">
                              {groupName}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', color: '#628099', fontWeight: 600 }}>
                              {subLayers.length}
                            </span>
                            {/* Casilla para prender y apagar todas las capas del subgrupo */}
                            {config?.allowGroupToggle !== false && (
                              <div
                                className={`calcite-box ${isAllSubGroupChecked ? 'is-checked' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const targetState = !isAllSubGroupChecked
                                  setGroupVisibility(subLayers, targetState, groupName)
                                }}
                                title={isAllSubGroupChecked ? `Apagar todas las capas de ${groupName}` : `Encender todas las capas de ${groupName}`}
                                style={{ width: '16px', height: '16px', flexShrink: 0 }}
                              >
                                <svg viewBox="0 0 24 24" fill="none" style={{ width: '10px', height: '10px' }}>
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Capas internas del subgrupo */}
                        {isSubExpanded && (
                          <div className="subgroup-content subgroup-layers-body">
                            {subLayers.map((layer) => {
                              const isChecked = !!visibilityMap[layer.id]
                              const isUnavail = isUnavailable2D(layer)
                              const dotColor = getEffectiveDotColor(layer, symbologyMap, cat.id)

                              return (
                                <div
                                  key={layer.id}
                                  className={`layer-item-card ${isChecked ? 'is-active' : ''} ${isUnavail ? 'is-unavailable' : ''}`}
                                  onClick={(e) => toggleLayer(layer, e)}
                                >
                                  <div className="layer-left-info">
                                    <span
                                      className="layer-color-dot"
                                      style={{
                                        backgroundColor: dotColor,
                                        boxShadow: isChecked ? `0 0 7px ${dotColor}` : 'none'
                                      }}
                                    />
                                    <span className="layer-name-text" title={layer.title}>
                                      {layer.title}
                                    </span>
                                    {config?.showUnavailableTag !== false && isUnavail && (
                                      <span className="layer-unavailable-tag" title="Esta capa no está disponible en el mapa 2D, solo en la escena 3D">
                                        No disponible 2D
                                      </span>
                                    )}
                                  </div>

                                  <div
                                    className={`calcite-box ${isChecked ? 'is-checked' : ''}`}
                                    style={{ pointerEvents: 'none' }}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" style={{ pointerEvents: 'none' }}>
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Widget
