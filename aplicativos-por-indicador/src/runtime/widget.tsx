/**
 * ============================================================================
 * WIDGET RUNTIME: APLICATIVOS POR INDICADOR (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Catálogo de tableros y aplicativos territoriales agrupados en las 4 dimensiones
 * oficiales (Ambiental, Urbanística, Social y Económica), con código de KPI,
 * cabecera descriptiva, buscador en tiempo real, filtro por dimensión,
 * fecha de actualización, advertencias contextuales y vinculación nativa para la
 * apertura directa de ventanas (dialogs) de Experience Builder y URLs externas.
 */

import { React, type AllWidgetProps, getAppStore, appActions, LinkType, jimuHistory, Immutable } from 'jimu-core'
import { Link } from 'jimu-ui'
import type { IMConfig, BoardCardConfig, DimensionType, StatusType } from '../config'
import { styleText } from './style'

const { useState, useMemo, useCallback } = React

// Paleta oficial de colores por dimensión territorial
const DIMENSION_COLORS: Record<DimensionType, string> = {
  Ambiental: '#10b981',
  Urbanística: '#f59e0b',
  Social: '#8b5cf6',
  Económica: '#0284c7'
}

const DEFAULT_FALLBACK_CARD: BoardCardConfig = {
  id: 'tablero-ejemplo-1',
  kpiCode: 'KPI - 01',
  title: 'Nombre del aplicativo de ejemplo',
  dimension: 'Ambiental',
  status: 'Activo',
  description: 'Descripción general del aplicativo, indicadores asociados y alcance analítico de la información territorial.',
  updateDate: 'Octubre 2024',
  appUrl: '',
  dialogId: '',
  targetType: 'window',
  buttonText: 'Abrir ventana',
  updateNotice: 'Información en proceso de actualización técnica.',
  accentColor: '#10b981'
}

// Clase CSS de punto de estado
const getStatusDotClass = (status: StatusType): string => {
  switch (status) {
    case 'En producción':
      return 'status-produccion'
    case 'Activo':
      return 'status-activo'
    case 'Inactivo':
      return 'status-inactivo'
    case 'En actualización':
      return 'status-actualizando'
    default:
      return 'status-activo'
  }
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const config = props.config

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedDimension, setSelectedDimension] = useState<string>('Todas')

  const headerSubtitle = config?.headerSubtitle || ''
  const headerTitle = config?.headerTitle || 'Aplicativos por Indicador'
  const headerDescription = config?.headerDescription || ''

  const cards: BoardCardConfig[] = useMemo(() => {
    const raw = config?.cards
    if (!raw || raw.length === 0) {
      return [DEFAULT_FALLBACK_CARD]
    }
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : [...raw]
  }, [config?.cards])

  // Filtrado reactivo por dimensión y por término de búsqueda (nombre principal)
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchDim = selectedDimension === 'Todas' || card.dimension === selectedDimension
      const cleanTerm = searchTerm.toLowerCase().trim()
      const matchSearch = !cleanTerm || (card.title || '').toLowerCase().includes(cleanTerm)
      return matchDim && matchSearch
    })
  }, [cards, selectedDimension, searchTerm])

  /**
   * Ejecuta la apertura nativa de la ventana (dialog) de ArcGIS Experience Builder
   * desbloqueando el estado 'isClosed' en Redux y sincronizando el enrutador jimuHistory.
   */
  const handleOpenDialog = useCallback((dialogId: string, evt?: React.MouseEvent) => {
    if (!dialogId) return
    const cleanId = dialogId.trim()
    if (!cleanId) return

    try {
      const appStore = getAppStore()
      if (appStore) {
        const state = appStore.getState()

        // 1. Modificar dialogInfos en AppRuntimeInfo para garantizar que no esté marcada como cerrada
        const currentDialogInfos = state.appRuntimeInfo?.dialogInfos || Immutable({})
        let nextDialogInfos = currentDialogInfos

        if (nextDialogInfos[cleanId]) {
          nextDialogInfos = nextDialogInfos
            .setIn([cleanId, 'isClosed'], false)
            .setIn([cleanId, 'canClose'], true)
        } else {
          nextDialogInfos = nextDialogInfos.set(cleanId, Immutable({ isClosed: false, canClose: true }))
        }

        // Si la ventana está asociada a una página específica (currentPageId-cleanId)
        const currentPageId = state.appRuntimeInfo?.currentPageId
        if (currentPageId) {
          const pageDlgKey = `${currentPageId}-${cleanId}`
          if (nextDialogInfos[pageDlgKey]) {
            nextDialogInfos = nextDialogInfos
              .setIn([pageDlgKey, 'isClosed'], false)
              .setIn([pageDlgKey, 'canClose'], true)
          }
        }

        appStore.dispatch(appActions.dialogInfosChanged(nextDialogInfos))

        // 2. Despachar currentDialogChanged para activar la ventana en el store
        appStore.dispatch(appActions.currentDialogChanged(cleanId))

        // 3. Limpiar activePagePartChanged para que la ventana tome foco prioritario
        appStore.dispatch(appActions.activePagePartChanged(null))
      }

      // 4. Cambiar el diálogo en el historial del navegador mediante el API oficial jimuHistory
      if (jimuHistory && typeof (jimuHistory as any).changeDialog === 'function') {
        (jimuHistory as any).changeDialog(cleanId)
      }
    } catch (e) {
      console.warn('Error al activar la ventana:', e)
    }
  }, [])

  return (
    <div className="widget-aplicativos-por-indicador calcite-mode-dark">
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* CABECERA DESTACADA CON BUSCADOR Y FILTROS POR DIMENSIÓN */}
      <div className="header-container">
        {headerSubtitle && <div className="header-subtitle">{headerSubtitle}</div>}
        <div className="header-title-row">
          <h2 className="header-title">{headerTitle}</h2>
        </div>
        {headerDescription && <p className="header-desc">{headerDescription}</p>}

        {/* BARRA DE CONTROLES: FILTRO DE DIMENSIONES + BUSCADOR */}
        <div className="banner-controls-row">
          {/* Pestañas de filtrado por dimensión */}
          <div className="dimension-filter-tabs">
            {['Todas', 'Ambiental', 'Urbanística', 'Social', 'Económica'].map((dim) => (
              <button
                key={dim}
                type="button"
                className={`dimension-filter-btn ${selectedDimension === dim ? 'active' : ''}`}
                onClick={() => setSelectedDimension(dim)}
              >
                {dim}
              </button>
            ))}
          </div>

          {/* Buscador interactivo por nombre principal */}
          <div className="search-box-wrapper">
            <svg className="search-icon" viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REJILLA DE TABLEROS */}
      <div className="boards-scroll-container">
        {filteredCards.length === 0 ? (
          <div className="empty-state">
            {cards.length === 0 ? (
              'No hay tableros o aplicativos configurados. Añade elementos desde el panel de configuración.'
            ) : (
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
                  No se encontraron aplicativos que coincidan con la búsqueda.
                </p>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: '#243447',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedDimension('Todas')
                    setSearchTerm('')
                  }}
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredCards.map((board, idx) => {
            const dimensionColor = DIMENSION_COLORS[board.dimension] || board.accentColor || '#007ac2'
            const statusClass = getStatusDotClass(board.status)
            const isInactive = board.status === 'Inactivo'
            const isUpdating = board.status === 'En actualización'
            const kpiNumber = board.kpiCode || ''

            const isWindowAction = board.targetType === 'window' || (!board.targetType && !!board.dialogId) || (!board.targetType && !board.appUrl)
            const hasValidDialog = isWindowAction && !!board.dialogId && board.dialogId.trim() !== ''
            const hasValidUrl = !isWindowAction && !!board.appUrl && board.appUrl.trim() !== ''

            return (
              <div
                key={board.id || board.title || idx}
                className="board-card"
              >
                {/* Bloque de contenido */}
                <div className="card-top-content">
                  {/* Fila superior: KPI arriba de la Dimensión, con tipografía limpia Calcite */}
                  <div className="card-meta-row">
                    <div className="meta-left-stacked">
                      {kpiNumber ? (
                        <span className="kpi-code-text" style={{ color: dimensionColor }}>
                          {kpiNumber}
                        </span>
                      ) : null}
                      <span className="dimension-label">
                        {board.dimension}
                      </span>
                    </div>

                    <span className="status-indicator">
                      <span className={`status-dot ${statusClass}`} />
                      <span className="status-text">{board.status}</span>
                    </span>
                  </div>

                  {/* Nombre del tablero / aplicativo */}
                  <h3 className="board-title">
                    {board.title || 'Nombre del aplicativo'}
                  </h3>

                  {/* Descripción técnica */}
                  {board.description ? (
                    <p className="board-description">
                      {board.description}
                    </p>
                  ) : null}

                  {/* Fecha de actualización (sin icono) */}
                  {board.updateDate && (
                    <div className="card-update-row">
                      <span>Actualizado: {board.updateDate}</span>
                    </div>
                  )}

                  {/* Advertencia contextual si está en actualización */}
                  {isUpdating && (
                    <div className="update-warning-banner">
                      <svg className="warning-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                        <path d="M7.16 2.48a1 1 0 0 1 1.68 0l6.14 10.23A1 1 0 0 1 14.12 14H1.88a1 1 0 0 1-.86-1.29l6.14-10.23zM8 5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 5zm0 6a.875.875 0 1 0 0 1.75A.875.875 0 0 0 8 11z"/>
                      </svg>
                      <span className="warning-text">
                        {board.updateNotice || 'Información en proceso de actualización técnica y sincronización de fuentes.'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fila inferior de acción: desaparece si está inactivo */}
                <div className="card-action-row">
                  {isInactive ? (
                    <span className="inactive-notice">
                      ● Tablero temporalmente no disponible
                    </span>
                  ) : (
                    hasValidDialog ? (
                      <Link
                        to={{
                          linkType: LinkType.Dialog,
                          value: board.dialogId.trim()
                        }}
                        className="calcite-app-btn"
                        onClick={(e) => handleOpenDialog(board.dialogId, e)}
                        title="Abrir ventana emergente"
                        role="button"
                      >
                        <span>{board.buttonText || 'Abrir ventana'}</span>
                        <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                          <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 11H2V5h12v8z"/>
                        </svg>
                      </Link>
                    ) : hasValidUrl ? (
                      <Link
                        to={{
                          linkType: LinkType.WebAddress,
                          value: board.appUrl.trim()
                        }}
                        target="_blank"
                        className="calcite-app-btn"
                        title="Abrir aplicativo externo en nueva pestaña"
                        role="button"
                      >
                        <span>{board.buttonText || 'Abrir aplicativo'}</span>
                        <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                          <path d="M10 2h4v4h-1V3.707L7.854 8.854l-.708-.708L12.293 3H10V2zm3 6v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5v1H3v9h9V8h1z"/>
                        </svg>
                      </Link>
                    ) : isWindowAction ? (
                      <button
                        type="button"
                        className="calcite-app-btn calcite-app-btn-disabled"
                        title="Seleccione una ventana en el panel de configuración del widget"
                        onClick={() => {
                          console.warn('No hay una ventana asignada a este tablero en la configuración.')
                        }}
                      >
                        <span>{board.buttonText || 'Abrir ventana'}</span>
                        <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                          <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 11H2V5h12v8z"/>
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="calcite-app-btn calcite-app-btn-disabled"
                        disabled
                        title="Configure una URL en el panel de configuración"
                      >
                        <span>{board.buttonText || 'Abrir aplicativo'}</span>
                        <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                          <path d="M10 2h4v4h-1V3.707L7.854 8.854l-.708-.708L12.293 3H10V2zm3 6v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5v1H3v9h9V8h1z"/>
                        </svg>
                      </button>
                    )
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Widget
