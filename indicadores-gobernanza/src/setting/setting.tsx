/**
 * ============================================================================
 * PANEL DE CONFIGURACIÓN: INDICADORES DE GOBERNANZA (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Interfaz en escala de grises con diseño vertical responsivo (sin cortes de texto).
 * Permite configurar manualmente los títulos, descripciones y gestionar cada tarjeta
 * de indicador. La variación se calcula automáticamente como la diferencia entre
 * el dato anterior y el dato actual.
 */

import { React, Immutable } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, TextArea } from 'jimu-ui'
import type { IMConfig, GovernanceCardConfig } from '../config'

const { useState } = React

const DEFAULT_NEW_CARD: GovernanceCardConfig = {
  id: '',
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

const settingStyle = `
  .widget-setting-indicadores-gobernanza .jimu-widget-setting--row-label {
    width: 100% !important;
    white-space: normal !important;
    word-break: normal !important;
    margin-bottom: 5px !important;
    color: #cccccc !important;
    font-size: 11.5px !important;
    font-weight: 500 !important;
  }
  .widget-setting-indicadores-gobernanza .jimu-widget-setting--row {
    margin-bottom: 12px !important;
  }
`

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const config = props.config
  const headerSubtitle = config?.headerSubtitle ?? ''
  const headerTitle = config?.headerTitle ?? 'Indicadores de Gobernanza'
  const headerDescription = config?.headerDescription ?? ''

  const rawCards = (config?.cards as any)?.asMutable ? (config.cards as any).asMutable({ deep: true }) : (config?.cards || [])
  const cards: GovernanceCardConfig[] = rawCards.length > 0 ? rawCards : [{ ...DEFAULT_NEW_CARD, id: 'ind-1' }]

  const updateConfig = (newPartial: Partial<any>) => {
    const nextConfig = {
      headerSubtitle,
      headerTitle,
      headerDescription,
      cards,
      ...newPartial
    }
    props.onSettingChange({
      id: props.id,
      config: Immutable(nextConfig)
    })
  }

  const handleAddCard = () => {
    const newId = `ind-${Date.now()}`
    const newCard: GovernanceCardConfig = {
      ...DEFAULT_NEW_CARD,
      id: newId
    }
    const nextCards = [...cards, newCard]
    setExpandedCardId(newId)
    updateConfig({ cards: nextCards })
  }

  const handleRemoveCard = (id: string) => {
    const nextCards = cards.filter((c) => c.id !== id)
    if (nextCards.length === 0) {
      nextCards.push({ ...DEFAULT_NEW_CARD, id: `ind-${Date.now()}` })
    }
    updateConfig({ cards: nextCards })
  }

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= cards.length) return
    const nextCards = [...cards]
    const temp = nextCards[index]
    nextCards[index] = nextCards[targetIdx]
    nextCards[targetIdx] = temp
    updateConfig({ cards: nextCards })
  }

  const handleCardChange = (id: string, field: keyof GovernanceCardConfig, value: any) => {
    const nextCards = cards.map((c) => {
      if (c.id === id) {
        const updated = { ...c, [field]: value }

        // Si se cambia currentValue o currValue, los sincronizamos para coherencia
        if (field === 'currentValue') {
          updated.currValue = value
        } else if (field === 'currValue') {
          updated.currentValue = value
        }

        // Cálculo dinámico de la variación entre dato actual y dato anterior
        const prev = Number(updated.prevValue ?? 0)
        const curr = Number(updated.currValue !== undefined && updated.currValue !== null ? updated.currValue : (updated.currentValue ?? 0))
        const diff = Math.round((curr - prev) * 100) / 100
        const unit = updated.unit === '%' ? 'pp' : (updated.unit || '')

        if (diff > 0) {
          updated.deltaText = `↑ +${diff}${unit ? ' ' + unit : ''}`
          updated.trendType = 'positive'
        } else if (diff < 0) {
          updated.deltaText = `↓ ${diff}${unit ? ' ' + unit : ''}`
          updated.trendType = 'negative'
        } else {
          updated.deltaText = `= 0${unit ? ' ' + unit : ''}`
          updated.trendType = 'neutral'
        }

        return updated
      }
      return c
    })
    updateConfig({ cards: nextCards })
  }

  return (
    <div
      className="widget-setting-indicadores-gobernanza"
      style={{
        padding: '12px',
        color: '#e0e0e0',
        background: '#1a1a1a',
        minHeight: '100%',
        boxSizing: 'border-box',
        fontFamily: '"Avenir Next", "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: settingStyle }} />

      {/* SECCIÓN 1: TEXTOS DE CABECERA */}
      <SettingSection title="Cabecera del Widget">
        <SettingRow label="Subtítulo:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff' }}
            value={headerSubtitle}
            onChange={(e) => updateConfig({ headerSubtitle: e.target.value })}
            placeholder="Ej: MONITOREO ESTRATÉGICO"
          />
        </SettingRow>

        <SettingRow label="Título Principal:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff' }}
            value={headerTitle}
            onChange={(e) => updateConfig({ headerTitle: e.target.value })}
            placeholder="Indicadores de Gobernanza"
          />
        </SettingRow>

        <SettingRow label="Descripción General:" flow="wrap">
          <TextArea
            style={{ width: '100%', minHeight: '65px', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff', lineHeight: 1.4 }}
            value={headerDescription}
            onChange={(e) => updateConfig({ headerDescription: e.target.value })}
            placeholder="Resumen del widget..."
          />
        </SettingRow>
      </SettingSection>

      {/* SECCIÓN 2: GESTIÓN DE TARJETAS DE INDICADORES (ESCALA DE GRISES) */}
      <SettingSection title={`Tarjetas de Indicadores (${cards.length})`}>
        <div style={{ marginBottom: '14px' }}>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '7px 12px',
              borderRadius: '4px',
              background: '#2d2d2d',
              border: '1px solid #4a4a4a',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s ease'
            }}
            onClick={handleAddCard}
          >
            + Añadir Tarjeta de Indicador
          </button>
        </div>

        {cards.map((card, idx) => {
          const isExpanded = expandedCardId === card.id || (cards.length === 1 && expandedCardId === null)
          const prevVal = Number(card.prevValue ?? 0)
          const currVal = Number(card.currValue !== undefined && card.currValue !== null ? card.currValue : (card.currentValue ?? 0))
          const diff = Math.round((currVal - prevVal) * 100) / 100
          const unit = card.unit === '%' ? 'pp' : (card.unit || '')
          const calcVariation = diff > 0 ? `↑ +${diff} ${unit}` : diff < 0 ? `↓ ${diff} ${unit}` : `= 0 ${unit}`

          return (
            <div
              key={card.id || idx}
              style={{
                marginBottom: '10px',
                border: '1px solid #383838',
                borderRadius: '4px',
                background: '#242424',
                overflow: 'hidden'
              }}
            >
              {/* Barra de cabecera de tarjeta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  background: '#2b2b2b',
                  borderBottom: isExpanded ? '1px solid #383838' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => setExpandedCardId(isExpanded ? '' : card.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: '1 1 auto', minWidth: 0 }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#d4d4d4',
                      flexShrink: 0
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                    title={card.title || 'Nueva tarjeta vacía'}
                  >
                    {card.title || '(Indicador sin título)'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveCard(idx, 'up')}
                    title="Subir"
                    style={{
                      background: '#383838',
                      border: '1px solid #484848',
                      color: idx === 0 ? '#666666' : '#cccccc',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={idx === cards.length - 1}
                    onClick={() => handleMoveCard(idx, 'down')}
                    title="Bajar"
                    style={{
                      background: '#383838',
                      border: '1px solid #484848',
                      color: idx === cards.length - 1 ? '#666666' : '#cccccc',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: idx === cards.length - 1 ? 'not-allowed' : 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(card.id)}
                    title="Eliminar"
                    style={{
                      background: '#383838',
                      border: '1px solid #484848',
                      color: '#ff7878',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Formulario editable completamente vertical */}
              {isExpanded && (
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#1c1c1c' }}>
                  {/* Título del Indicador */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Nombre del Indicador:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.title || ''}
                      onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                      placeholder="Ej: % datasets con acuerdo de intercambio"
                    />
                  </div>

                  {/* Unidad de Medida */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Unidad de Medida:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.unit || '%'}
                      onChange={(e) => handleCardChange(card.id, 'unit', e.target.value)}
                      placeholder="%"
                    />
                  </div>

                  {/* Período Anterior */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Etiqueta Período Anterior:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.prevPeriodLabel || ''}
                      onChange={(e) => handleCardChange(card.id, 'prevPeriodLabel', e.target.value)}
                      placeholder="Ej: Anterior"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Dato Anterior:
                    </label>
                    <TextInput
                      size="sm"
                      type="number"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={String(card.prevValue ?? '')}
                      onChange={(e) => handleCardChange(card.id, 'prevValue', Number(e.target.value))}
                      placeholder="45"
                    />
                  </div>

                  {/* Período Actual */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Etiqueta Período Actual:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.currentPeriodLabel || ''}
                      onChange={(e) => handleCardChange(card.id, 'currentPeriodLabel', e.target.value)}
                      placeholder="Ej: Actual"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Dato Actual:
                    </label>
                    <TextInput
                      size="sm"
                      type="number"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={String(card.currValue ?? card.currentValue ?? '')}
                      onChange={(e) => handleCardChange(card.id, 'currValue', Number(e.target.value))}
                      placeholder="50"
                    />
                  </div>

                  {/* Indicador de Variación Calculada */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Variación (Calculada Automáticamente: Actual - Anterior):
                    </label>
                    <div
                      style={{
                        padding: '6px 10px',
                        background: '#242424',
                        border: '1px solid #3d3d3d',
                        borderRadius: '4px',
                        color: diff > 0 ? '#10b981' : diff < 0 ? '#f43f5e' : '#00b4d8',
                        fontSize: '12px',
                        fontWeight: 700,
                        fontFamily: 'monospace'
                      }}
                    >
                      {calcVariation}
                    </div>
                  </div>

                  {/* Comparativa: Título */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Título de Comparativa:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.comparisonTitle || ''}
                      onChange={(e) => handleCardChange(card.id, 'comparisonTitle', e.target.value)}
                      placeholder="Ej: COMPARATIVA TEMPORAL"
                    />
                  </div>

                  {/* Descripción */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Descripción del Indicador:
                    </label>
                    <TextArea
                      style={{ width: '100%', minHeight: '75px', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff', lineHeight: 1.4 }}
                      value={card.description || ''}
                      onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                      placeholder="Descripción de la meta y alcance del indicador..."
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </SettingSection>
    </div>
  )
}

export default Setting
