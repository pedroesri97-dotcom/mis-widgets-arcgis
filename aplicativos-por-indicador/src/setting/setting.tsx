/**
 * ============================================================================
 * PANEL DE CONFIGURACIÓN: APLICATIVOS POR INDICADOR (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Interfaz en escala de grises con diseño vertical responsivo (sin cortes de texto).
 * Permite seleccionar ventanas emergentes creadas en Experience Builder o URLs externas,
 * configurar cabecera del catálogo, fecha de actualización y gestionar tarjetas.
 */

import { React, Immutable, getAppStore } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, TextArea, Select, Option } from 'jimu-ui'
import type { IMConfig, BoardCardConfig, DimensionType, StatusType, ActionTargetType } from '../config'

const { useState, useMemo } = React

const DEFAULT_NEW_BOARD: BoardCardConfig = {
  id: '',
  kpiCode: 'KPI - 01',
  title: 'Nombre del aplicativo de ejemplo',
  dimension: 'Ambiental',
  status: 'Activo',
  description: 'Descripción general del aplicativo, indicadores asociados y alcance analítico de la información territorial.',
  updateDate: 'Octubre 2024',
  targetType: 'window',
  dialogId: '',
  appUrl: '',
  buttonText: 'Abrir ventana',
  updateNotice: 'Información en proceso de actualización técnica.',
  accentColor: '#10b981'
}

const DIMENSION_OPTIONS: DimensionType[] = ['Ambiental', 'Urbanística', 'Social', 'Económica']
const STATUS_OPTIONS: StatusType[] = ['En producción', 'Activo', 'Inactivo', 'En actualización']

const settingStyle = `
  .widget-setting-aplicativos-por-indicador .jimu-widget-setting--row-label {
    width: 100% !important;
    white-space: normal !important;
    word-break: normal !important;
    margin-bottom: 5px !important;
    color: #cccccc !important;
    font-size: 11.5px !important;
    font-weight: 500 !important;
  }
  .widget-setting-aplicativos-por-indicador .jimu-widget-setting--row {
    margin-bottom: 12px !important;
  }
`

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const config = props.config
  const headerSubtitle = config?.headerSubtitle ?? ''
  const headerTitle = config?.headerTitle ?? 'Aplicativos por Indicador'
  const headerDescription = config?.headerDescription ?? ''

  // Obtener las ventanas (dialogs) creadas en este Experience Builder
  const availableWindows = useMemo(() => {
    try {
      const state = getAppStore().getState()
      const appConfig = state.appStateInBuilder?.appConfig || state.appConfig
      const dialogs = appConfig?.dialogs
      if (!dialogs) return []
      return Object.values(dialogs).map((d: any) => ({
        id: d.id,
        label: d.label || d.id
      }))
    } catch (e) {
      return []
    }
  }, [])

  const rawCards = (config?.cards as any)?.asMutable ? (config.cards as any).asMutable({ deep: true }) : (config?.cards || [])
  const cards: BoardCardConfig[] = rawCards.length > 0 ? rawCards : [{ ...DEFAULT_NEW_BOARD, id: 'tablero-ejemplo-1' }]

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
    const newId = `tablero-${Date.now()}`
    const newCard: BoardCardConfig = {
      ...DEFAULT_NEW_BOARD,
      id: newId,
      kpiCode: `KPI - ${String(cards.length + 1).padStart(2, '0')}`,
      title: `Nuevo Aplicativo ${cards.length + 1}`
    }
    const nextCards = [...cards, newCard]
    setExpandedCardId(newId)
    updateConfig({ cards: nextCards })
  }

  const handleResetToOneCard = () => {
    const singleCard: BoardCardConfig = {
      ...DEFAULT_NEW_BOARD,
      id: `tablero-${Date.now()}`
    }
    setExpandedCardId(singleCard.id)
    updateConfig({ cards: [singleCard] })
  }

  const handleRemoveCard = (id: string) => {
    const nextCards = cards.filter((c) => c.id !== id)
    if (nextCards.length === 0) {
      nextCards.push({ ...DEFAULT_NEW_BOARD, id: `tablero-${Date.now()}` })
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

  const handleCardChange = (id: string, field: keyof BoardCardConfig, value: any) => {
    const nextCards = cards.map((c) => {
      if (c.id === id) {
        return { ...c, [field]: value }
      }
      return c
    })
    updateConfig({ cards: nextCards })
  }

  return (
    <div
      className="widget-setting-aplicativos-por-indicador"
      style={{
        padding: '12px',
        color: '#e0e0e0',
        fontFamily: '"Avenir Next", "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: settingStyle }} />

      {/* SECCIÓN 1: TEXTOS DE CABECERA */}
      <SettingSection title="Cabecera del Catálogo">
        <SettingRow label="Subtítulo:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff' }}
            value={headerSubtitle}
            onChange={(e) => updateConfig({ headerSubtitle: e.target.value })}
            placeholder="Ej: SEGUIMIENTO TERRITORIAL"
          />
        </SettingRow>

        <SettingRow label="Título Principal:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff' }}
            value={headerTitle}
            onChange={(e) => updateConfig({ headerTitle: e.target.value })}
            placeholder="Aplicativos por Indicador"
          />
        </SettingRow>

        <SettingRow label="Descripción General:" flow="wrap">
          <TextArea
            style={{ width: '100%', minHeight: '65px', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff', lineHeight: 1.4 }}
            value={headerDescription}
            onChange={(e) => updateConfig({ headerDescription: e.target.value })}
            placeholder="Descripción general del catálogo..."
          />
        </SettingRow>
      </SettingSection>

      {/* SECCIÓN 2: GESTIÓN DE TARJETAS (ESCALA DE GRISES) */}
      <SettingSection title={`Tableros y Aplicativos (${cards.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
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
              gap: '6px'
            }}
            onClick={handleAddCard}
          >
            + Añadir Tablero / Aplicativo
          </button>

          {cards.length > 1 && (
            <button
              type="button"
              style={{
                width: '100%',
                padding: '5px 10px',
                borderRadius: '4px',
                background: '#202020',
                border: '1px solid #383838',
                color: '#aaaaaa',
                fontSize: '11px',
                cursor: 'pointer'
              }}
              onClick={handleResetToOneCard}
              title="Borra todas las tarjetas y deja sólo una vacía a modo de ejemplo"
            >
              Borrar todas y dejar solo 1 de ejemplo
            </button>
          )}
        </div>

        {cards.map((card, idx) => {
          const isExpanded = expandedCardId === card.id || (cards.length === 1 && expandedCardId === null)

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
                    {card.kpiCode || `KPI - 0${idx + 1}`}
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
                    title={card.title || 'Nuevo aplicativo vacío'}
                  >
                    {card.title || '(Aplicativo sin título)'}
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
                  {/* Campo: Número de KPI */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Número del KPI:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.kpiCode || ''}
                      onChange={(e) => handleCardChange(card.id, 'kpiCode', e.target.value)}
                      placeholder="Ej: KPI - 01"
                    />
                  </div>

                  {/* Campo: Nombre del Tablero / Aplicativo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Nombre del Tablero / Aplicativo:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.title || ''}
                      onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                      placeholder="Ej: Nombre del aplicativo"
                    />
                  </div>

                  {/* Campo: Dimensión (4 oficiales) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Dimensión Territorial:
                    </label>
                    <Select
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.dimension}
                      onChange={(e) => handleCardChange(card.id, 'dimension', e.target.value)}
                    >
                      {DIMENSION_OPTIONS.map((dim) => (
                        <Option key={dim} value={dim}>{dim}</Option>
                      ))}
                    </Select>
                  </div>

                  {/* Campo: Estado Operativo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Estado Operativo:
                    </label>
                    <Select
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.status}
                      onChange={(e) => handleCardChange(card.id, 'status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <Option key={st} value={st}>{st}</Option>
                      ))}
                    </Select>
                  </div>

                  {/* Campo: Fecha de Actualización */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Fecha de Actualización:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.updateDate || ''}
                      onChange={(e) => handleCardChange(card.id, 'updateDate', e.target.value)}
                      placeholder="Ej: Octubre 2024 o 15/10/2024"
                    />
                  </div>

                  {/* Campo condicional: Advertencia cuando está 'En actualización' */}
                  {card.status === 'En actualización' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', background: '#262626', border: '1px solid #444444', borderLeft: '3px solid #888888', padding: '8px', borderRadius: '2px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#e0e0e0', margin: 0 }}>
                        Mensaje de Advertencia (Actualización):
                      </label>
                      <TextInput
                        size="sm"
                        style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                        value={card.updateNotice || ''}
                        onChange={(e) => handleCardChange(card.id, 'updateNotice', e.target.value)}
                        placeholder="Información en proceso de actualización técnica..."
                      />
                    </div>
                  )}

                  {/* SECCIÓN DE VINCULACIÓN: VENTANAS DE EXPERIENCE BUILDER O URL */}
                  {card.status !== 'Inactivo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: '#222222', border: '1px solid #333333', borderRadius: '4px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Acción del Botón:
                      </span>

                      {/* Selector de Tipo de Destino */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                        <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                          Tipo de Destino:
                        </label>
                        <Select
                          size="sm"
                          style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                          value={card.targetType || (card.dialogId ? 'window' : (card.appUrl ? 'url' : 'window'))}
                          onChange={(e) => handleCardChange(card.id, 'targetType', e.target.value as ActionTargetType)}
                        >
                          <Option value="window">Ventana emergente de Experience Builder</Option>
                          <Option value="url">Enlace web externo (URL)</Option>
                        </Select>
                      </div>

                      {/* Lista de Ventanas si targetType es 'window' */}
                      {(card.targetType === 'window' || (!card.targetType && !card.appUrl)) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                          <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                            Ventana a abrir:
                          </label>
                          {availableWindows.length > 0 ? (
                            <Select
                              size="sm"
                              style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                              value={card.dialogId || ''}
                              onChange={(e) => handleCardChange(card.id, 'dialogId', e.target.value)}
                            >
                              <Option value="">-- Selecciona una ventana --</Option>
                              {availableWindows.map((win) => (
                                <Option key={win.id} value={win.id}>{win.label}</Option>
                              ))}
                            </Select>
                          ) : (
                            <div style={{ padding: '8px', background: '#1c1c1c', border: '1px dashed #444444', borderRadius: '4px', fontSize: '11px', color: '#aaaaaa', lineHeight: 1.4 }}>
                              ℹ No hay ventanas creadas en este Experience Builder. Crea una ventana en el menú lateral <strong>Páginas &gt; Ventanas</strong> para seleccionarla aquí.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Input de URL si targetType es 'url' */}
                      {card.targetType === 'url' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                          <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                            URL Web Externa:
                          </label>
                          <TextInput
                            size="sm"
                            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                            value={card.appUrl || ''}
                            onChange={(e) => handleCardChange(card.id, 'appUrl', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {/* Texto del Botón */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                        <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                          Texto del Botón:
                        </label>
                        <TextInput
                          size="sm"
                          style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                          value={card.buttonText || ''}
                          onChange={(e) => handleCardChange(card.id, 'buttonText', e.target.value)}
                          placeholder={card.targetType === 'window' ? 'Abrir ventana' : 'Abrir aplicativo'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Campo: Descripción Técnica */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Descripción Técnica:
                    </label>
                    <TextArea
                      style={{ width: '100%', minHeight: '75px', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff', lineHeight: 1.4 }}
                      value={card.description || ''}
                      onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                      placeholder="Descripción del aplicativo, capas geográficas y rol analítico..."
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
