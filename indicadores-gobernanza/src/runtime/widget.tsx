/**
 * ============================================================================
 * WIDGET RUNTIME: INDICADORES DE GOBERNANZA (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Componente de visualización y monitoreo de indicadores estratégicos de gobernanza,
 * buscador interactivo en tiempo real por nombre principal, métricas comparativas
 * temporales y cumplimiento porcentual hacia objetivos del 100%.
 * Diseñado bajo el sistema de diseño Calcite Dark Slate.
 */

import { React, type AllWidgetProps } from 'jimu-core'
import type { IMConfig, GovernanceCardConfig } from '../config'
import { styleText } from './style'

const { useState, useMemo } = React

const DEFAULT_CARDS: GovernanceCardConfig[] = [
  {
    id: 'ind-ejemplo-1',
    title: 'Nombre del indicador de ejemplo',
    currentValue: 50,
    unit: '%',
    deltaText: '↑ +5 pp',
    trendType: 'positive',
    comparisonTitle: 'COMPARATIVA TEMPORAL',
    prevPeriodLabel: 'Anterior',
    prevValue: 45,
    currentPeriodLabel: 'Actual',
    currValue: 50,
    description: 'Descripción general de la métrica y seguimiento de cumplimiento del objetivo.',
    accentColor: '#10b981'
  }
]

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const config = props.config
  const [searchTerm, setSearchTerm] = useState<string>('')

  const headerSubtitle = config?.headerSubtitle || ''
  const headerTitle = config?.headerTitle || 'Indicadores de Gobernanza'
  const headerDescription = config?.headerDescription || ''

  const cards: GovernanceCardConfig[] = useMemo(() => {
    const raw = config?.cards
    if (!raw || raw.length === 0) {
      return DEFAULT_CARDS
    }
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : [...raw]
  }, [config?.cards])

  // Filtrado reactivo por término de búsqueda (nombre principal)
  const filteredCards = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return cards
    return cards.filter((c) => (c.title || '').toLowerCase().includes(term))
  }, [cards, searchTerm])

  return (
    <div className="widget-indicadores-gobernanza calcite-mode-dark">
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* CABECERA CON BUSCADOR */}
      <div className="header-container">
        {headerSubtitle && <div className="header-subtitle">{headerSubtitle}</div>}
        <div className="header-title-row">
          <h2 className="header-title">{headerTitle}</h2>
        </div>
        {headerDescription && <p className="header-desc">{headerDescription}</p>}

        {/* BUSCADOR INTERACTIVO POR NOMBRE PRINCIPAL */}
        <div className="header-controls-row">
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

      {/* REJILLA / LISTADO RESPONSIVO DE TARJETAS */}
      <div className="cards-scroll-container">
        {filteredCards.length === 0 ? (
          <div className="empty-state">
            {cards.length === 0 ? (
              'No hay indicadores configurados. Agrega tarjetas desde el panel de configuración.'
            ) : (
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
                  No se encontraron indicadores que coincidan con &quot;{searchTerm}&quot;.
                </p>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: '#1e293b',
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
            const cardColor = card.accentColor || '#10b981'
            const prevVal = Number(card.prevValue ?? 0)
            const currVal = Number(card.currValue !== undefined && card.currValue !== null ? card.currValue : (card.currentValue ?? 0))
            const prevPercent = Math.min(100, Math.max(0, prevVal))
            const currPercent = Math.min(100, Math.max(0, currVal))

            // Cálculo dinámico de la variación (diferencia entre dato actual y dato anterior)
            const diff = Math.round((currVal - prevVal) * 100) / 100
            const unitLabel = card.unit === '%' ? 'pp' : (card.unit || '')
            
            let deltaText = ''
            let trendClass = 'trend-neutral'

            if (diff > 0) {
              deltaText = `↑ +${diff}${unitLabel ? ' ' + unitLabel : ''}`
              trendClass = 'trend-positive'
            } else if (diff < 0) {
              deltaText = `↓ ${diff}${unitLabel ? ' ' + unitLabel : ''}`
              trendClass = 'trend-negative'
            } else {
              deltaText = `= 0${unitLabel ? ' ' + unitLabel : ''}`
              trendClass = 'trend-neutral'
            }

            if (card.trendType) {
              trendClass = card.trendType === 'negative'
                ? 'trend-negative'
                : card.trendType === 'neutral'
                  ? 'trend-neutral'
                  : 'trend-positive'
            }

            return (
              <div
                key={card.id || card.title || idx}
                className="indicator-card"
              >
                {/* Título del indicador */}
                <h3 className="card-title">{card.title}</h3>

                {/* Valor principal grande y Delta badge (variación calculada) */}
                <div className="card-metric-row">
                  <div className="card-metric-left">
                    <span className="metric-value" style={{ color: cardColor }}>
                      {card.currentValue !== undefined && card.currentValue !== null ? card.currentValue : currVal}
                    </span>
                    <span className="metric-unit" style={{ color: cardColor }}>
                      {card.unit || '%'}
                    </span>
                  </div>

                  <div className={`trend-badge ${trendClass}`}>
                    {deltaText}
                  </div>
                </div>

                {/* Caja de comparativa con 2 barras de progreso (Objetivo 100%) */}
                <div className="comparison-box">
                  <div className="comparison-header-row">
                    <span className="comparison-label-left">
                      {card.comparisonTitle || 'COMPARATIVA TEMPORAL'}
                    </span>
                    <span className="comparison-label-right">
                      OBJETIVO: 100%
                    </span>
                  </div>

                  {/* Barra período anterior */}
                  <div className="progress-row">
                    <span className="progress-period-label">{card.prevPeriodLabel || 'Anterior'}</span>
                    <div className="progress-track" title={`Objetivo: 100% | Anterior: ${prevPercent}%`}>
                      <div
                        className="progress-fill fill-prev"
                        style={{
                          width: `${prevPercent}%`,
                          backgroundColor: cardColor ? `${cardColor}66` : undefined
                        }}
                      />
                    </div>
                    <span className="progress-value-label">
                      {card.prevValue} {card.unit || '%'}
                    </span>
                  </div>

                  {/* Barra período actual */}
                  <div className="progress-row">
                    <span className="progress-period-label">{card.currentPeriodLabel || 'Actual'}</span>
                    <div className="progress-track" title={`Objetivo: 100% | Actual: ${currPercent}%`}>
                      <div
                        className="progress-fill fill-curr"
                        style={{
                          width: `${currPercent}%`,
                          background: cardColor ? `linear-gradient(90deg, ${cardColor} 0%, #22c55e 100%)` : undefined,
                          boxShadow: cardColor ? `0 0 10px ${cardColor}55` : undefined
                        }}
                      />
                    </div>
                    <span className="progress-value-label">
                      {card.currValue} {card.unit || '%'}
                    </span>
                  </div>
                </div>

                {/* Pequeña descripción / meta */}
                {card.description && (
                  <p className="card-desc">{card.description}</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Widget
