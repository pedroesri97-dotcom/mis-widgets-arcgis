/**
 * ============================================================================
 * WIDGET RUNTIME: GALERÍA DE CASOS Y NOTICIAS (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Diseñado en coherencia visual exacta con el portal del Gemelo Digital de Bogotá
 * (sección inferior a 'Cuatro dimensiones, una sola ciudad').
 * Incluye carrusel continuo de noticias con fuentes oficiales, procedencia
 * institucional, soporte de personalización cromática y controles minimalistas Calcite.
 */

import { React, type AllWidgetProps, getAppStore, appActions, LinkType, jimuHistory } from 'jimu-core'
import { Link } from 'jimu-ui'
import type { IMConfig, NewsCaseItem, ThemeColors } from '../config'
import { styleText } from './style'

const { useState, useEffect, useRef, useMemo, useCallback } = React

const DEFAULT_NEWS_ITEMS: NewsCaseItem[] = [
  {
    id: 'caso-1',
    title: 'Inteligencia Territorial Avanzada',
    source: 'Secretaría Distrital de Planeación',
    date: 'Noviembre 2024',
    imageUrl: '',
    url: '',
    dialogId: '',
    targetType: 'url',
    buttonText: 'Ver caso'
  },
  {
    id: 'caso-2',
    title: 'Formación de Técnicos SIG',
    source: 'Catastro Distrital - IDECA',
    date: 'Octubre 2024',
    imageUrl: '',
    url: '',
    dialogId: '',
    targetType: 'url',
    buttonText: 'Ver caso'
  },
  {
    id: 'caso-3',
    title: 'SIG Institucional y Catastro Multipropósito',
    source: 'Unidad Administrativa Especial de Catastro',
    date: 'Octubre 2024',
    imageUrl: '',
    url: '',
    dialogId: '',
    targetType: 'url',
    buttonText: 'Ver caso'
  },
  {
    id: 'caso-4',
    title: 'Monitoreo y Resiliencia Climática',
    source: 'Secretaría Distrital de Ambiente',
    date: 'Septiembre 2024',
    imageUrl: '',
    url: '',
    dialogId: '',
    targetType: 'url',
    buttonText: 'Ver caso'
  },
  {
    id: 'caso-5',
    title: 'Simulación 4D Primera Línea del Metro',
    source: 'Empresa Metro de Bogotá',
    date: 'Noviembre 2024',
    imageUrl: '',
    url: '',
    dialogId: '',
    targetType: 'url',
    buttonText: 'Ver caso'
  },
  {
    id: 'caso-6',
    title: 'Evolución y Dinámica del Suelo Urbano',
    source: 'Secretaría Distrital de Hábitat',
    date: 'Octubre 2024',
    imageUrl: '',
    url: '',
    dialogId: '',
    targetType: 'url',
    buttonText: 'Ver caso'
  }
]

const DEFAULT_THEME_COLORS: ThemeColors = {
  widgetBg: '#070c14',
  cardBg: '#0e1622',
  accentColor: '#007ac2',
  cardBorder: '#1a2533'
}

export default function Widget(props: AllWidgetProps<IMConfig>) {
  const { config } = props

  const viewportRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const headerSubtitle = config?.headerSubtitle || 'OBSERVATORIO · GALERÍA DE CASOS'
  const headerTitle = config?.headerTitle || 'Territorios que ya deciden con datos.'
  const headerDescription = config?.headerDescription || ''
  const autoplay = config?.autoplay ?? true
  const autoplaySpeed = config?.autoplaySpeed ?? 4

  const themeColors: ThemeColors = useMemo(() => {
    const raw = config?.themeColors
    if (!raw) return DEFAULT_THEME_COLORS
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...DEFAULT_THEME_COLORS, ...raw }
  }, [config?.themeColors])

  const newsItems: NewsCaseItem[] = useMemo(() => {
    const raw = config?.newsItems
    if (!raw || raw.length === 0) return DEFAULT_NEWS_ITEMS
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : [...raw]
  }, [config?.newsItems])

  /**
   * Sanitización de URLs para neutralizar ataques XSS basados en protocolos maliciosos (javascript:, data:)
   */
  const sanitizeUrl = useCallback((url?: string): string => {
    if (!url) return ''
    const trimmed = url.trim()
    if (/^(javascript|vbscript|data):/i.test(trimmed)) {
      return '#'
    }
    return trimmed
  }, [])

  /**
   * Apertura nativa de ventanas emergentes (dialogs) de ArcGIS Experience Builder
   */
  const handleOpenDialog = useCallback((dialogId: string, evt?: React.MouseEvent) => {
    if (!dialogId) return
    const cleanId = dialogId.trim()
    if (!cleanId) return

    try {
      const appStore = getAppStore()
      if (appStore) {
        const state = appStore.getState()
        const dialogConfigs = state?.appConfig?.dialogs || {}

        if (dialogConfigs[cleanId]) {
          appStore.dispatch(appActions.openDialog(cleanId))
        }

        const isClosedState = state?.widgetsRuntimeInfo?.[cleanId]?.isClosed
        if (isClosedState === true || isClosedState === undefined) {
          appStore.dispatch(appActions.closeDialog(cleanId))
          setTimeout(() => {
            appStore.dispatch(appActions.openDialog(cleanId))
          }, 40)
        }

        appStore.dispatch(appActions.activePagePartChanged(null))
      }

      if (jimuHistory && typeof (jimuHistory as any).changeDialog === 'function') {
        (jimuHistory as any).changeDialog(cleanId)
      }
    } catch (e) {
      console.warn('Error al activar la ventana:', e)
    }
  }, [])

  // Auto-scroll del bucle continuo (se pausa silenciosamente al pasar el cursor)
  useEffect(() => {
    if (!autoplay || isPaused) return

    const interval = setInterval(() => {
      const el = viewportRef.current
      if (!el) return

      const cardWidth = 285
      const maxScroll = el.scrollWidth - el.clientWidth

      if (el.scrollLeft + cardWidth >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }, autoplaySpeed * 1000)

    return () => clearInterval(interval)
  }, [autoplay, autoplaySpeed, isPaused])

  const scrollLeft = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: -285, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (viewportRef.current) {
      const el = viewportRef.current
      const maxScroll = el.scrollWidth - el.clientWidth
      if (el.scrollLeft + 285 >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: 285, behavior: 'smooth' })
      }
    }
  }

  // Título con fragmento clave resaltado en el color de acento institucional
  const renderFormattedTitle = (title: string) => {
    if (title.includes('deciden con datos')) {
      const parts = title.split('deciden con datos')
      return (
        <h3 className="header-title">
          {parts[0]}
          <span className="title-highlight">deciden con datos</span>
          {parts[1] || ''}
        </h3>
      )
    }
    return <h3 className="header-title">{title}</h3>
  }

  const dynamicStyles = {
    '--widget-bg': themeColors.widgetBg || '#070c14',
    '--card-bg': themeColors.cardBg || '#0e1622',
    '--accent-color': themeColors.accentColor || '#007ac2',
    '--card-border': themeColors.cardBorder || '#1a2533'
  } as React.CSSProperties

  return (
    <div className="widget-galeria-casos-noticias calcite-mode-dark" style={dynamicStyles}>
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* LÍNEA SEPARADORA INSTITUCIONAL CON SEGMENTO AZUL (IGUAL AL BANNER DEL PORTAL) */}
      <div className="portal-divider-bar" />

      {/* CABECERA DE LA GALERÍA DE CASOS */}
      <div className="header-section">
        {headerSubtitle && <span className="header-subtitle">{headerSubtitle}</span>}
        <div className="header-title-row">
          {renderFormattedTitle(headerTitle)}

          {/* Controles de navegación manual en la cabecera */}
          <div className="carousel-nav-buttons">
            <button
              type="button"
              className="carousel-arrow-btn"
              onClick={scrollLeft}
              title="Anterior"
              aria-label="Anterior"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
            <button
              type="button"
              className="carousel-arrow-btn"
              onClick={scrollRight}
              title="Siguiente"
              aria-label="Siguiente"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>
        {headerDescription && <p className="header-desc">{headerDescription}</p>}
      </div>

      {/* BUCLE / CARRUSEL CONTINUO DE NOTICIAS */}
      <div
        className="carousel-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="carousel-viewport" ref={viewportRef}>
          <div className="carousel-track">
            {newsItems.map((item, idx) => {
              const hasCardDialog = item.targetType === 'window' && !!item.dialogId && item.dialogId.trim() !== ''
              const hasCardUrl = item.targetType !== 'window' && !!item.url && item.url.trim() !== ''

              const cardInner = (
                <>
                  {/* Zona de imagen superior limpia, sin etiquetas ni elementos flotantes */}
                  <div
                    className="card-image-box"
                    style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl}")` } : undefined}
                  />

                  {/* Cuerpo inferior con título y procedencia oficial */}
                  <div className="card-body-content">
                    <h4 className="card-news-title">{item.title}</h4>

                    <div className="card-meta-provenance">
                      <span className="card-provenance-source" title={item.source ? `Fuente: ${item.source}` : 'Entidad Distrital'}>
                        {item.source ? `Fuente: ${item.source}` : 'Entidad Distrital'}
                      </span>
                      {item.date && (
                        <span className="card-provenance-date">
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )

              if (hasCardDialog) {
                return (
                  <Link
                    key={item.id || idx}
                    to={{
                      linkType: LinkType.Dialog,
                      value: item.dialogId.trim()
                    }}
                    className="news-card"
                    onClick={(e) => handleOpenDialog(item.dialogId, e)}
                    title={`Abrir ventana: ${item.title}`}
                  >
                    {cardInner}
                  </Link>
                )
              }

              if (hasCardUrl) {
                return (
                  <a
                    key={item.id || idx}
                    href={sanitizeUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card"
                    title={`Abrir enlace: ${item.title}`}
                  >
                    {cardInner}
                  </a>
                )
              }

              return (
                <div key={item.id || idx} className="news-card">
                  {cardInner}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
