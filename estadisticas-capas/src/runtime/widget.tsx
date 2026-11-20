import { React, ReactDOM, type AllWidgetProps, getAppStore } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView, MapViewManager } from 'jimu-arcgis'
import type { IMConfig, LayerStatCardConfig, InfoModalConfig, ExtraModalStat } from '../config'
import { styleText } from './style'

const { useState, useEffect, useMemo, useCallback, useRef } = React

// Formateador con puntos de miles (es-CO: ej. 56.689 o 34,2)
const formatNumber = (num: number, decimals: number = 0): string => {
  if (isNaN(num) || num === null || num === undefined) return '0'
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

// Limpieza de cadenas para comparación flexible sin importar espacios, guiones o tildes
const cleanStr = (str: any): string => {
  if (!str && str !== 0) return ''
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

// Limpieza tolerante a 3D (elimina sufijos de escena/3D/2D y prefijos numéricos)
const clean3DStr = (str: any): string => {
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

// Identificar si el trigger corresponde a todas las capas activas (recuento global)
const isAllLayersTrigger = (trigger: string): boolean => {
  if (!trigger) return false
  if (trigger === '__all_layers__') return true
  const c = cleanStr(trigger)
  return (
    c === 'all' ||
    c === 'todas' ||
    c.includes('todaslascapas') ||
    c.includes('todaslascapasactivas') ||
    c.includes('recuentototal') ||
    c.includes('recuentoglobal')
  )
}

interface ThematicItem {
  id: string
  title: string
  mapLayerTitle: string
  sceneLayerTitle: string
  group: string
  categoryTitle: string
}

export default function Widget(props: AllWidgetProps<IMConfig>) {
  const { config, useMapWidgetIds } = props
  const [allJimuMapViews, setAllJimuMapViews] = useState<{ [viewId: string]: JimuMapView }>({})
  const [activeJimuMapView, setActiveJimuMapView] = useState<JimuMapView | null>(null)
  const [activeDataVersion, setActiveDataVersion] = useState<number>(0)
  const [dynamicValues, setDynamicValues] = useState<{ [cardId: string]: string }>({})
  const [activeModalCard, setActiveModalCard] = useState<LayerStatCardConfig | null>(null)
  const valuesCache = useRef<{ [cacheKey: string]: string }>({})
  const inFlightRef = useRef<Set<string>>(new Set())

  // Manejadores de vistas JimuMapViewComponent (soporta 2D MapView y 3D SceneView)
  const handleViewsCreate = useCallback((views: { [viewId: string]: JimuMapView }) => {
    if (views) setAllJimuMapViews((prev) => ({ ...prev, ...views }))
  }, [])

  const handleViewsChange = useCallback((views: { [viewId: string]: JimuMapView }) => {
    if (views) setAllJimuMapViews((prev) => ({ ...prev, ...views }))
  }, [])

  const handleActiveViewChange = useCallback((jmv: JimuMapView) => {
    if (jmv) {
      setAllJimuMapViews((prev) => ({ ...prev, [jmv.id]: jmv }))
      setActiveJimuMapView(jmv)
    }
  }, [])

  // Obtener todas las instancias de vistas conectadas (2D MapView y 3D SceneView)
  const getAllMapViews = useCallback((): JimuMapView[] => {
    const list: JimuMapView[] = []
    const seen = new Set<string>()

    const addView = (v: any) => {
      if (v?.view?.map && v.id && !seen.has(v.id)) {
        seen.add(v.id)
        list.push(v)
      }
    }

    try {
      const mgr = MapViewManager.getInstance()
      const all = mgr?.getAllJimuMapView ? mgr.getAllJimuMapView() : []
      const arr = Array.isArray(all) ? all : Object.values(all || {})
      arr.forEach(addView)
    } catch (e) {}

    Object.values(allJimuMapViews).forEach(addView)
    if (activeJimuMapView) addView(activeJimuMapView)

    try {
      if (typeof window !== 'undefined') {
        const winViews = (window as any).__exb_jimu_map_views__ || (window.top as any)?.__exb_jimu_map_views__
        if (winViews) {
          Object.values(winViews).forEach(addView)
        }
      }
    } catch (e) {}

    return list
  }, [allJimuMapViews, activeJimuMapView])

  // Obtener todos los mapas y escenas operacionales (WebMap 2D y WebScene 3D)
  const getAllMaps = useCallback((): any[] => {
    const maps: any[] = []
    const views = getAllMapViews()
    views.forEach((v) => {
      const m = v?.view?.map
      if (m && !maps.includes(m)) maps.push(m)
    })
    return maps
  }, [getAllMapViews])

  // Obtener el catálogo canónico de capas temáticas del aplicativo
  const getThematicCatalog = useCallback((): ThematicItem[] => {
    const catalog: ThematicItem[] = []
    try {
      const appState = getAppStore().getState()
      const widgets = appState?.appConfig?.widgets || {}
      Object.values(widgets).forEach((w: any) => {
        if (w.uri?.includes('capas-tematicas') && w.config?.categories) {
          w.config.categories.forEach((cat: any) => {
            cat.layers?.forEach((l: any) => {
              if (l && (l.title || l.id)) {
                catalog.push({
                  id: String(l.id || ''),
                  title: String(l.title || ''),
                  mapLayerTitle: String(l.mapLayerTitle || l.title || ''),
                  sceneLayerTitle: String(l.sceneLayerTitle || l.title || ''),
                  group: String(l.group || ''),
                  categoryTitle: String(cat.title || '')
                })
              }
            })
          })
        }
      })
    } catch (e) {}
    return catalog
  }, [])

  // Obtener estado en vivo de capas activas desde capas-temáticas (independiente de si la vista es 2D o 3D)
  const getActiveLayersPayload = useCallback(() => {
    let payload: any = null
    try {
      if (typeof window !== 'undefined') {
        payload = (window as any).__exb_active_layers_data__ || (window.top as any)?.__exb_active_layers_data__
      }
      if (!payload && typeof sessionStorage !== 'undefined') {
        const stored = sessionStorage.getItem('__exb_active_layers_data__')
        if (stored) payload = JSON.parse(stored)
      }
    } catch (e) {}
    return payload
  }, [])

  // Escuchar cambios de activación emitidos por el panel de capas temáticas o mapas
  useEffect(() => {
    const handleActiveChange = () => {
      setActiveDataVersion((v) => v + 1)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('exb_active_layers_change', handleActiveChange)
      if (window.top && window.top !== window) {
        window.top.addEventListener('exb_active_layers_change', handleActiveChange)
      }
    }

    const timer = setInterval(() => {
      setActiveDataVersion((v) => v + 1)
    }, 1200)

    return () => {
      clearInterval(timer)
      if (typeof window !== 'undefined') {
        window.removeEventListener('exb_active_layers_change', handleActiveChange)
        if (window.top && window.top !== window) {
          window.top.removeEventListener('exb_active_layers_change', handleActiveChange)
        }
      }
    }
  }, [])

  // Buscar coincidencia de una tarjeta contra el catálogo de capas temáticas
  const findMatchingThematicItem = useCallback((trigger: string, catalog: ThematicItem[]): ThematicItem | null => {
    if (!trigger) return null
    const cTrigger = cleanStr(trigger)
    const c3DTrigger = clean3DStr(trigger)

    for (const item of catalog) {
      if (cleanStr(item.id) === cTrigger) return item
      if (cleanStr(item.title) === cTrigger) return item
      if (cleanStr(item.mapLayerTitle) === cTrigger) return item
      if (cleanStr(item.sceneLayerTitle) === cTrigger) return item
    }

    if (c3DTrigger) {
      for (const item of catalog) {
        if (clean3DStr(item.title) === c3DTrigger) return item
        if (clean3DStr(item.mapLayerTitle) === c3DTrigger) return item
        if (clean3DStr(item.sceneLayerTitle) === c3DTrigger) return item
      }
    }

    if (cTrigger.length >= 4) {
      for (const item of catalog) {
        const cTitle = cleanStr(item.title)
        const cMap = cleanStr(item.mapLayerTitle)
        const cScene = cleanStr(item.sceneLayerTitle)
        if (cTitle.includes(cTrigger) || cTrigger.includes(cTitle)) return item
        if (cMap.includes(cTrigger) || cTrigger.includes(cMap)) return item
        if (cScene.includes(cTrigger) || cTrigger.includes(cScene)) return item
      }
    }

    return null
  }, [])

  // Determinar si una tarjeta debe estar activa (100% INDEPENDIENTE DE LA VISTA 2D O 3D)
  const isCardActive = useCallback((card: LayerStatCardConfig): boolean => {
    if (!card || !card.layerTrigger) return false
    const trigger = card.layerTrigger
    const isAll = isAllLayersTrigger(trigger)

    const payload = getActiveLayersPayload()
    const visMap: { [id: string]: boolean } = payload?.visibilityMap || {}
    const activeIds: string[] = payload?.activeIds || []
    const activeTitles: string[] = [
      ...(payload?.activeTitles || []),
      ...(payload?.activeMapTitles || []),
      ...(payload?.activeSceneTitles || [])
    ]

    const visibleLayerTitles = new Set<string>()
    const maps = getAllMaps()
    maps.forEach((map) => {
      try {
        const allL = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])
        allL.forEach((l: any) => {
          if (!l || l.isBasemap) return
          if (l.visible && (l.title || l.id)) {
            visibleLayerTitles.add(String(l.title || l.id).trim())
          }
        })
      } catch (e) {}
    })

    const hasAnyActive =
      Object.values(visMap).some(Boolean) ||
      activeIds.length > 0 ||
      activeTitles.length > 0 ||
      visibleLayerTitles.size > 0

    if (isAll) {
      return hasAnyActive
    }

    const catalog = getThematicCatalog()
    const matchedItem = findMatchingThematicItem(trigger, catalog)

    if (matchedItem) {
      if (visMap[matchedItem.id] === true) return true
      if (activeIds.includes(matchedItem.id)) return true

      const cTitles = [cleanStr(matchedItem.title), cleanStr(matchedItem.mapLayerTitle), cleanStr(matchedItem.sceneLayerTitle)]
      for (const act of activeTitles) {
        const cAct = cleanStr(act)
        if (cTitles.includes(cAct)) return true
        if (clean3DStr(act) && (clean3DStr(matchedItem.title) === clean3DStr(act) || clean3DStr(matchedItem.sceneLayerTitle) === clean3DStr(act))) {
          return true
        }
      }

      for (const visTitle of Array.from(visibleLayerTitles)) {
        const cVis = cleanStr(visTitle)
        if (cTitles.includes(cVis)) return true
        if (clean3DStr(visTitle) && (clean3DStr(matchedItem.title) === clean3DStr(visTitle) || clean3DStr(matchedItem.sceneLayerTitle) === clean3DStr(visTitle))) {
          return true
        }
      }

      return false
    }

    const cTrigger = cleanStr(trigger)
    const c3DTrigger = clean3DStr(trigger)

    for (const act of activeTitles) {
      if (cleanStr(act) === cTrigger || (c3DTrigger && clean3DStr(act) === c3DTrigger)) return true
    }

    for (const vis of Array.from(visibleLayerTitles)) {
      if (cleanStr(vis) === cTrigger || (c3DTrigger && clean3DStr(vis) === c3DTrigger)) return true
    }

    return false
  }, [getActiveLayersPayload, getAllMaps, getThematicCatalog, findMatchingThematicItem])

  // Filtrar tarjetas activas
  const activeCards = useMemo(() => {
    const allCards: LayerStatCardConfig[] = (config?.cards as any) || []
    if (allCards.length === 0) return []
    return allCards.filter(isCardActive)
  }, [config?.cards, isCardActive, activeDataVersion])

  // Búsqueda de una capa a través de todos los mapas 2D y escenas 3D conectadas
  const findLayerAcrossMaps = useCallback((triggerName: string): any => {
    if (!triggerName) return null
    const catalog = getThematicCatalog()
    const matchedItem = findMatchingThematicItem(triggerName, catalog)

    const candidateNames = new Set<string>()
    candidateNames.add(triggerName)
    if (matchedItem) {
      if (matchedItem.title) candidateNames.add(matchedItem.title)
      if (matchedItem.mapLayerTitle) candidateNames.add(matchedItem.mapLayerTitle)
      if (matchedItem.sceneLayerTitle) candidateNames.add(matchedItem.sceneLayerTitle)
      if (matchedItem.id) candidateNames.add(matchedItem.id)
    }

    const cleanCandidates = Array.from(candidateNames).map(cleanStr).filter(Boolean)
    const clean3DCandidates = Array.from(candidateNames).map(clean3DStr).filter(Boolean)

    const maps = getAllMaps()
    const candidatesFound: any[] = []

    for (const map of maps) {
      const allL = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])

      const testLayer = (l: any) => {
        if (!l || l.isBasemap) return
        const t = cleanStr(l.title || l.id)
        const t3D = clean3DStr(l.title || l.id)

        if (cleanCandidates.includes(t) || (t3D && clean3DCandidates.includes(t3D))) {
          candidatesFound.push(l)
          return
        }

        if (l.layers && typeof l.layers.forEach === 'function') {
          const ch = l.layers.toArray ? l.layers.toArray() : (Array.isArray(l.layers) ? l.layers : [])
          ch.forEach(testLayer)
        }
        if (l.sublayers && typeof l.sublayers.forEach === 'function') {
          const subs = l.sublayers.toArray ? l.sublayers.toArray() : (Array.isArray(l.sublayers) ? l.sublayers : [])
          subs.forEach(testLayer)
        }
      }

      allL.forEach(testLayer)
    }

    if (candidatesFound.length === 0) {
      for (const map of maps) {
        const allL = map.allLayers ? map.allLayers.toArray() : []
        for (const l of allL) {
          if (!l || l.isBasemap) continue
          const t = cleanStr(l.title || l.id)
          for (const cand of cleanCandidates) {
            if (cand.length >= 4 && (t.includes(cand) || cand.includes(t))) {
              candidatesFound.push(l)
              break
            }
          }
        }
      }
    }

    if (candidatesFound.length === 0) return null

    // Si encontramos capas en 2D y 3D, priorizar la que tenga capacidad de consulta (FeatureLayer)
    const queryable = candidatesFound.find((l) => typeof l.queryFeatureCount === 'function' || typeof l.queryFeatures === 'function')
    return queryable || candidatesFound[0]
  }, [getAllMaps, getThematicCatalog, findMatchingThematicItem])

  // Cálculo de recuento de entidades para cualquier capa (2D o 3D)
  const queryCountForLayer = useCallback(async (layer: any): Promise<number> => {
    if (!layer) return 0
    if (typeof layer.load === 'function' && !layer.loaded) {
      try {
        await layer.load()
      } catch (e) {}
    }

    if (typeof layer.queryFeatureCount === 'function') {
      try {
        const q = layer.createQuery ? layer.createQuery() : {}
        if (!q.where) q.where = '1=1'
        const count = await layer.queryFeatureCount(q)
        if (typeof count === 'number' && !isNaN(count) && count >= 0) return count
      } catch (e) {
        try {
          const count = await layer.queryFeatureCount()
          if (typeof count === 'number' && !isNaN(count) && count >= 0) return count
        } catch (e2) {}
      }
    }

    if (typeof layer.queryFeatures === 'function') {
      try {
        const q = layer.createQuery ? layer.createQuery() : {}
        q.where = '1=1'
        q.returnGeometry = false
        const res = await layer.queryFeatures(q)
        if (res?.features && Array.isArray(res.features)) {
          return res.features.length
        }
      } catch (e) {}
    }

    if (layer.layers && typeof layer.layers.forEach === 'function') {
      const children = layer.layers.toArray ? layer.layers.toArray() : (Array.isArray(layer.layers) ? layer.layers : [])
      let total = 0
      for (const ch of children) {
        total += await queryCountForLayer(ch)
      }
      if (total > 0) return total
    }
    if (layer.sublayers && typeof layer.sublayers.forEach === 'function') {
      const subs = layer.sublayers.toArray ? layer.sublayers.toArray() : (Array.isArray(layer.sublayers) ? layer.sublayers : [])
      let total = 0
      for (const s of subs) {
        total += await queryCountForLayer(s)
      }
      if (total > 0) return total
    }

    if (layer.source && Array.isArray(layer.source)) {
      return layer.source.length
    }
    if (layer.graphics && Array.isArray(layer.graphics)) {
      return layer.graphics.length
    }

    return 0
  }, [])

  // Ejecutor unificado de estadísticas para cualquier indicador (principal o del modal)
  const executeCalculation = useCallback(
    async (
      trigger: string,
      statType: StatType = 'count',
      statField: string = '',
      decimals: number = 0
    ): Promise<string> => {
      const isAll = isAllLayersTrigger(trigger)
      if (isAll && (statType === 'count' || !statField)) {
        let totalCount = 0
        const payload = getActiveLayersPayload()
        const activeIds: string[] = payload?.activeIds || []
        const catalog = getThematicCatalog()
        const countedKeys = new Set<string>()

        for (const item of catalog) {
          const isItemActive =
            payload?.visibilityMap?.[item.id] === true ||
            activeIds.includes(item.id)

          if (isItemActive && !countedKeys.has(item.id)) {
            countedKeys.add(item.id)
            const l = findLayerAcrossMaps(item.title) || findLayerAcrossMaps(item.mapLayerTitle)
            if (l) {
              const c = await queryCountForLayer(l)
              totalCount += c
            }
          }
        }
        return formatNumber(totalCount, 0)
      }

      const layer = findLayerAcrossMaps(trigger)
      if (!layer) return '0'

      if (typeof layer.load === 'function' && !layer.loaded) {
        try {
          await layer.load()
        } catch (e) {}
      }

      if (statType === 'count' || !statField) {
        const count = await queryCountForLayer(layer)
        return formatNumber(count, 0)
      }

      if (statField && typeof layer.queryFeatures === 'function') {
        try {
          const q = layer.createQuery ? layer.createQuery() : {}
          q.where = '1=1'
          q.returnGeometry = false
          q.outStatistics = [
            {
              statisticType: statType,
              onStatisticField: statField,
              outStatisticFieldName: 'calculated_val'
            }
          ]
          const res = await layer.queryFeatures(q)
          if (res?.features && res.features.length > 0) {
            const rawVal = res.features[0].attributes?.['calculated_val']
            if (rawVal !== undefined && rawVal !== null && !isNaN(rawVal)) {
              return formatNumber(Number(rawVal), decimals)
            }
          }
        } catch (e) {}

        try {
          const res = await layer.queryFeatures({
            where: '1=1',
            outFields: [statField],
            returnGeometry: false
          })
          const features = res?.features || []
          if (features.length > 0) {
            const nums: number[] = features
              .map((f: any) => Number(f.attributes?.[statField]))
              .filter((n: number) => !isNaN(n) && n !== null)

            if (nums.length > 0) {
              let calc = 0
              if (statType === 'sum') calc = nums.reduce((a, b) => a + b, 0)
              else if (statType === 'avg') calc = nums.reduce((a, b) => a + b, 0) / nums.length
              else if (statType === 'min') calc = Math.min(...nums)
              else if (statType === 'max') calc = Math.max(...nums)

              return formatNumber(calc, decimals)
            }
          }
        } catch (e2) {}
      }

      return '0'
    },
    [findLayerAcrossMaps, queryCountForLayer, getActiveLayersPayload, getThematicCatalog]
  )

  // Clave estable para cálculo de estadísticas sin parpadeos
  const activeCardsCalcKey = useMemo(() => {
    return (
      activeCards
        .map((c) => {
          const extraKey = (c.infoModal?.extraStats || [])
            .map((e, i) => `${e.id || i}_${e.valueMode}_${e.statType}_${e.statField}_${e.decimalPlaces}_${e.value}`)
            .join(';')
          return `${c.id}_${c.layerTrigger}_${c.valueMode}_${c.statType || 'count'}_${c.statField || ''}_${c.decimalPlaces ?? 0}|${extraKey}`
        })
        .join('|') + `_v:${activeDataVersion}`
    )
  }, [activeCards, activeDataVersion])

  // Cálculo en vivo de estadísticas dinámicas (COUNT, SUM, AVG, MIN, MAX) en 2D y 3D
  useEffect(() => {
    if (activeCards.length === 0) return
    let isMounted = true

    activeCards.forEach(async (card) => {
      const cardId = card.id
      const isLayerMode = card.valueMode === 'layer'

      // 1. Cálculo de la estadística principal
      if (isLayerMode) {
        const statType = card.statType || 'count'
        const statField = card.statField ? card.statField.trim() : ''
        const decimals = card.decimalPlaces !== undefined ? card.decimalPlaces : (statType === 'avg' ? 2 : 0)
        const cacheKey = `${cardId}_main_${card.layerTrigger}_${statType}_${statField}_${decimals}`

        if (!inFlightRef.current.has(cacheKey)) {
          inFlightRef.current.add(cacheKey)
          try {
            const valFormatted = await executeCalculation(card.layerTrigger, statType, statField, decimals)
            if (isMounted) {
              valuesCache.current[cacheKey] = valFormatted
              setDynamicValues((prev) => {
                if (prev[cardId] === valFormatted) return prev
                return { ...prev, [cardId]: valFormatted }
              })
            }
          } catch (err) {
          } finally {
            inFlightRef.current.delete(cacheKey)
          }
        }
      }

      // 2. Cálculo de estadísticas adicionales del modal (mismo tipo y cálculo que la principal)
      const extraStats = card.infoModal?.extraStats || []
      extraStats.forEach(async (extra, idx) => {
        const extraKey = `${cardId}_extra_${extra.id || idx}`

        if (extra.valueMode === 'fixed') {
          const fixedVal = extra.value || '0'
          if (isMounted) {
            setDynamicValues((prev) => {
              if (prev[extraKey] === fixedVal) return prev
              return { ...prev, [extraKey]: fixedVal }
            })
          }
          return
        }

        const eStatType = extra.statType || 'count'
        const eStatField = extra.statField ? extra.statField.trim() : ''
        const eDecimals = extra.decimalPlaces !== undefined ? extra.decimalPlaces : (eStatType === 'avg' ? 2 : 0)
        const eCacheKey = `${extraKey}_${card.layerTrigger}_${eStatType}_${eStatField}_${eDecimals}`

        if (!inFlightRef.current.has(eCacheKey)) {
          inFlightRef.current.add(eCacheKey)
          try {
            const eValFormatted = await executeCalculation(card.layerTrigger, eStatType, eStatField, eDecimals)
            if (isMounted) {
              valuesCache.current[eCacheKey] = eValFormatted
              setDynamicValues((prev) => {
                if (prev[extraKey] === eValFormatted) return prev
                return { ...prev, [extraKey]: eValFormatted }
              })
            }
          } catch (err) {
          } finally {
            inFlightRef.current.delete(eCacheKey)
          }
        }
      })
    })

    return () => {
      isMounted = false
    }
  }, [activeCardsCalcKey, activeCards, executeCalculation])

  return (
    <div
      className="widget-estadisticas-capas jimu-widget calcite-mode-dark"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: '#111822',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* Conexión con los mapas y escenas ArcGIS (2D y 3D) */}
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
        <span className="header-title">
          {config?.headerTitle || 'MÉTRICAS Y ESTADÍSTICAS'}
        </span>
      </div>

      {/* LISTA DE TARJETAS DINÁMICAS */}
      <div className="cards-container">
        {activeCards.length > 0 ? (
          activeCards.map((card) => {
            const accent = card.accentColor || '#00e5ff'
            const unitColor = card.unitColor || '#00b4d8'
            const descColor = card.descriptionColor || '#34d399'

            const isLayerMode = card.valueMode === 'layer'
            const displayValue = isLayerMode
              ? (dynamicValues[card.id] || card.value || '0')
              : (card.value || '0')

            return (
              <div
                key={card.id}
                className="stat-card"
                style={{
                  borderLeft: `3.5px solid ${accent}`
                }}
              >
                {/* FILA SUPERIOR: TÍTULO + BOTÓN DE INFORMACIÓN */}
                <div className="stat-card-top">
                  <span className="stat-card-title" title={card.cardTitle}>
                    {card.cardTitle}
                  </span>

                  {/* Botón de información interactivo para abrir la ventana emergente */}
                  <button
                    type="button"
                    className="stat-card-info-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveModalCard(card)
                    }}
                    title="Ver información y detalles del indicador"
                    aria-label="Información del indicador"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </button>
                </div>

                {/* FILA CENTRAL: NÚMERO KPI GIGANTE + UNIDAD */}
                <div className="stat-card-metric-row">
                  <span className="stat-card-value">
                    {displayValue}
                  </span>
                  <span className="stat-card-unit" style={{ color: unitColor }}>
                    {card.unit}
                  </span>
                </div>

                {/* FILA INFERIOR: PEQUEÑA DESCRIPCIÓN CONTEXTUAL */}
                {card.description && (
                  <div className="stat-card-desc" style={{ color: descColor }}>
                    {card.description}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className="empty-text">
              {config?.noLayerMessage ||
                'Activa una o más capas en el explorador territorial para visualizar sus estadísticas.'}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          VENTANA EMERGENTE DE INFORMACIÓN (MODAL CALCITE DARK SLATE)
          Renderizado en document.body mediante ReactDOM.createPortal para evitar
          líneas divisorias del sidebar y garantizar z-index superior absoluto.
          ===================================================================== */}
      {activeModalCard && typeof document !== 'undefined' && ReactDOM.createPortal((() => {
        const modal: InfoModalConfig = activeModalCard.infoModal || {}

        // Título del modal: configurable o el título de la tarjeta
        const modalTitle = modal.title || activeModalCard.cardTitle

        // Valor principal registrado
        const isLayerMode = activeModalCard.valueMode === 'layer'
        const primaryValue = isLayerMode
          ? (dynamicValues[activeModalCard.id] || activeModalCard.value || '0')
          : (activeModalCard.value || '0')
        const primaryUnit = activeModalCard.unit || ''

        // Estadísticas adicionales (hasta 3) que solo aparecen en la ventana emergente
        const extraStats = modal.extraStats || []

        // Párrafo descriptivo amplio
        const descriptionText = modal.description !== undefined
          ? modal.description
          : (activeModalCard.description || 'Información detallada e indicadores de seguimiento territorial.')

        // Metadatos inferiores
        const sourceText = modal.source || 'Secretaría Distrital de Planeación (SDP)'
        const updateText = modal.lastUpdate || '07/07/2026'
        const frequencyText = modal.frequency || 'Tiempo real'

        // Botón opcional con URL externa
        const hasUrlButton = Boolean(modal.buttonUrl && modal.buttonUrl.trim().length > 0)
        const buttonText = modal.buttonText?.trim() || 'Ver información oficial'
        const buttonUrl = modal.buttonUrl?.trim() || '#'

        return (
          <div
            className="stat-modal-overlay"
            onClick={() => setActiveModalCard(null)}
          >
            <div
              className="stat-modal-window"
              onClick={(e) => e.stopPropagation()}
            >
              {/* FILA SUPERIOR: SÓLO TÍTULO PRINCIPAL Y BOTÓN DE CIERRE (SIN ICONOS NI ETIQUETAS) */}
              <div className="stat-modal-header-row">
                <h2 className="stat-modal-main-title">
                  {modalTitle}
                </h2>

                <button
                  type="button"
                  className="stat-modal-close-btn"
                  onClick={() => setActiveModalCard(null)}
                  title="Cerrar ventana"
                  aria-label="Cerrar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* CUADRÍCULA DE RECUADROS DE MÉTRICAS: VALOR PRINCIPAL + ESTADÍSTICAS COMPLEMENTARIAS OPCIONALES */}
              <div className="stat-modal-metrics-grid">
                {/* 1. Recuadro exclusivo de Valor Principal Registrado */}
                <div className="stat-modal-subcard is-primary">
                  <span className="stat-modal-subcard-label">VALOR PRINCIPAL REGISTRADO</span>
                  <div className="stat-modal-subcard-val-row">
                    <span className="stat-modal-subcard-val">
                      {primaryValue}
                    </span>
                    {primaryUnit && (
                      <span className="stat-modal-subcard-unit">
                        {primaryUnit}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Estadísticas adicionales opcionales (sólo si se han configurado) */}
                {extraStats.map((st, sIdx) => {
                  if (!st) return null
                  const extraKey = `${activeModalCard.id}_extra_${st.id || sIdx}`
                  const isLayer = st.valueMode !== 'fixed'
                  const displayExtraVal = isLayer
                    ? (dynamicValues[extraKey] || st.value || '0')
                    : (st.value || '0')

                  return (
                    <div key={st.id || sIdx} className="stat-modal-subcard">
                      <span className="stat-modal-subcard-label">{st.label || `Estadística ${sIdx + 1}`}</span>
                      <div className="stat-modal-subcard-val-row">
                        <span className="stat-modal-subcard-val">
                          {displayExtraVal}
                        </span>
                        {st.unit && (
                          <span className="stat-modal-subcard-unit">
                            {st.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* PÁRRAFO DESCRIPTIVO AMPLIO Y LEGIBLE */}
              {descriptionText && (
                <p className="stat-modal-description">
                  {descriptionText}
                </p>
              )}

              {/* RECUADRO INFERIOR DE FUENTE OFICIAL Y METADATOS */}
              <div className="stat-modal-meta-box">
                <div className="stat-modal-meta-row">
                  <span className="stat-modal-meta-label">FUENTE OFICIAL</span>
                  <span className="stat-modal-meta-value">{sourceText}</span>
                </div>
                <div className="stat-modal-meta-row">
                  <span className="stat-modal-meta-label">ÚLTIMA ACTUALIZACIÓN</span>
                  <span className="stat-modal-meta-value">{updateText}</span>
                </div>
                <div className="stat-modal-meta-row">
                  <span className="stat-modal-meta-label">FRECUENCIA</span>
                  <span className="stat-modal-meta-value">{frequencyText}</span>
                </div>
              </div>

              {/* BOTÓN OPCIONAL CON URL EXTERNA */}
              {hasUrlButton && (
                <div className="stat-modal-actions-row">
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stat-modal-link-btn"
                  >
                    <span>{buttonText}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        )
      })(), document.body)}
    </div>
  )
}
