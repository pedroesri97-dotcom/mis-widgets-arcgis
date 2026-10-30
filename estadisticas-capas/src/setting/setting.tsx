import { React, Immutable, getAppStore } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { TextInput } from 'jimu-ui'
import { MapViewManager } from 'jimu-arcgis'
import type { IMConfig, LayerStatCardConfig, StatType, InfoModalConfig, ExtraModalStat } from '../config'

const { useState, useEffect, useCallback } = React

const cleanStr = (str: string): string => {
  if (!str) return ''
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

const DEFAULT_CARDS: LayerStatCardConfig[] = []

export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const { config, id, onSettingChange } = props
  const [detectedLayers, setDetectedLayers] = useState<string[]>([])
  const [layerFields, setLayerFields] = useState<{ [layerName: string]: Array<{ name: string; alias: string; type: string }> }>({})
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const cards: LayerStatCardConfig[] = (config?.cards as any) || DEFAULT_CARDS

  const scanLayers = useCallback(() => {
    const list = new Set<string>()
    const fieldsMap: { [layerKey: string]: Array<{ name: string; alias: string; type: string }> } = {}

    try {
      if (typeof sessionStorage !== 'undefined') {
        const storedFields = sessionStorage.getItem('__exb_layer_fields__')
        if (storedFields) {
          const parsed = JSON.parse(storedFields)
          Object.keys(parsed).forEach((k) => {
            if (Array.isArray(parsed[k])) fieldsMap[k] = parsed[k]
          })
        }
      }

      const globalFields = (window as any).__exb_layer_fields__ || (window.top as any)?.__exb_layer_fields__
      if (globalFields) {
        Object.keys(globalFields).forEach((k) => {
          if (Array.isArray(globalFields[k])) fieldsMap[k] = globalFields[k]
        })
      }

      const topLayers = (window.top as any)?.__exb_detected_map_layers__ || (window as any)?.__exb_detected_map_layers__
      if (Array.isArray(topLayers)) {
        topLayers.forEach((t: string) => { if (t) list.add(t.trim()) })
      }
    } catch (e) {}

    try {
      const mapManager = MapViewManager.getInstance()
      const allViews = mapManager.getAllJimuMapView()
      const jmvList = Array.isArray(allViews) ? [...allViews] : Object.values(allViews || {})

      jmvList.forEach((jmv: any) => {
        const map = jmv?.view?.map
        if (map) {
          const scanMap = (layerList: any[]) => {
            if (!layerList || !Array.isArray(layerList)) return
            layerList.forEach((l: any) => {
              if (!l || l.isBasemap) return
              const t = (l.title || l.id || '').trim()
              if (t) {
                list.add(t)
                if (l.fields && Array.isArray(l.fields) && l.fields.length > 0) {
                  fieldsMap[t] = l.fields.map((f: any) => ({
                    name: f.name,
                    alias: f.alias || f.name,
                    type: f.type || 'string'
                  }))
                }
              }

              if (l.layers && typeof l.layers.forEach === 'function') {
                const ch = l.layers.toArray ? l.layers.toArray() : (Array.isArray(l.layers) ? l.layers : [])
                scanMap(ch)
              }
              if (l.sublayers && typeof l.sublayers.forEach === 'function') {
                const subs = l.sublayers.toArray ? l.sublayers.toArray() : (Array.isArray(l.sublayers) ? l.sublayers : [])
                scanMap(subs)
              }
            })
          }

          const allLayers = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])
          scanMap(allLayers)
        }
      })
    } catch (e) {}

    try {
      const appState = getAppStore().getState()
      const dataSources = appState.appConfig?.dataSources || {}
      Object.values(dataSources).forEach((ds: any) => {
        const lbl = (ds.label || ds.layerDefinition?.name || '').trim()
        if (lbl) {
          list.add(lbl)
          const dsFields = ds.schema?.fields || ds.layerDefinition?.fields
          if (dsFields) {
            const fieldList = Array.isArray(dsFields) ? dsFields : Object.values(dsFields)
            fieldsMap[lbl] = fieldList.map((f: any) => ({
              name: f.name || f.jimuFieldName,
              alias: f.alias || f.name,
              type: f.type || 'string'
            }))
          }
        }
      })

      const widgets = appState.appConfig?.widgets || {}
      Object.values(widgets).forEach((w: any) => {
        if (w.uri?.includes('capas-tematicas') && w.config?.categories) {
          w.config.categories.forEach((cat: any) => {
            cat.layers?.forEach((l: any) => {
              if (l.title) list.add(l.title.trim())
              if (l.mapLayerTitle) list.add(l.mapLayerTitle.trim())
              if (l.sceneLayerTitle) list.add(l.sceneLayerTitle.trim())
            })
          })
        }
      })
    } catch (e) {}

    cards.forEach((c) => {
      if (c.layerTrigger && c.layerTrigger !== '__all_layers__') {
        list.add(c.layerTrigger.trim())
      }
    })

    setDetectedLayers(Array.from(list).filter(Boolean).sort((a, b) => a.localeCompare(b)))
    setLayerFields((prev) => ({ ...prev, ...fieldsMap }))
  }, [cards])

  useEffect(() => {
    scanLayers()
  }, [scanLayers])

  const onMapSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds
    })
  }

  const updateCardProp = (cardId: string, prop: keyof LayerStatCardConfig, value: any) => {
    const nextCards = cards.map((c) => {
      if (c.id === cardId) {
        return { ...c, [prop]: value }
      }
      return c
    })

    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
  }

  const updateCardModalProp = (cardId: string, modalProp: keyof InfoModalConfig, value: any) => {
    const nextCards = cards.map((c) => {
      if (c.id === cardId) {
        const nextModal = { ...(c.infoModal || {}), [modalProp]: value }
        return { ...c, infoModal: nextModal }
      }
      return c
    })

    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
  }

  const addExtraStatToCard = (cardId: string) => {
    const nextCards = cards.map((c) => {
      if (c.id === cardId) {
        const curExtra = [...(c.infoModal?.extraStats || [])]
        if (curExtra.length >= 3) return c
        const newStat: ExtraModalStat = {
          id: `extra-${Date.now()}`,
          label: `ESTADÍSTICA ${curExtra.length + 1}`,
          valueMode: 'layer',
          value: '0',
          statType: 'count',
          statField: '',
          decimalPlaces: 0,
          unit: ''
        }
        const nextModal = { ...(c.infoModal || {}), extraStats: [...curExtra, newStat] }
        return { ...c, infoModal: nextModal }
      }
      return c
    })

    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
  }

  const removeExtraStatFromCard = (cardId: string, statIdx: number) => {
    const nextCards = cards.map((c) => {
      if (c.id === cardId) {
        const curExtra = (c.infoModal?.extraStats || []).filter((_, i) => i !== statIdx)
        const nextModal = { ...(c.infoModal || {}), extraStats: curExtra }
        return { ...c, infoModal: nextModal }
      }
      return c
    })

    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
  }

  const updateCardExtraStat = (cardId: string, statIdx: number, prop: keyof ExtraModalStat, value: any) => {
    const nextCards = cards.map((c) => {
      if (c.id === cardId) {
        const curExtra = [...(c.infoModal?.extraStats || [])]
        if (curExtra[statIdx]) {
          curExtra[statIdx] = { ...curExtra[statIdx], [prop]: value }
        }
        const nextModal = { ...(c.infoModal || {}), extraStats: curExtra }
        return { ...c, infoModal: nextModal }
      }
      return c
    })

    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
  }

  const deleteCard = (cardId: string) => {
    const nextCards = cards.filter((c) => c.id !== cardId)
    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
    if (expandedCardId === cardId) {
      setExpandedCardId(null)
    }
  }

  const addCard = () => {
    const newId = `stat-${Date.now()}`
    const newCard: LayerStatCardConfig = {
      id: newId,
      layerTrigger: '',
      cardTitle: 'NUEVA ESTADÍSTICA',
      valueMode: 'layer',
      value: '0',
      unit: '',
      statType: 'count',
      statField: '',
      decimalPlaces: 0,
      description: '',
      accentColor: '#00e5ff',
      unitColor: '#00b4d8',
      descriptionColor: '#34d399',
      infoModal: {
        title: 'NUEVO INDICADOR',
        description: '',
        source: 'Secretaría Distrital de Planeación (SDP)',
        lastUpdate: '2026',
        frequency: 'Tiempo real',
        extraStats: [],
        buttonText: '',
        buttonUrl: ''
      }
    }

    const nextCards = [...cards, newCard]
    onSettingChange({
      id,
      config: config.set('cards', nextCards)
    })
    setExpandedCardId(newId)
  }

  return (
    <div
      className="widget-setting-estadisticas-capas"
      style={{
        padding: '12px',
        color: '#ffffff',
        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#1f1f1f'
      }}
    >
      {/* SECCIÓN 1: VINCULACIÓN AL MAPA */}
      <SettingSection title="Mapa / Escena">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <label style={{ fontSize: '11px', color: '#a8a8a8', display: 'block', width: '100%' }}>
            Widget de mapa o escena:
          </label>
          <div style={{ width: '100%' }}>
            <MapWidgetSelector
              onSelect={onMapSelected}
              useMapWidgetIds={props.useMapWidgetIds}
            />
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 2: TEXTOS GENERALES */}
      <SettingSection title="Textos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '11px', color: '#a8a8a8', display: 'block', marginBottom: '3px', width: '100%' }}>
              Título principal:
            </label>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config?.headerTitle || ''}
              onChange={(e) => onSettingChange({ id, config: config.set('headerTitle', e.target.value) })}
              placeholder="MÉTRICAS Y ESTADÍSTICAS"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '11px', color: '#a8a8a8', display: 'block', marginBottom: '3px', width: '100%' }}>
              Mensaje sin capas activas:
            </label>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config?.noLayerMessage || ''}
              onChange={(e) => onSettingChange({ id, config: config.set('noLayerMessage', e.target.value) })}
              placeholder="Activa una o más capas en el explorador territorial..."
            />
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 3: CONFIGURACIÓN DE TARJETAS ESTADÍSTICAS */}
      <SettingSection title="Estadísticas de Capas">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button
            type="button"
            onClick={addCard}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#007ac2',
              color: '#ffffff',
              border: '1px solid #007ac2',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxSizing: 'border-box'
            }}
          >
            <span>+</span>
            <span>Agregar estadística</span>
          </button>

          {/* Lista de tarjetas configuradas */}
          {cards.length === 0 ? (
            <div
              style={{
                background: '#262626',
                padding: '12px',
                borderRadius: '2px',
                border: '1px solid #333333',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                color: '#8c8c8c',
                fontSize: '11px'
              }}
            >
              No hay estadísticas configuradas.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              {cards.map((card, idx) => {
                const isExpanded = expandedCardId === card.id
                const isLayerMode = card.valueMode === 'layer'
                const isAllLayers = card.layerTrigger === '__all_layers__'

                const availableFields = (() => {
                  if (!card.layerTrigger || card.layerTrigger === '__all_layers__') return []
                  const cTrigger = cleanStr(card.layerTrigger)
                  const stripTrigger = cleanStr(card.layerTrigger.replace(/^\d+[\s.-]+/, ''))

                  for (const key of Object.keys(layerFields)) {
                    const cKey = cleanStr(key)
                    const stripKey = cleanStr(key.replace(/^\d+[\s.-]+/, ''))
                    if (cKey === cTrigger || (stripTrigger && stripKey === stripTrigger)) {
                      return layerFields[key] || []
                    }
                  }

                  for (const key of Object.keys(layerFields)) {
                    const cKey = cleanStr(key)
                    if (cKey.length >= 4 && cTrigger.length >= 4) {
                      if (cKey.includes(cTrigger) || cTrigger.includes(cKey)) {
                        return layerFields[key] || []
                      }
                    }
                  }
                  return []
                })()

                const fieldOptions = (() => {
                  const list = [...availableFields]
                  if (card.statField && !list.some((f) => f.name === card.statField)) {
                    list.unshift({ name: card.statField, alias: card.statField, type: 'number' })
                  }
                  return list
                })()

                return (
                  <div
                    key={card.id}
                    style={{
                      background: '#262626',
                      border: '1px solid #333333',
                      borderLeft: `3px solid ${card.accentColor || '#007ac2'}`,
                      borderRadius: '2px',
                      overflow: 'hidden',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Cabecera del acordeón */}
                    <div
                      onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        background: isExpanded ? '#2d2d2d' : '#262626',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '9px', color: '#a8a8a8', flexShrink: 0 }}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {card.cardTitle || `Estadística ${idx + 1}`}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            color: isLayerMode ? '#ffffff' : '#8c8c8c',
                            background: '#1c1c1c',
                            padding: '1px 5px',
                            borderRadius: '2px',
                            flexShrink: 0
                          }}
                        >
                          {isAllLayers ? 'TODAS' : isLayerMode ? (card.statType || 'count').toUpperCase() : 'FIJO'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteCard(card.id)
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#a8a8a8',
                          cursor: 'pointer',
                          fontSize: '11px',
                          padding: '2px 4px',
                          flexShrink: 0
                        }}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Formulario desplegado: 100% VERTICAL */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          background: '#1f1f1f',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* 1. Capa vinculada */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                            Capa vinculada:
                          </label>
                          <select
                            value={card.layerTrigger}
                            onChange={(e) => {
                              const val = e.target.value
                              updateCardProp(card.id, 'layerTrigger', val)
                              if (!card.cardTitle || card.cardTitle === 'NUEVA ESTADÍSTICA') {
                                const newTitle = val === '__all_layers__' ? 'RECUENTO TOTAL DE CAPAS' : val.toUpperCase()
                                updateCardProp(card.id, 'cardTitle', newTitle)
                              }
                            }}
                            style={{
                              width: '100%',
                              background: '#1c1c1c',
                              border: '1px solid #333333',
                              color: '#ffffff',
                              borderRadius: '2px',
                              padding: '6px 8px',
                              fontSize: '11px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="">-- Seleccionar capa ({detectedLayers.length}) --</option>
                            <option value="__all_layers__">
                              ★ Todas las capas activas (Recuento global)
                            </option>
                            {Array.from(new Set([card.layerTrigger, ...detectedLayers]))
                              .filter(Boolean)
                              .filter((l) => l !== '__all_layers__')
                              .map((l) => (
                                <option key={l} value={l}>
                                  {l}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* 2. Título de la tarjeta */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                            Título de la tarjeta:
                          </label>
                          <TextInput
                            size="sm"
                            style={{ width: '100%' }}
                            value={card.cardTitle}
                            onChange={(e) => updateCardProp(card.id, 'cardTitle', e.target.value)}
                            placeholder="Ej: VOLUMETRÍA URBANA 3D"
                          />
                        </div>

                        {/* 3. Origen del valor */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '3px', width: '100%' }}>
                            Origen del valor:
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => updateCardProp(card.id, 'valueMode', 'layer')}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                borderRadius: '2px',
                                border: isLayerMode ? '1px solid #007ac2' : '1px solid #333333',
                                background: isLayerMode ? '#283442' : '#262626',
                                color: isLayerMode ? '#ffffff' : '#a8a8a8',
                                fontSize: '10.5px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                            >
                              Cálculo sobre la capa
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCardProp(card.id, 'valueMode', 'fixed')}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                borderRadius: '2px',
                                border: !isLayerMode ? '1px solid #007ac2' : '1px solid #333333',
                                background: !isLayerMode ? '#283442' : '#262626',
                                color: !isLayerMode ? '#ffffff' : '#a8a8a8',
                                fontSize: '10.5px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                            >
                              Valor fijo manual
                            </button>
                          </div>
                        </div>

                        {/* 4. Contenido según Modo */}
                        {!isLayerMode ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                            <div style={{ width: '100%' }}>
                              <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                                Valor manual:
                              </label>
                              <TextInput
                                size="sm"
                                style={{ width: '100%' }}
                                value={card.value || ''}
                                onChange={(e) => updateCardProp(card.id, 'value', e.target.value)}
                                placeholder="Ej: 56.689, 100%, B4"
                              />
                            </div>
                            <div style={{ width: '100%' }}>
                              <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                                Unidad:
                              </label>
                              <TextInput
                                size="sm"
                                style={{ width: '100%' }}
                                value={card.unit || ''}
                                onChange={(e) => updateCardProp(card.id, 'unit', e.target.value)}
                                placeholder="Ej: edificaciones, predios, m²"
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              background: '#262626',
                              padding: '8px',
                              borderRadius: '2px',
                              border: '1px solid #333333',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                                Tipo de cálculo:
                              </label>
                              <select
                                value={card.statType || 'count'}
                                onChange={(e) => updateCardProp(card.id, 'statType', e.target.value as StatType)}
                                style={{
                                  width: '100%',
                                  background: '#1c1c1c',
                                  border: '1px solid #333333',
                                  color: '#ffffff',
                                  borderRadius: '2px',
                                  padding: '6px 8px',
                                  fontSize: '11px',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              >
                                <option value="count">Recuento de entidades (COUNT)</option>
                                <option value="sum">Suma de valores de campo (SUM)</option>
                                <option value="avg">Promedio de campo (AVG)</option>
                                <option value="min">Valor mínimo de campo (MIN)</option>
                                <option value="max">Valor máximo de campo (MAX)</option>
                              </select>
                            </div>

                            {card.statType !== 'count' && (
                              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{ fontSize: '10px', color: '#a8a8a8', marginBottom: '2px', width: '100%' }}>
                                  Campo numérico:
                                </label>
                                <select
                                  value={card.statField || ''}
                                  onChange={(e) => updateCardProp(card.id, 'statField', e.target.value)}
                                  style={{
                                    width: '100%',
                                    background: '#1c1c1c',
                                    border: '1px solid #333333',
                                    color: '#ffffff',
                                    borderRadius: '2px',
                                    padding: '6px 8px',
                                    fontSize: '11px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                  }}
                                >
                                  <option value="">-- Seleccionar campo ({fieldOptions.length}) --</option>
                                  {fieldOptions.map((f) => (
                                    <option key={f.name} value={f.name}>
                                      {f.alias && f.alias !== f.name ? `${f.alias} (${f.name})` : f.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Unidad */}
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                                Unidad:
                              </label>
                              <TextInput
                                size="sm"
                                style={{ width: '100%' }}
                                value={card.unit || ''}
                                onChange={(e) => updateCardProp(card.id, 'unit', e.target.value)}
                                placeholder="Ej: edificaciones, predios, ha"
                              />
                            </div>

                            {/* Decimales */}
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                                Decimales:
                              </label>
                              <select
                                value={card.decimalPlaces !== undefined ? card.decimalPlaces : (card.statType === 'avg' ? 2 : 0)}
                                onChange={(e) => updateCardProp(card.id, 'decimalPlaces', parseInt(e.target.value, 10))}
                                style={{
                                  width: '100%',
                                  background: '#1c1c1c',
                                  border: '1px solid #333333',
                                  color: '#ffffff',
                                  borderRadius: '2px',
                                  padding: '6px 8px',
                                  fontSize: '11px',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              >
                                <option value={0}>0 decimales (56.689)</option>
                                <option value={1}>1 decimal (56.689,0)</option>
                                <option value={2}>2 decimales (56.689,00)</option>
                              </select>
                            </div>

                            {/* Valor de respaldo */}
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                                Valor de respaldo:
                              </label>
                              <TextInput
                                size="sm"
                                style={{ width: '100%' }}
                                value={card.value || ''}
                                onChange={(e) => updateCardProp(card.id, 'value', e.target.value)}
                                placeholder="Ej: 0"
                              />
                            </div>
                          </div>
                        )}

                        {/* 5. Descripción al pie */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                            Descripción al pie:
                          </label>
                          <TextInput
                            size="sm"
                            style={{ width: '100%' }}
                            value={card.description || ''}
                            onChange={(e) => updateCardProp(card.id, 'description', e.target.value)}
                            placeholder="Ej: Cobertura total isócrona 15 min"
                          />
                        </div>

                        {/* 6. Colores */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                              Color de acento:
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                              <input
                                type="color"
                                value={card.accentColor || '#007ac2'}
                                onChange={(e) => updateCardProp(card.id, 'accentColor', e.target.value)}
                                style={{
                                  width: '32px',
                                  height: '24px',
                                  border: '1px solid #333333',
                                  background: '#1c1c1c',
                                  cursor: 'pointer'
                                }}
                              />
                              <span style={{ fontSize: '10px', color: '#a8a8a8', fontFamily: 'monospace' }}>
                                {card.accentColor || '#007ac2'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '10px', color: '#a8a8a8', display: 'block', marginBottom: '2px', width: '100%' }}>
                              Color de unidad:
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                              <input
                                type="color"
                                value={card.unitColor || '#a8a8a8'}
                                onChange={(e) => updateCardProp(card.id, 'unitColor', e.target.value)}
                                style={{
                                  width: '32px',
                                  height: '24px',
                                  border: '1px solid #333333',
                                  background: '#1c1c1c',
                                  cursor: 'pointer'
                                }}
                              />
                              <span style={{ fontSize: '10px', color: '#a8a8a8', fontFamily: 'monospace' }}>
                                {card.unitColor || '#a8a8a8'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 7. VENTANA EMERGENTE DE INFORMACIÓN */}
                        <div
                          style={{
                            background: '#242424',
                            border: '1px solid #333333',
                            borderRadius: '2px',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            width: '100%',
                            boxSizing: 'border-box',
                            marginTop: '2px'
                          }}
                        >
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>
                            Ventana emergente
                          </span>

                          {/* Título del modal */}
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                              Título del modal:
                            </label>
                            <TextInput
                              size="sm"
                              style={{ width: '100%' }}
                              value={card.infoModal?.title !== undefined ? card.infoModal.title : card.cardTitle}
                              onChange={(e) => updateCardModalProp(card.id, 'title', e.target.value)}
                              placeholder="Título de la ventana"
                            />
                          </div>

                          {/* Descripción del modal */}
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                              Descripción del modal:
                            </label>
                            <textarea
                              rows={3}
                              value={card.infoModal?.description !== undefined ? card.infoModal.description : (card.description || '')}
                              onChange={(e) => updateCardModalProp(card.id, 'description', e.target.value)}
                              placeholder="Descripción detallada del indicador..."
                              style={{
                                width: '100%',
                                background: '#1c1c1c',
                                border: '1px solid #333333',
                                color: '#ffffff',
                                borderRadius: '2px',
                                padding: '6px 8px',
                                fontSize: '11px',
                                lineHeight: 1.45,
                                outline: 'none',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit'
                              }}
                            />
                          </div>

                          {/* Estadísticas adicionales opcionales */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>
                                Estadísticas adicionales ({ (card.infoModal?.extraStats || []).length } / 3):
                              </span>
                            </div>

                            {/* Botón para agregar */}
                            {(card.infoModal?.extraStats || []).length < 3 && (
                              <button
                                type="button"
                                onClick={() => addExtraStatToCard(card.id)}
                                style={{
                                  width: '100%',
                                  padding: '6px 8px',
                                  background: '#2b2b2b',
                                  border: '1px solid #3c3c3c',
                                  color: '#d9d9d9',
                                  borderRadius: '2px',
                                  fontSize: '10.5px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  boxSizing: 'border-box'
                                }}
                              >
                                <span>+</span>
                                <span>Agregar estadística al modal</span>
                              </button>
                            )}

                            {/* Lista de estadísticas adicionales */}
                            {(card.infoModal?.extraStats || []).map((st, sIdx) => {
                              const isExtraLayerMode = st.valueMode !== 'fixed'
                              return (
                                <div
                                  key={st.id || sIdx}
                                  style={{
                                    background: '#1c1c1c',
                                    border: '1px solid #333333',
                                    borderLeft: '3px solid #007ac2',
                                    borderRadius: '2px',
                                    padding: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>
                                      Estadística {sIdx + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeExtraStatFromCard(card.id, sIdx)}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#a8a8a8',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        padding: '0 4px',
                                        lineHeight: 1
                                      }}
                                      title="Eliminar"
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                      Etiqueta:
                                    </label>
                                    <TextInput
                                      size="sm"
                                      style={{ width: '100%' }}
                                      value={st.label || ''}
                                      onChange={(e) => updateCardExtraStat(card.id, sIdx, 'label', e.target.value)}
                                      placeholder="Ej: SUPERFICIE TOTAL"
                                    />
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                      Origen:
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
                                      <button
                                        type="button"
                                        onClick={() => updateCardExtraStat(card.id, sIdx, 'valueMode', 'layer')}
                                        style={{
                                          width: '100%',
                                          padding: '5px 6px',
                                          borderRadius: '2px',
                                          border: isExtraLayerMode ? '1px solid #007ac2' : '1px solid #333333',
                                          background: isExtraLayerMode ? '#283442' : '#262626',
                                          color: isExtraLayerMode ? '#ffffff' : '#a8a8a8',
                                          fontSize: '10px',
                                          fontWeight: 500,
                                          cursor: 'pointer',
                                          textAlign: 'center'
                                        }}
                                      >
                                        Cálculo sobre la capa
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateCardExtraStat(card.id, sIdx, 'valueMode', 'fixed')}
                                        style={{
                                          width: '100%',
                                          padding: '5px 6px',
                                          borderRadius: '2px',
                                          border: !isExtraLayerMode ? '1px solid #007ac2' : '1px solid #333333',
                                          background: !isExtraLayerMode ? '#283442' : '#262626',
                                          color: !isExtraLayerMode ? '#ffffff' : '#a8a8a8',
                                          fontSize: '10px',
                                          fontWeight: 500,
                                          cursor: 'pointer',
                                          textAlign: 'center'
                                        }}
                                      >
                                        Valor fijo manual
                                      </button>
                                    </div>
                                  </div>

                                  {isExtraLayerMode ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                          Cálculo:
                                        </label>
                                        <select
                                          value={st.statType || 'count'}
                                          onChange={(e) => updateCardExtraStat(card.id, sIdx, 'statType', e.target.value as StatType)}
                                          style={{
                                            width: '100%',
                                            background: '#262626',
                                            border: '1px solid #333333',
                                            color: '#ffffff',
                                            borderRadius: '2px',
                                            padding: '5px 6px',
                                            fontSize: '10px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                          }}
                                        >
                                          <option value="count">Recuento (COUNT)</option>
                                          <option value="sum">Suma (SUM)</option>
                                          <option value="avg">Promedio (AVG)</option>
                                          <option value="min">Mínimo (MIN)</option>
                                          <option value="max">Máximo (MAX)</option>
                                        </select>
                                      </div>

                                      {st.statType !== 'count' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                          <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                            Campo:
                                          </label>
                                          <select
                                            value={st.statField || ''}
                                            onChange={(e) => updateCardExtraStat(card.id, sIdx, 'statField', e.target.value)}
                                            style={{
                                              width: '100%',
                                              background: '#262626',
                                              border: '1px solid #333333',
                                              color: '#ffffff',
                                              borderRadius: '2px',
                                              padding: '5px 6px',
                                              fontSize: '10px',
                                              outline: 'none',
                                              boxSizing: 'border-box'
                                            }}
                                          >
                                            <option value="">-- Campo ({fieldOptions.length}) --</option>
                                            {fieldOptions.map((f) => (
                                              <option key={f.name} value={f.name}>
                                                {f.alias && f.alias !== f.name ? `${f.alias} (${f.name})` : f.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}

                                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                          Decimales:
                                        </label>
                                        <select
                                          value={st.decimalPlaces !== undefined ? st.decimalPlaces : (st.statType === 'avg' ? 2 : 0)}
                                          onChange={(e) => updateCardExtraStat(card.id, sIdx, 'decimalPlaces', parseInt(e.target.value, 10))}
                                          style={{
                                            width: '100%',
                                            background: '#262626',
                                            border: '1px solid #333333',
                                            color: '#ffffff',
                                            borderRadius: '2px',
                                            padding: '5px 6px',
                                            fontSize: '10px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                          }}
                                        >
                                          <option value={0}>0 decimales</option>
                                          <option value={1}>1 decimal</option>
                                          <option value={2}>2 decimales</option>
                                        </select>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                          Unidad:
                                        </label>
                                        <TextInput
                                          size="sm"
                                          style={{ width: '100%' }}
                                          value={st.unit || ''}
                                          onChange={(e) => updateCardExtraStat(card.id, sIdx, 'unit', e.target.value)}
                                          placeholder="Ej: m², ha, %"
                                        />
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                          Valor de respaldo:
                                        </label>
                                        <TextInput
                                          size="sm"
                                          style={{ width: '100%' }}
                                          value={st.value || ''}
                                          onChange={(e) => updateCardExtraStat(card.id, sIdx, 'value', e.target.value)}
                                          placeholder="Ej: 0"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                          Valor:
                                        </label>
                                        <TextInput
                                          size="sm"
                                          style={{ width: '100%' }}
                                          value={st.value || ''}
                                          onChange={(e) => updateCardExtraStat(card.id, sIdx, 'value', e.target.value)}
                                          placeholder="Ej: 100%, Conforme"
                                        />
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label style={{ fontSize: '9px', color: '#a8a8a8', marginBottom: '2px' }}>
                                          Unidad:
                                        </label>
                                        <TextInput
                                          size="sm"
                                          style={{ width: '100%' }}
                                          value={st.unit || ''}
                                          onChange={(e) => updateCardExtraStat(card.id, sIdx, 'unit', e.target.value)}
                                          placeholder="Ej: POT, Oficial"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Metadatos */}
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                              Fuente oficial:
                            </label>
                            <TextInput
                              size="sm"
                              style={{ width: '100%' }}
                              value={card.infoModal?.source !== undefined ? card.infoModal.source : 'Secretaría Distrital de Planeación (SDP)'}
                              onChange={(e) => updateCardModalProp(card.id, 'source', e.target.value)}
                              placeholder="Secretaría Distrital de Planeación (SDP)"
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                              Última actualización:
                            </label>
                            <TextInput
                              size="sm"
                              style={{ width: '100%' }}
                              value={card.infoModal?.lastUpdate !== undefined ? card.infoModal.lastUpdate : '07/07/2026'}
                              onChange={(e) => updateCardModalProp(card.id, 'lastUpdate', e.target.value)}
                              placeholder="07/07/2026"
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                              Frecuencia:
                            </label>
                            <TextInput
                              size="sm"
                              style={{ width: '100%' }}
                              value={card.infoModal?.frequency !== undefined ? card.infoModal.frequency : 'Tiempo real'}
                              onChange={(e) => updateCardModalProp(card.id, 'frequency', e.target.value)}
                              placeholder="Tiempo real"
                            />
                          </div>

                          {/* Botón opcional */}
                          <div
                            style={{
                              background: '#1c1c1c',
                              border: '1px solid #333333',
                              borderRadius: '2px',
                              padding: '8px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              width: '100%',
                              boxSizing: 'border-box',
                              marginTop: '2px'
                            }}
                          >
                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>
                              Botón de enlace
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                                Texto del botón:
                              </label>
                              <TextInput
                                size="sm"
                                style={{ width: '100%' }}
                                value={card.infoModal?.buttonText || ''}
                                onChange={(e) => updateCardModalProp(card.id, 'buttonText', e.target.value)}
                                placeholder="Ver información oficial"
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <label style={{ fontSize: '9.5px', color: '#a8a8a8', marginBottom: '2px' }}>
                                URL:
                              </label>
                              <TextInput
                                size="sm"
                                style={{ width: '100%' }}
                                value={card.infoModal?.buttonUrl || ''}
                                onChange={(e) => updateCardModalProp(card.id, 'buttonUrl', e.target.value)}
                                placeholder="https://sinupot.sdp.gov.co"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </SettingSection>
    </div>
  )
}
