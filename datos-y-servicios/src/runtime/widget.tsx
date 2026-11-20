/**
 * ============================================================================
 * WIDGET RUNTIME: DATOS Y SERVICIOS (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Catálogo institucional de datos espaciales y servicios geográficos (APIs, REST, WFS/WMS),
 * con especificación clara de fuente oficial, tipo de dato, fecha de actualización,
 * buscador reactivo por nombre alineado a la izquierda, sin iconos ni estilo de etiquetas,
 * bajo la tipografía y lineamientos oficiales del Calcite Design System.
 */

import { React, type AllWidgetProps, getAppStore, appActions, LinkType, jimuHistory, Immutable } from 'jimu-core'
import { Link } from 'jimu-ui'
import type { IMConfig, DataServiceCardConfig } from '../config'
import { styleText } from './style'

const { useState, useMemo, useCallback } = React

const DEFAULT_FALLBACK_CARD: DataServiceCardConfig = {
  id: 'dato-ejemplo-1',
  title: 'Nombre del conjunto de datos o servicio',
  source: 'Secretaría Distrital de Planeación',
  dataType: 'Servicio Feature Service (REST)',
  updateDate: 'Octubre 2024',
  url: '',
  dialogId: '',
  targetType: 'url',
  buttonText: 'Acceder al dato',
  description: 'Descripción técnica del conjunto de datos, atributos geográficos y especificaciones de consulta.',
  nonOpenDataNotice: 'Este dato no es un dato abierto',
  accentColor: '#007ac2'
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const config = props.config

  const [searchTerm, setSearchTerm] = useState<string>('')

  const headerSubtitle = config?.headerSubtitle || ''
  const headerTitle = config?.headerTitle || 'Datos y Servicios'
  const headerDescription = config?.headerDescription || ''

  const cards: DataServiceCardConfig[] = useMemo(() => {
    const raw = config?.cards
    if (!raw || raw.length === 0) {
      return [DEFAULT_FALLBACK_CARD]
    }
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : [...raw]
  }, [config?.cards])

  // Filtrado reactivo por término de búsqueda (nombre principal)
  const filteredCards = useMemo(() => {
    const cleanTerm = searchTerm.toLowerCase().trim()
    if (!cleanTerm) return cards
    return cards.filter((card) => (card.title || '').toLowerCase().includes(cleanTerm))
  }, [cards, searchTerm])

  /**
   * Ejecuta la apertura nativa de ventana emergente si se vincula un dialog de Experience Builder
   */
  const handleOpenDialog = useCallback((dialogId: string, evt?: React.MouseEvent) => {
    if (!dialogId) return
    const cleanId = dialogId.trim()
    if (!cleanId) return

    try {
      const appStore = getAppStore()
      if (appStore) {
        const state = appStore.getState()
        const currentDialogInfos = state.appRuntimeInfo?.dialogInfos || Immutable({})
        let nextDialogInfos = currentDialogInfos

        if (nextDialogInfos[cleanId]) {
          nextDialogInfos = nextDialogInfos
            .setIn([cleanId, 'isClosed'], false)
            .setIn([cleanId, 'canClose'], true)
        } else {
          nextDialogInfos = nextDialogInfos.set(cleanId, Immutable({ isClosed: false, canClose: true }))
        }

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
        appStore.dispatch(appActions.currentDialogChanged(cleanId))
        appStore.dispatch(appActions.activePagePartChanged(null))
      }

      if (jimuHistory && typeof (jimuHistory as any).changeDialog === 'function') {
        (jimuHistory as any).changeDialog(cleanId)
      }
    } catch (e) {
      console.warn('Error al activar la ventana:', e)
    }
  }, [])

  return (
    <div className="widget-datos-y-servicios calcite-mode-dark">
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* CABECERA CON BUSCADOR ALINEADO A LA IZQUIERDA */}
      <div className="header-container">
        {headerSubtitle && <div className="header-subtitle">{headerSubtitle}</div>}
        <div className="header-title-row">
          <h2 className="header-title">{headerTitle}</h2>
        </div>
        {headerDescription && <p className="header-desc">{headerDescription}</p>}

        {/* FILA DE CONTROLES: BUSCADOR LIMPIO SIN ICONOS */}
        <div className="banner-controls-row">
          <div className="search-box-wrapper">
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

      {/* REJILLA DE TARJETAS DE DATOS Y SERVICIOS */}
      <div className="cards-scroll-container">
        {filteredCards.length === 0 ? (
          <div className="empty-state">
            {cards.length === 0 ? (
              'No hay datos o servicios configurados. Añade elementos desde el panel de configuración.'
            ) : (
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
                  No se encontraron datos que coincidan con &quot;{searchTerm}&quot;.
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
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredCards.map((card, idx) => {
            const cardAccent = card.accentColor || '#007ac2'
            const hasUrl = !!card.url && card.url.trim() !== ''
            const hasDialog = !!card.dialogId && card.dialogId.trim() !== ''
            const hasLink = (card.targetType === 'window' && hasDialog) || (card.targetType !== 'window' && hasUrl) || hasUrl || hasDialog

            return (
              <div
                key={card.id || card.title || idx}
                className="data-card"
              >
                {/* Contenido superior: Nombre y debajo Fuente, Tipo y Actualización */}
                <div className="card-top-content">
                  {/* 1. Nombre principal */}
                  <h3 className="card-title">
                    {card.title || 'Nombre del conjunto de datos'}
                  </h3>

                  {/* 2. Debajo: Fuente, Tipo y Actualización (texto fluido después de los dos puntos) */}
                  <div className="card-meta-list">
                    <div className="card-meta-item">
                      <span className="meta-label">Fuente:</span>{' '}
                      <span className="meta-value">{card.source || 'No especificada'}</span>
                    </div>

                    {card.dataType && (
                      <div className="card-meta-item">
                        <span className="meta-label">Tipo:</span>{' '}
                        <span className="meta-value">{card.dataType}</span>
                      </div>
                    )}

                    {card.updateDate && (
                      <div className="card-meta-item">
                        <span className="meta-label">Actualización:</span>{' '}
                        <span className="meta-value">{card.updateDate}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Descripción técnica */}
                  {card.description && (
                    <p className="card-description">
                      {card.description}
                    </p>
                  )}
                </div>

                {/* Fila inferior de acción: Botón si hay enlace / Letrero de dato no abierto en texto limpio */}
                <div className="card-action-row">
                  {!hasLink ? (
                    <div className="non-open-data-notice">
                      <span className="notice-bullet">●</span>
                      <span>{card.nonOpenDataNotice || 'Este dato no es un dato abierto'}</span>
                    </div>
                  ) : (
                    card.targetType === 'window' && hasDialog ? (
                      <Link
                        to={{
                          linkType: LinkType.Dialog,
                          value: card.dialogId.trim()
                        }}
                        className="calcite-app-btn"
                        onClick={(e) => handleOpenDialog(card.dialogId, e)}
                        title="Abrir ventana emergente"
                        role="button"
                      >
                        <span>{card.buttonText || 'Acceder al dato'}</span>
                      </Link>
                    ) : (
                      <Link
                        to={{
                          linkType: LinkType.WebAddress,
                          value: (card.url || '').trim()
                        }}
                        target="_blank"
                        className="calcite-app-btn"
                        title="Abrir recurso o servicio web"
                        role="button"
                      >
                        <span>{card.buttonText || 'Acceder al dato'}</span>
                      </Link>
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
