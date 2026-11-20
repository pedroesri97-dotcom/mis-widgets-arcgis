/**
 * ============================================================================
 * PANEL DE CONFIGURACIÓN: DATOS Y SERVICIOS (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Interfaz en escala de grises con diseño vertical responsivo (sin cortes de texto).
 * Permite configurar cabeceras del catálogo, fuentes oficiales, tipo de dato,
 * fechas de actualización, enlaces/ventanas, avisos de datos no abiertos y descripciones.
 */

import { React, Immutable, getAppStore } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, TextArea, Select, Option } from 'jimu-ui'
import type { IMConfig, DataServiceCardConfig, DataServiceActionType } from '../config'

const { useState, useMemo } = React

const DEFAULT_NEW_CARD: DataServiceCardConfig = {
  id: '',
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

const DATA_TYPE_PRESETS = [
  'Servicio Feature Service (REST)',
  'Servicio WFS / WMS',
  'Capa Vectorial (Shapefile / GeoJSON)',
  'Tabla Alfanumérica (CSV / Excel)',
  'Ráster / Ortofoto / DEM',
  'API Geoespacial / JSON',
  'Documento Técnico / PDF'
]

const settingStyle = `
  .widget-setting-datos-y-servicios .jimu-widget-setting--row-label {
    width: 100% !important;
    white-space: normal !important;
    word-break: normal !important;
    margin-bottom: 5px !important;
    color: #cccccc !important;
    font-size: 11.5px !important;
    font-weight: 500 !important;
  }
  .widget-setting-datos-y-servicios .jimu-widget-setting--row {
    margin-bottom: 12px !important;
  }
`

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const config = props.config
  const headerSubtitle = config?.headerSubtitle ?? ''
  const headerTitle = config?.headerTitle ?? 'Datos y Servicios'
  const headerDescription = config?.headerDescription ?? ''

  // Ventanas creadas en Experience Builder
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
  const cards: DataServiceCardConfig[] = rawCards.length > 0 ? rawCards : [{ ...DEFAULT_NEW_CARD, id: 'dato-ejemplo-1' }]

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
    const newId = `dato-${Date.now()}`
    const newCard: DataServiceCardConfig = {
      ...DEFAULT_NEW_CARD,
      id: newId,
      title: `Nuevo Conjunto de Datos ${cards.length + 1}`
    }
    const nextCards = [...cards, newCard]
    setExpandedCardId(newId)
    updateConfig({ cards: nextCards })
  }

  const handleResetToOneCard = () => {
    const singleCard: DataServiceCardConfig = {
      ...DEFAULT_NEW_CARD,
      id: `dato-${Date.now()}`
    }
    setExpandedCardId(singleCard.id)
    updateConfig({ cards: [singleCard] })
  }

  const handleRemoveCard = (id: string) => {
    const nextCards = cards.filter((c) => c.id !== id)
    if (nextCards.length === 0) {
      nextCards.push({ ...DEFAULT_NEW_CARD, id: `dato-${Date.now()}` })
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

  const handleCardChange = (id: string, field: keyof DataServiceCardConfig, value: any) => {
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
      className="widget-setting-datos-y-servicios"
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
      <SettingSection title="Cabecera del Catálogo">
        <SettingRow label="Subtítulo:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff' }}
            value={headerSubtitle}
            onChange={(e) => updateConfig({ headerSubtitle: e.target.value })}
            placeholder="Ej: CATÁLOGO DE INFORMACIÓN"
          />
        </SettingRow>

        <SettingRow label="Título Principal:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff' }}
            value={headerTitle}
            onChange={(e) => updateConfig({ headerTitle: e.target.value })}
            placeholder="Datos y Servicios"
          />
        </SettingRow>

        <SettingRow label="Descripción General:" flow="wrap">
          <TextArea
            style={{ width: '100%', minHeight: '65px', background: '#1c1c1c', border: '1px solid #444444', color: '#ffffff', lineHeight: 1.4 }}
            value={headerDescription}
            onChange={(e) => updateConfig({ headerDescription: e.target.value })}
            placeholder="Descripción general del catálogo de datos..."
          />
        </SettingRow>
      </SettingSection>

      {/* SECCIÓN 2: GESTIÓN DE TARJETAS (ESCALA DE GRISES) */}
      <SettingSection title={`Conjuntos de Datos y Servicios (${cards.length})`}>
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
            + Añadir Dato / Servicio
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
                    title={card.title || 'Nuevo dato sin título'}
                  >
                    {card.title || '(Dato sin título)'}
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
                  {/* Nombre del Dato */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Nombre del Dato o Servicio:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.title || ''}
                      onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                      placeholder="Ej: Límite Político Administrativo Distrital"
                    />
                  </div>

                  {/* Fuente */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Fuente Oficial:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.source || ''}
                      onChange={(e) => handleCardChange(card.id, 'source', e.target.value)}
                      placeholder="Ej: Secretaría Distrital de Planeación"
                    />
                  </div>

                  {/* Tipo de Dato */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tipo de Dato:
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.dataType || ''}
                      onChange={(e) => handleCardChange(card.id, 'dataType', e.target.value)}
                      placeholder="Ej: Servicio Feature Service (REST), Vectorial, WMS..."
                    />
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                      {DATA_TYPE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          style={{
                            fontSize: '9.5px',
                            background: '#282828',
                            border: '1px solid #3d3d3d',
                            borderRadius: '3px',
                            color: '#999999',
                            padding: '2px 5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleCardChange(card.id, 'dataType', preset)}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fecha de Actualización */}
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

                  {/* Enlace y tipo de destino */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: '#222222', border: '1px solid #333333', borderRadius: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Enlace de Acceso (Si no se define, se marcará como no abierto):
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                      <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                        Tipo de Destino:
                      </label>
                      <Select
                        size="sm"
                        style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                        value={card.targetType || 'url'}
                        onChange={(e) => handleCardChange(card.id, 'targetType', e.target.value as DataServiceActionType)}
                      >
                        <Option value="url">Enlace web / URL externa (API, Portal, Descarga)</Option>
                        <Option value="window">Ventana emergente de Experience Builder</Option>
                      </Select>
                    </div>

                    {card.targetType === 'window' ? (
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
                          <div style={{ padding: '8px', background: '#1c1c1c', border: '1px dashed #444444', borderRadius: '4px', fontSize: '11px', color: '#aaaaaa' }}>
                            ℹ No hay ventanas creadas en este Experience Builder.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                        <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                          URL del Enlace:
                        </label>
                        <TextInput
                          size="sm"
                          style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                          value={card.url || ''}
                          onChange={(e) => handleCardChange(card.id, 'url', e.target.value)}
                          placeholder="https://... (Dejar en blanco para indicar dato no abierto)"
                        />
                      </div>
                    )}

                    {/* Texto del Botón (si hay enlace) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                      <label style={{ fontSize: '11px', color: '#b0b0b0', margin: 0 }}>
                        Texto del Botón (cuando hay enlace):
                      </label>
                      <TextInput
                        size="sm"
                        style={{ width: '100%', background: '#1c1c1c', border: '1px solid #3d3d3d', color: '#ffffff' }}
                        value={card.buttonText || ''}
                        onChange={(e) => handleCardChange(card.id, 'buttonText', e.target.value)}
                        placeholder="Acceder al dato"
                      />
                    </div>
                  </div>

                  {/* Letrero cuando NO hay enlace */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Letrero cuando NO hay enlace (Dato no abierto):
                    </label>
                    <TextInput
                      size="sm"
                      style={{ width: '100%', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff' }}
                      value={card.nonOpenDataNotice || ''}
                      onChange={(e) => handleCardChange(card.id, 'nonOpenDataNotice', e.target.value)}
                      placeholder="Este dato no es un dato abierto"
                    />
                  </div>

                  {/* Descripción Técnica */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0b0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Descripción Técnica:
                    </label>
                    <TextArea
                      style={{ width: '100%', minHeight: '75px', background: '#242424', border: '1px solid #3d3d3d', color: '#ffffff', lineHeight: 1.4 }}
                      value={card.description || ''}
                      onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                      placeholder="Descripción técnica del dato, sistema de coordenadas, formato y uso recomendado..."
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
