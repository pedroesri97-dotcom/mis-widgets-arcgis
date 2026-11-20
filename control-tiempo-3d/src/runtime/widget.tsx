import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView, MapViewManager } from 'jimu-arcgis'
import type { IMConfig } from '../config'
import { styleText } from './style'

const { useState, useEffect, useCallback, useRef } = React

// Formateo de hora decimal (0.0 a 24.0) a formato 12h ("12:45 p. m.")
const formatTime12h = (hourDecimal: number): { timeStr: string; period: string } => {
  const normalized = ((hourDecimal % 24) + 24) % 24
  let hours = Math.floor(normalized)
  const minutes = Math.floor((normalized - hours) * 60)
  const period = hours >= 12 ? 'p. m.' : 'a. m.'

  hours = hours % 12
  if (hours === 0) hours = 12

  const padMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const padHours = hours < 10 ? `0${hours}` : `${hours}`

  return {
    timeStr: `${padHours}:${padMinutes}`,
    period
  }
}

export default function Widget(props: AllWidgetProps<IMConfig>) {
  const { config, useMapWidgetIds } = props

  const animFrameRef = useRef<number | null>(null)

  // Estado de vistas
  const [allJimuMapViews, setAllJimuMapViews] = useState<{ [viewId: string]: JimuMapView }>({})
  const [activeJimuMapView, setActiveJimuMapView] = useState<JimuMapView | null>(null)
  const [is3DActive, setIs3DActive] = useState<boolean>(false)

  // Configuración y parámetros de simulación solar y sombras
  const defaultHour = config?.defaultHour ?? 13.0
  const [currentHour, setCurrentHour] = useState<number>(defaultHour)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(config?.animationSpeed ?? 1.0)
  const [shadowsEnabled, setShadowsEnabled] = useState<boolean>(config?.defaultShadows ?? true)

  // Callbacks de JimuMapViewComponent
  const handleViewsChange = useCallback((views: { [viewId: string]: JimuMapView }) => {
    if (views) setAllJimuMapViews((prev) => ({ ...prev, ...views }))
  }, [])

  const handleActiveViewChange = useCallback((jmv: JimuMapView) => {
    if (jmv) {
      setAllJimuMapViews((prev) => ({ ...prev, [jmv.id]: jmv }))
      setActiveJimuMapView(jmv)
    }
  }, [])

  // Recolectar todas las instancias de SceneView (3D) disponibles
  const getAll3DSceneViews = useCallback((): any[] => {
    const list: any[] = []
    const seen = new Set<any>()

    const inspectView = (v: any) => {
      if (!v) return
      const rawView = v.view || v
      if (rawView && (rawView.type === '3d' || rawView.isInstanceOf?.('esri.views.SceneView')) && !seen.has(rawView)) {
        seen.add(rawView)
        list.push(rawView)
      }
    }

    if (activeJimuMapView) inspectView(activeJimuMapView)
    Object.values(allJimuMapViews).forEach(inspectView)

    try {
      const mgr = MapViewManager.getInstance()
      const all = mgr?.getAllJimuMapView ? mgr.getAllJimuMapView() : []
      const arr = Array.isArray(all) ? all : Object.values(all || {})
      arr.forEach(inspectView)
    } catch (e) {}

    try {
      if (typeof window !== 'undefined') {
        const winViews = (window as any).__exb_jimu_map_views__ || (window.top as any)?.__exb_jimu_map_views__
        if (winViews) {
          Object.values(winViews).forEach(inspectView)
        }
      }
    } catch (e) {}

    return list
  }, [activeJimuMapView, allJimuMapViews])

  // Aplicar fecha y hora solar en SceneView (100% nativo de ArcGIS Maps SDK)
  const applyLighting = useCallback((hourVal: number, directShadows: boolean) => {
    const sceneViews = getAll3DSceneViews()
    if (!sceneViews.length) return

    sceneViews.forEach((sceneView) => {
      try {
        if (!sceneView.environment) {
          sceneView.environment = {}
        }
        if (!sceneView.environment.lighting) {
          sceneView.environment.lighting = {}
        }

        const date = new Date(sceneView.environment.lighting.date || new Date())
        const hours = Math.floor(hourVal)
        const minutes = Math.floor((hourVal - hours) * 60)
        date.setHours(hours, minutes, 0, 0)

        sceneView.environment.lighting.date = date
        sceneView.environment.lighting.directShadowsEnabled = directShadows

        if (typeof sceneView.requestUpdate === 'function') {
          sceneView.requestUpdate()
        }
      } catch (e) {}
    })
  }, [getAll3DSceneViews])

  // Monitoreo continuo de la disponibilidad de la vista 3D
  useEffect(() => {
    const checkView = () => {
      const views = getAll3DSceneViews()
      const has3D = views.length > 0
      setIs3DActive(has3D)
    }

    checkView()
    const timer = setInterval(checkView, 1200)
    return () => clearInterval(timer)
  }, [getAll3DSceneViews])

  // Sincronizar iluminación solar cuando cambia la hora o sombras
  useEffect(() => {
    applyLighting(currentHour, shadowsEnabled)
  }, [currentHour, shadowsEnabled, applyLighting])

  // Ciclo de animación del tiempo (Play / Pause)
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      return
    }

    let lastTimestamp = performance.now()

    const loop = (timestamp: number) => {
      const deltaSec = (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp

      // 1 hora de simulación cada 4 segundos a velocidad 1.0x
      const deltaHour = (deltaSec / 4.0) * speed

      setCurrentHour((prev) => {
        let next = prev + deltaHour
        if (next >= 24) next = 0
        return next
      })

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [isPlaying, speed])

  // Manejo de interacción de sliders
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentHour(val)
  }

  const { timeStr, period } = formatTime12h(currentHour)
  const headerTitle = config?.headerTitle || 'Tiempo y Sombras 3D'

  return (
    <div className="widget-control-tiempo-3d calcite-mode-dark">
      <style>{styleText}</style>

      {/* Selector de vistas JimuMap */}
      {useMapWidgetIds && useMapWidgetIds.length > 0 && (
        <JimuMapViewComponent
          useMapWidgetId={useMapWidgetIds[0]}
          onActiveViewChange={handleActiveViewChange}
          onViewsChange={handleViewsChange}
        />
      )}

      {/* Cabecera institucional Calcite */}
      <div className="time-header">
        <h4 className="time-header-title">{headerTitle}</h4>
      </div>

      {/* Contenido principal */}
      <div className="time-content">
        {!is3DActive ? (
          <div className="notice-container">
            <h5 className="notice-title">Vista 3D Requerida</h5>
            <p className="notice-desc">
              Este componente opera sobre escenas tridimensionales. Active o cambie a la vista 3D en el mapa para simular la iluminación solar y sombras en tiempo real.
            </p>
          </div>
        ) : (
          <>
            {/* Panel de hora y control de reproducción */}
            <div className="clock-panel">
              <div className="clock-top-row">
                <div className="clock-display-group">
                  <span className="clock-label">Hora del día</span>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className="clock-time-text">{timeStr}</span>
                    <span className="clock-period-badge">{period}</span>
                  </div>
                </div>

                {/* Chips de velocidad */}
                <div className="speed-chips">
                  <button
                    type="button"
                    className={`speed-chip ${speed === 0.5 ? 'active' : ''}`}
                    onClick={() => setSpeed(0.5)}
                    title="Velocidad lenta"
                  >
                    0.5x
                  </button>
                  <button
                    type="button"
                    className={`speed-chip ${speed === 1.0 ? 'active' : ''}`}
                    onClick={() => setSpeed(1.0)}
                    title="Velocidad normal"
                  >
                    1x
                  </button>
                  <button
                    type="button"
                    className={`speed-chip ${speed === 2.0 ? 'active' : ''}`}
                    onClick={() => setSpeed(2.0)}
                    title="Velocidad rápida"
                  >
                    2x
                  </button>
                </div>

                {/* Botón de reproducción */}
                <button
                  type="button"
                  className={`play-button ${isPlaying ? 'is-playing' : ''}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pausar simulación' : 'Iniciar simulación diurna'}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Slider de tiempo */}
              <div className="slider-container">
                <input
                  type="range"
                  className="time-slider"
                  min="0"
                  max="24"
                  step="0.05"
                  value={currentHour}
                  onChange={handleSliderChange}
                  aria-label="Selector de hora"
                />

                {/* Marcas de referencia horaria según el diseño de referencia */}
                <div className="slider-ticks">
                  <div className="slider-tick-item" style={{ alignItems: 'flex-start' }}>
                    <div className="tick-line" />
                    <span className={`tick-label ${currentHour >= 1.5 && currentHour <= 2.5 ? 'active' : ''}`}>
                      2 a. m.
                    </span>
                  </div>
                  <div className="slider-tick-item">
                    <div className="tick-line" />
                    <span className={`tick-label ${currentHour >= 5.5 && currentHour <= 6.5 ? 'active' : ''}`}>
                      6 a. m.
                    </span>
                  </div>
                  <div className="slider-tick-item">
                    <div className="tick-line" />
                    <span className={`tick-label ${currentHour >= 11.5 && currentHour <= 12.5 ? 'active' : ''}`}>
                      12 p. m.
                    </span>
                  </div>
                  <div className="slider-tick-item">
                    <div className="tick-line" />
                    <span className={`tick-label ${currentHour >= 17.5 && currentHour <= 18.5 ? 'active' : ''}`}>
                      6 p. m.
                    </span>
                  </div>
                  <div className="slider-tick-item" style={{ alignItems: 'flex-end' }}>
                    <div className="tick-line" />
                    <span className={`tick-label ${currentHour >= 23.5 || currentHour <= 0.5 ? 'active' : ''}`}>
                      12 a. m.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila de Sombras Directas */}
            <div className="control-card">
              <div className="control-row">
                <div className="control-info">
                  <div className="control-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </div>
                  <span className="control-label">Sombras directas</span>
                </div>
                <label className="calcite-switch">
                  <input
                    type="checkbox"
                    checked={shadowsEnabled}
                    onChange={(e) => setShadowsEnabled(e.target.checked)}
                  />
                  <span className="calcite-switch-slider" />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
