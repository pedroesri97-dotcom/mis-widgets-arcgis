/**
 * ============================================================================
 * PANEL DE CONFIGURACIÓN: WIDGET DE CAPAS TEMÁTICAS BOGOTÁ
 * ============================================================================
 * 
 * Componente de configuración para el entorno de edición de ArcGIS Experience Builder.
 * Proporciona una interfaz visual intuitiva, siguiendo los estándares nativos de Calcite
 * y Experience Builder.
 * 
 * CAPACIDADES PRINCIPALES:
 * 1. Selección Múltiple de Mapas y Escenas: Vincula tanto el widget de Mapa 2D como
 *    el widget de Escena 3D presentes en la aplicación.
 * 2. Gestión Integral de Capas y Categorías:
 *    - Reordenamiento ascendente/descendente de capas.
 *    - Eliminación de cualquier capa (incluidas las predeterminadas).
 *    - Creación de nuevas capas personalizadas asociándolas a subgrupos.
 *    - Ajuste de títulos, nombres en mapa 2D, nombres en escena 3D y colores distintivos.
 * 3. Detección Automática de Capas en Vivo:
 *    - Escanea el entorno para ofrecer sugerencias desplegables de nombres de capa reales.
 *    - Comparación optimizada de arreglos para evitar re-renderizados continuos.
 * 4. Seguridad de Datos:
 *    - No almacena contraseñas ni cadenas de conexión.
 *    - La persistencia se realiza bajo el esquema inmutable nativo de Experience Builder.
 */

import { React, getAppStore, Immutable } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, Button, Switch } from 'jimu-ui'
import { MapViewManager } from 'jimu-arcgis'
import type { IMConfig, LayerCategoryConfig, LayerItemConfig } from '../config'

const { useState, useEffect, useMemo, useCallback } = React

// Estructura canónica oficial para mapas 2D y escenas 3D
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

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('cat-base')
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null)
  const [showAddLayer, setShowAddLayer] = useState<boolean>(false)
  const [manualWidgetId, setManualWidgetId] = useState<string>('')

  // Capas detectadas en tiempo real de 2D y 3D
  const [detected2D, setDetected2D] = useState<string[]>([])
  const [detected3D, setDetected3D] = useState<string[]>([])

  // Campos para agregar nueva capa
  const [newTitle, setNewTitle] = useState<string>('')
  const [newMapTitle, setNewMapTitle] = useState<string>('')
  const [newSceneTitle, setNewSceneTitle] = useState<string>('')
  const [newGroup, setNewGroup] = useState<string>('')
  const [newColor, setNewColor] = useState<string>('#00e5ff')

  const config = props.config

  // Detectar todos los widgets de tipo mapa/escena en la aplicación
  const availableMapWidgets = useMemo(() => {
    try {
      const appState = getAppStore().getState()
      const widgets = appState.appConfig?.widgets || {}
      return Object.values(widgets).filter((w: any) => {
        const uri = String(w?.uri || '').toLowerCase()
        return uri.includes('arcgis-map') || uri.includes('map') || uri.includes('scene')
      }) as any[]
    } catch (e) {
      return []
    }
  }, [])

  // Lista normalizada de IDs de mapa actualmente seleccionados
  const currentMapIds: string[] = useMemo(() => {
    const raw = props.useMapWidgetIds
    if (!raw) return []
    if (typeof raw === 'string') return [raw]
    return raw.asMutable ? raw.asMutable() : Array.from(raw)
  }, [props.useMapWidgetIds])

  // Consolidar todos los widgets de mapa/escena disponibles (de appConfig, MapViewManager y configurados)
  const allDetectedMapWidgets = useMemo(() => {
    const map = new Map<string, { id: string; label: string; type?: string }>()

    availableMapWidgets.forEach((w) => {
      map.set(w.id, {
        id: w.id,
        label: w.label || w.id,
        type: String(w?.uri || '').includes('scene') ? 'Escena 3D' : 'Mapa / Escena'
      })
    })

    try {
      const mvm = MapViewManager.getInstance()
      const allViews = mvm?.getAllJimuMapViews ? mvm.getAllJimuMapViews() : (mvm?.getAllJimuMapView ? mvm.getAllJimuMapView() : {})
      const list = Array.isArray(allViews) ? allViews : Object.values(allViews || {})
      list.forEach((jmv: any) => {
        const mwId = jmv?.mapWidgetId
        if (mwId && !map.has(mwId)) {
          map.set(mwId, {
            id: mwId,
            label: `Widget (${mwId})`,
            type: jmv?.view?.type === '3d' ? 'Escena 3D' : 'Mapa 2D'
          })
        }
      })
    } catch (e) {}

    currentMapIds.forEach((id) => {
      if (!map.has(id)) {
        map.set(id, {
          id: id,
          label: `Widget (${id})`,
          type: 'Mapa / Escena'
        })
      }
    })

    return Array.from(map.values())
  }, [availableMapWidgets, currentMapIds])

  // Escanear todas las capas 2D y 3D disponibles en la app
  // REGLA: Como 2D y 3D apuntan al mismo servicio GIS subyacente,
  // todas las capas existentes en 2D están disponibles también en 3D
  const scanLayers = useCallback(() => {
    const set2D = new Set<string>()
    const set3D = new Set<string>()

    // 1. Leer desde sessionStorage y window (broadcasted por widget.tsx)
    try {
      if (typeof sessionStorage !== 'undefined') {
        const s2D = sessionStorage.getItem('__exb_detected_2d_layers__')
        if (s2D) {
          try {
            JSON.parse(s2D).forEach((t: string) => t && set2D.add(t.trim()))
          } catch (e) {}
        }
        const s3D = sessionStorage.getItem('__exb_detected_3d_layers__')
        if (s3D) {
          try {
            JSON.parse(s3D).forEach((t: string) => t && set3D.add(t.trim()))
          } catch (e) {}
        }
      }

      const w = typeof window !== 'undefined' ? (window as any) : {}
      const topW = (w.top as any) || {}
      const parW = (w.parent as any) || {}

      const win2D = w.__exb_detected_2d_layers__ || topW.__exb_detected_2d_layers__ || parW.__exb_detected_2d_layers__ || []
      if (Array.isArray(win2D)) win2D.forEach((t: string) => t && set2D.add(t.trim()))

      const win3D = w.__exb_detected_3d_layers__ || topW.__exb_detected_3d_layers__ || parW.__exb_detected_3d_layers__ || []
      if (Array.isArray(win3D)) win3D.forEach((t: string) => t && set3D.add(t.trim()))

      const winAll = w.__exb_detected_map_layers__ || topW.__exb_detected_map_layers__ || parW.__exb_detected_map_layers__ || []
      if (Array.isArray(winAll)) {
        winAll.forEach((t: string) => {
          if (t) {
            set2D.add(t.trim())
            set3D.add(t.trim())
          }
        })
      }
    } catch (e) {}

    // 2. MapViewManager instancias en vivo
    try {
      const mvm = MapViewManager.getInstance()
      const allViews = mvm?.getAllJimuMapViews ? mvm.getAllJimuMapViews() : (mvm?.getAllJimuMapView ? mvm.getAllJimuMapView() : {})
      const list = Array.isArray(allViews) ? allViews : Object.values(allViews || {})
      list.forEach((jmv: any) => {
          const isScene = jmv?.view?.type === '3d'
          const map = jmv?.view?.map
          if (map) {
            const allL = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])
            allL.forEach((l: any) => {
              if (l?.title) {
                const t = l.title.trim()
                if (isScene) set3D.add(t)
                else {
                  set2D.add(t)
                  set3D.add(t) // Todo lo que está en 2D está en 3D
                }
              }
              if (l?.sublayers) {
                const subs = l.sublayers.toArray ? l.sublayers.toArray() : (Array.isArray(l.sublayers) ? l.sublayers : [])
                subs.forEach((sub: any) => {
                  if (sub?.title) {
                    const st = sub.title.trim()
                    if (isScene) set3D.add(st)
                    else {
                      set2D.add(st)
                      set3D.add(st) // Todo lo que está en 2D está en 3D
                    }
                  }
                })
              }
            })
          }
        })
    } catch (e) {}

    // 3. Incluir las capas canónicas preconfiguradas para asegurar opciones inmediatas
    DEFAULT_CATEGORIES.forEach((cat) => {
      cat.layers?.forEach((l) => {
        if (l.mapLayerTitle) {
          set2D.add(l.mapLayerTitle.trim())
          set3D.add(l.mapLayerTitle.trim())
        }
        if (l.sceneLayerTitle) {
          set3D.add(l.sceneLayerTitle.trim())
          set2D.add(l.sceneLayerTitle.trim())
        }
        if (l.title) {
          set2D.add(l.title.trim())
          set3D.add(l.title.trim())
        }
      })
    })

    // REGLA: Como 2D y 3D apuntan al mismo servicio subyacente,
    // todas las capas que están en 2D están disponibles en 3D
    set2D.forEach((t) => set3D.add(t))

    const sorted2D = Array.from(set2D).filter(Boolean).sort((a, b) => a.localeCompare(b))
    const sorted3D = Array.from(set3D).filter(Boolean).sort((a, b) => a.localeCompare(b))

    // Evitar re-renderizados innecesarios comprobando igualdad antes de actualizar estado
    setDetected2D((prev) => {
      if (prev.length === sorted2D.length && prev.every((v, i) => v === sorted2D[i])) return prev
      return sorted2D
    })
    setDetected3D((prev) => {
      if (prev.length === sorted3D.length && prev.every((v, i) => v === sorted3D[i])) return prev
      return sorted3D
    })
  }, [])

  useEffect(() => {
    let scanCount = 0
    let timerId: any = null

    const runScan = () => {
      scanLayers()
      scanCount++
      const nextDelay = scanCount > 3 ? 8000 : 2000
      timerId = setTimeout(runScan, nextDelay)
    }

    runScan()
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [scanLayers])

  // Garantizar categorías canónicas completas con las capas configuradas
  const categories: LayerCategoryConfig[] = useMemo(() => {
    const rawCategories: LayerCategoryConfig[] = (config?.categories as any) || []
    if (!rawCategories || rawCategories.length === 0) {
      return DEFAULT_CATEGORIES
    }

    const sanitized = rawCategories.map((cat) => {
      const cleanLayers = (cat.layers || [])
        .filter((l) => l && !String(l.title || '').toLowerCase().includes('wms'))
        .map((l) => ({
          ...l,
          visibleByDefault: false
        }))

      return {
        ...cat,
        title: (cat.title || '').replace(/^\d+\.\s*/, ''),
        badge: `${cleanLayers.length} CAPAS`,
        layers: cleanLayers
      }
    })

    return sanitized
  }, [config?.categories])

  // Actualizar propiedad general del config
  const updateConfigProp = (prop: string, val: any) => {
    const currentConfig = props.config || Immutable({})
    props.onSettingChange({
      id: props.id,
      config: currentConfig.set(prop, val)
    })
  }

  // Vincular selección de mapas/escenas (permite más de un mapa o escena)
  const onMapSelected = (newIds: string[]) => {
    if (!newIds || newIds.length === 0) {
      props.onSettingChange({
        id: props.id,
        useMapWidgetIds: []
      })
      return
    }
    // Combinar con los ya seleccionados para permitir múltiples mapas/escenas
    const merged = Array.from(new Set([...currentMapIds, ...newIds]))
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: merged
    })
  }

  // Conmutar un widget de mapa/escena específico en useMapWidgetIds
  const handleToggleMapWidget = (targetId: string, checked: boolean) => {
    let next: string[]
    if (checked) {
      next = Array.from(new Set([...currentMapIds, targetId]))
    } else {
      next = currentMapIds.filter((id) => id !== targetId)
    }
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: next
    })
  }

  // Categoría activa actualmente
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCatId) || categories[0]
  }, [categories, selectedCatId])

  // Grupos existentes en la categoría activa
  const existingGroups = useMemo(() => {
    if (!selectedCategory?.layers) return []
    const groups = new Set<string>()
    selectedCategory.layers.forEach((l) => {
      if (l.group && l.group.trim()) groups.add(l.group.trim())
    })
    return Array.from(groups).sort((a, b) => a.localeCompare(b))
  }, [selectedCategory])

  // Actualizar una propiedad de una capa específica
  const updateLayerProp = (catId: string, layerId: string, field: keyof LayerItemConfig, val: any) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id !== catId) return cat
      const updatedLayers = (cat.layers || []).map((layer) => {
        if (layer.id !== layerId) return layer
        return { ...layer, [field]: val }
      })
      return { ...cat, layers: updatedLayers }
    })
    updateConfigProp('categories', updatedCategories)
  }

  // Eliminar una capa
  const deleteLayer = (catId: string, layerId: string) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id !== catId) return cat
      const filtered = (cat.layers || []).filter((l) => l.id !== layerId)
      return {
        ...cat,
        badge: `${filtered.length} CAPAS`,
        layers: filtered
      }
    })
    updateConfigProp('categories', updatedCategories)
  }

  // Mover capa arriba o abajo
  const moveLayer = (catId: string, layerId: string, direction: 'up' | 'down') => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id !== catId) return cat
      const list = [...(cat.layers || [])]
      const idx = list.findIndex((l) => l.id === layerId)
      if (idx === -1) return cat
      if (direction === 'up' && idx > 0) {
        const temp = list[idx - 1]
        list[idx - 1] = list[idx]
        list[idx] = temp
      } else if (direction === 'down' && idx < list.length - 1) {
        const temp = list[idx + 1]
        list[idx + 1] = list[idx]
        list[idx] = temp
      }
      return { ...cat, layers: list }
    })
    updateConfigProp('categories', updatedCategories)
  }

  // Agregar nueva capa a la categoría actual
  const addLayer = () => {
    if (!newTitle.trim() || !selectedCategory) return
    const id = `${selectedCategory.id}-custom-${Date.now()}`
    const newLayer: LayerItemConfig = {
      id,
      title: newTitle.trim(),
      mapLayerTitle: newMapTitle.trim() || newTitle.trim(),
      sceneLayerTitle: newSceneTitle.trim() || newMapTitle.trim() || newTitle.trim(),
      group: newGroup.trim() || undefined,
      color: newColor || '#00e5ff',
      visibleByDefault: false
    }

    const updatedCategories = categories.map((cat) => {
      if (cat.id !== selectedCategory.id) return cat
      const currentList = cat.layers || []
      const nextList = [...currentList, newLayer]
      return {
        ...cat,
        badge: `${nextList.length} CAPAS`,
        layers: nextList
      }
    })

    updateConfigProp('categories', updatedCategories)
    setNewTitle('')
    setNewMapTitle('')
    setNewSceneTitle('')
    setNewGroup('')
    setShowAddLayer(false)
  }

  // Restaurar categorías canónicas
  const resetToDefault = () => {
    if (typeof window !== 'undefined' && window.confirm('¿Deseas restaurar todas las categorías y capas a la configuración predeterminada?')) {
      updateConfigProp('categories', DEFAULT_CATEGORIES)
      setEditingLayerId(null)
      setShowAddLayer(false)
    }
  }

  return (
    <div className="widget-setting-capas-tematicas jimu-widget-setting" style={{ height: '100%', overflowY: 'auto' }}>
      {/* SECCIÓN 1: MAPA Y ESCENA */}
      <SettingSection title="Mapa y Escena" collapsible defaultIsOpen>
        <SettingRow label="Conectar mapa o escena" flow="wrap">
          <MapWidgetSelector
            onSelect={onMapSelected}
            useMapWidgetIds={props.useMapWidgetIds}
          />
        </SettingRow>

        {/* Lista de selección múltiple con Switch para activar más de un mapa o escena */}
        {allDetectedMapWidgets.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', fontWeight: 600 }}>
              Seleccionar mapas y escenas disponibles:
            </div>
            {allDetectedMapWidgets.map((mw) => {
              const isChecked = currentMapIds.includes(mw.id)
              return (
                <SettingRow key={mw.id} label={`${mw.label} (${mw.id})`}>
                  <Switch
                    checked={isChecked}
                    onChange={(e) => handleToggleMapWidget(mw.id, e.target.checked)}
                  />
                </SettingRow>
              )
            })}
          </div>
        )}

        {/* Conexión manual por ID */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '10.5px', color: '#9ca3af', marginBottom: '3px' }}>
            Conectar manualmente por ID:
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <TextInput
              size="sm"
              placeholder="Ej: widget_6 o widget_7"
              value={manualWidgetId}
              onChange={(e) => setManualWidgetId(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              size="sm"
              type="primary"
              disabled={!manualWidgetId.trim() || currentMapIds.includes(manualWidgetId.trim())}
              onClick={() => {
                const trimmed = manualWidgetId.trim()
                if (trimmed) {
                  handleToggleMapWidget(trimmed, true)
                  setManualWidgetId('')
                }
              }}
              style={{ fontSize: '11px' }}
            >
              + Conectar
            </Button>
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 2: CATEGORÍAS Y CAPAS */}
      <SettingSection title="Categorías y Capas" collapsible defaultIsOpen>
        {/* Selector de categoría */}
        <SettingRow label="Categoría" flow="wrap">
          <select
            className="jimu-input"
            value={selectedCategory?.id || ''}
            onChange={(e) => {
              setSelectedCatId(e.target.value)
              setEditingLayerId(null)
              setShowAddLayer(false)
            }}
            style={{ width: '100%', fontSize: '12px' }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </SettingRow>

        {selectedCategory && (
          <div style={{ marginTop: '8px' }}>
            {/* Edición de la categoría */}
            <SettingRow label="Nombre categoría" flow="wrap">
              <TextInput
                size="sm"
                value={selectedCategory.title}
                onChange={(e) => {
                  const next = categories.map((c) => (c.id === selectedCategory.id ? { ...c, title: e.target.value } : c))
                  updateConfigProp('categories', next)
                }}
                style={{ width: '100%' }}
              />
            </SettingRow>

            <SettingRow label="Etiqueta / Badge">
              <TextInput
                size="sm"
                value={selectedCategory.badge || ''}
                onChange={(e) => {
                  const next = categories.map((c) => (c.id === selectedCategory.id ? { ...c, badge: e.target.value } : c))
                  updateConfigProp('categories', next)
                }}
                style={{ width: '120px' }}
              />
            </SettingRow>

            {/* Listado de capas en esta categoría */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>
                  Capas ({selectedCategory.layers?.length || 0}):
                </span>
                <Button
                  size="sm"
                  type="primary"
                  onClick={() => {
                    setShowAddLayer(!showAddLayer)
                    setEditingLayerId(null)
                  }}
                  style={{ fontSize: '10.5px', padding: '2px 8px' }}
                >
                  {showAddLayer ? 'Cerrar' : '+ Agregar Capa'}
                </Button>
              </div>

              {/* Formulario para agregar nueva capa */}
              {showAddLayer && (
                <div
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    background: '#232323',
                    borderRadius: '4px',
                    border: '1px solid #3d3d3d',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>Nueva Capa</div>

                  <div>
                    <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                      Nombre visible en el widget:
                    </label>
                    <TextInput
                      size="sm"
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value)
                        if (!newMapTitle) setNewMapTitle(e.target.value)
                        if (!newSceneTitle) setNewSceneTitle(e.target.value)
                      }}
                      placeholder="Ej: Canalización"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                      Capa en Mapa (2D):
                    </label>
                    <select
                      className="jimu-input"
                      value={newMapTitle}
                      onChange={(e) => setNewMapTitle(e.target.value)}
                      style={{ width: '100%', fontSize: '11px', marginBottom: '4px' }}
                    >
                      <option value="">-- Mismo que nombre visible ({newTitle || 'Capa'}) --</option>
                      {detected2D.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <TextInput
                      size="sm"
                      value={newMapTitle}
                      onChange={(e) => setNewMapTitle(e.target.value)}
                      placeholder="O escribe el nombre exacto de la capa en 2D"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                      Capa en Escena (3D):
                    </label>
                    <select
                      className="jimu-input"
                      value={newSceneTitle}
                      onChange={(e) => setNewSceneTitle(e.target.value)}
                      style={{ width: '100%', fontSize: '11px', marginBottom: '4px' }}
                    >
                      <option value="">-- Igual al servicio 2D ({newMapTitle || newTitle || 'Capa'}) --</option>
                      {detected3D.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <TextInput
                      size="sm"
                      value={newSceneTitle}
                      onChange={(e) => setNewSceneTitle(e.target.value)}
                      placeholder="O escribe el nombre exacto de la capa en 3D"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                      Grupo / Subgrupo:
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select
                        className="jimu-input"
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                        style={{ flex: 1, fontSize: '11px' }}
                      >
                        <option value="">Sin grupo (Directa)</option>
                        {existingGroups.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <TextInput
                        size="sm"
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                        placeholder="O nuevo grupo"
                        style={{ width: '120px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                      Color de simbología:
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        style={{ width: '28px', height: '24px', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: 0 }}
                      />
                      <TextInput size="sm" value={newColor} onChange={(e) => setNewColor(e.target.value)} style={{ width: '90px' }} />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    type="primary"
                    onClick={addLayer}
                    disabled={!newTitle.trim()}
                    style={{ marginTop: '4px', fontSize: '11px' }}
                  >
                    Guardar Capa
                  </Button>
                </div>
              )}

              {/* Lista de capas existentes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {(selectedCategory.layers || []).map((layer) => {
                  const isEditing = editingLayerId === layer.id
                  return (
                    <div
                      key={layer.id}
                      style={{
                        background: isEditing ? '#262626' : '#1f1f1f',
                        border: isEditing ? '1px solid #00b4d8' : '1px solid #333333',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Fila resumen de la capa */}
                      <div
                        onClick={() => {
                          setEditingLayerId(isEditing ? null : layer.id)
                          setShowAddLayer(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 9px',
                          cursor: 'pointer',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
                          <span
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              backgroundColor: layer.color || '#00e5ff',
                              flexShrink: 0
                            }}
                          />
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={layer.title}
                          >
                            {layer.title}
                          </span>
                          {layer.group && (
                            <span
                              style={{
                                fontSize: '9px',
                                background: '#142a3e',
                                color: '#38bdf8',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}
                            >
                              {layer.group}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <span style={{ fontSize: '9px', color: '#9ca3af' }}>{isEditing ? '▲' : '▼'}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveLayer(selectedCategory.id, layer.id, 'up')
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0 2px' }}
                            title="Subir"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveLayer(selectedCategory.id, layer.id, 'down')
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0 2px' }}
                            title="Bajar"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteLayer(selectedCategory.id, layer.id)
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 3px' }}
                            title="Eliminar capa"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Formulario de edición al expandir */}
                      {isEditing && (
                        <div
                          style={{
                            padding: '9px 10px',
                            background: '#1a1a1a',
                            borderTop: '1px solid #333',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '7px'
                          }}
                        >
                          <div>
                            <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                              Nombre visible:
                            </label>
                            <TextInput
                              size="sm"
                              value={layer.title}
                              onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                              Capa en Mapa (2D):
                            </label>
                            <select
                              className="jimu-input"
                              value={layer.mapLayerTitle || ''}
                              onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'mapLayerTitle', e.target.value)}
                              style={{ width: '100%', fontSize: '11px', marginBottom: '4px' }}
                            >
                              <option value="">-- Mismo que nombre visible ({layer.title}) --</option>
                              {layer.mapLayerTitle && !detected2D.includes(layer.mapLayerTitle) && (
                                <option value={layer.mapLayerTitle}>{layer.mapLayerTitle}</option>
                              )}
                              {detected2D.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <TextInput
                              size="sm"
                              value={layer.mapLayerTitle || ''}
                              onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'mapLayerTitle', e.target.value)}
                              placeholder="O escribe el nombre exacto de la capa en 2D"
                              style={{ width: '100%' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                              Capa en Escena (3D):
                            </label>
                            <select
                              className="jimu-input"
                              value={layer.sceneLayerTitle || ''}
                              onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'sceneLayerTitle', e.target.value)}
                              style={{ width: '100%', fontSize: '11px', marginBottom: '4px' }}
                            >
                              <option value="">-- Igual al servicio 2D ({layer.mapLayerTitle || layer.title}) --</option>
                              {layer.sceneLayerTitle && !detected3D.includes(layer.sceneLayerTitle) && (
                                <option value={layer.sceneLayerTitle}>{layer.sceneLayerTitle}</option>
                              )}
                              {detected3D.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <TextInput
                              size="sm"
                              value={layer.sceneLayerTitle || ''}
                              onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'sceneLayerTitle', e.target.value)}
                              placeholder="O escribe el nombre exacto de la capa en 3D"
                              style={{ width: '100%' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                              Grupo / Subgrupo:
                            </label>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <select
                                className="jimu-input"
                                value={layer.group || ''}
                                onChange={(e) =>
                                  updateLayerProp(selectedCategory.id, layer.id, 'group', e.target.value.trim() || undefined)
                                }
                                style={{ flex: 1, fontSize: '11px' }}
                              >
                                <option value="">Sin grupo (Directa)</option>
                                {existingGroups.map((g) => (
                                  <option key={g} value={g}>
                                    {g}
                                  </option>
                                ))}
                              </select>
                              <TextInput
                                size="sm"
                                value={layer.group || ''}
                                onChange={(e) =>
                                  updateLayerProp(selectedCategory.id, layer.id, 'group', e.target.value.trim() || undefined)
                                }
                                placeholder="O nuevo grupo"
                                style={{ width: '120px' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>
                              Color de simbología:
                            </label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={layer.color || '#00e5ff'}
                                onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'color', e.target.value)}
                                style={{
                                  width: '28px',
                                  height: '24px',
                                  border: 'none',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              />
                              <TextInput
                                size="sm"
                                value={layer.color || '#00e5ff'}
                                onChange={(e) => updateLayerProp(selectedCategory.id, layer.id, 'color', e.target.value)}
                                style={{ width: '90px' }}
                              />
                              <div style={{ flex: 1 }} />
                              <Button
                                size="sm"
                                type="default"
                                onClick={() => setEditingLayerId(null)}
                                style={{ fontSize: '10.5px' }}
                              >
                                Listo
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Botón para restaurar configuración */}
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <Button
                  size="sm"
                  type="default"
                  onClick={resetToDefault}
                  style={{ fontSize: '11px', color: '#f59e0b', width: '100%' }}
                >
                  Restaurar configuración predeterminada
                </Button>
              </div>
            </div>
          </div>
        )}
      </SettingSection>

      {/* SECCIÓN 3: OPCIONES Y HERRAMIENTAS */}
      <SettingSection title="Opciones" collapsible>
        <SettingRow label="Todas las capas inician apagadas">
          <Switch
            checked={config?.allOffByDefault !== false}
            onChange={(e) => updateConfigProp('allOffByDefault', e.target.checked)}
          />
        </SettingRow>

        <SettingRow label="Reloj en vivo (fecha y hora)">
          <Switch
            checked={config?.showClock !== false}
            onChange={(e) => updateConfigProp('showClock', e.target.checked)}
          />
        </SettingRow>

        <SettingRow label="Etiqueta 'No disponible 2D'">
          <Switch
            checked={config?.showUnavailableTag !== false}
            onChange={(e) => updateConfigProp('showUnavailableTag', e.target.checked)}
          />
        </SettingRow>

        <SettingRow label="Conmutar subgrupos completos">
          <Switch
            checked={config?.allowGroupToggle !== false}
            onChange={(e) => updateConfigProp('allowGroupToggle', e.target.checked)}
          />
        </SettingRow>

        <SettingRow flow="wrap" label="Subtítulo de cabecera">
          <TextInput
            size="sm"
            value={config?.headerSubtitle || ''}
            onChange={(e) => updateConfigProp('headerSubtitle', e.target.value)}
            placeholder="EXPLORACIÓN TERRITORIAL"
            style={{ width: '100%' }}
          />
        </SettingRow>

        <SettingRow flow="wrap" label="Título principal">
          <TextInput
            size="sm"
            value={config?.headerTitle || ''}
            onChange={(e) => updateConfigProp('headerTitle', e.target.value)}
            placeholder="Capas Temáticas"
            style={{ width: '100%' }}
          />
        </SettingRow>
      </SettingSection>
    </div>
  )
}

export default Setting
