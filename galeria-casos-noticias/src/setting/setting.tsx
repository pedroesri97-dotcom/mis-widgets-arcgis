/**
 * ============================================================================
 * PANEL DE CONFIGURACIÓN: GALERÍA DE CASOS Y NOTICIAS
 * ============================================================================
 * 
 * Interfaz en escala de grises con diseño vertical responsivo (sin cortes de texto).
 * Permite gestionar las noticias/casos, fuentes oficiales, fechas, seleccionar
 * ventanas de Experience Builder o URLs externas, y configurar colores y bucle.
 */

import { React, Immutable, getAppStore } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, TextArea, Select, Option, Switch } from 'jimu-ui'
import type { IMConfig, NewsCaseItem, ThemeColors } from '../config'

const { useState, useMemo } = React

const DEFAULT_THEME_COLORS: ThemeColors = {
  widgetBg: '#070c14',
  cardBg: '#0e1622',
  accentColor: '#007ac2',
  cardBorder: '#1a2533'
}

const DEFAULT_NEW_ITEM: NewsCaseItem = {
  id: '',
  title: 'Nuevo Caso de Estudio',
  source: 'Secretaría Distrital de Planeación',
  date: 'Noviembre 2024',
  imageUrl: '',
  url: '',
  dialogId: '',
  targetType: 'window',
  buttonText: 'Ver caso'
}

const settingStyle = `
  .widget-setting-galeria-casos-noticias .jimu-widget-setting--row-label,
  .widget-setting-galeria-casos-noticias label {
    width: 100% !important;
    white-space: normal !important;
    word-break: normal !important;
    margin-bottom: 5px !important;
    color: #cccccc !important;
    font-size: 11.5px !important;
    font-weight: 500 !important;
    font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif !important;
    font-style: normal !important;
  }
  .widget-setting-galeria-casos-noticias * {
    font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif !important;
    font-style: normal !important;
  }
  .widget-setting-galeria-casos-noticias .jimu-widget-setting--row {
    margin-bottom: 12px !important;
  }
`

export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const { config, id, onSettingChange } = props
  const headerSubtitle = config?.headerSubtitle ?? 'OBSERVATORIO · GALERÍA DE CASOS'
  const headerTitle = config?.headerTitle ?? 'Territorios que ya deciden con datos.'
  const headerDescription = config?.headerDescription ?? ''
  const autoplay = config?.autoplay ?? true
  const autoplaySpeed = config?.autoplaySpeed ?? 4

  // Obtener las ventanas (dialogs) creadas en Experience Builder
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

  const newsItems: NewsCaseItem[] = useMemo(() => {
    const raw = config?.newsItems
    if (!raw || raw.length === 0) return []
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : [...raw]
  }, [config?.newsItems])

  const themeColors: ThemeColors = useMemo(() => {
    const raw = config?.themeColors
    if (!raw) return DEFAULT_THEME_COLORS
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...DEFAULT_THEME_COLORS, ...raw }
  }, [config?.themeColors])

  const updateConfigProp = (prop: string, value: any) => {
    onSettingChange({
      id,
      config: config.set(prop, value)
    })
  }

  const updateThemeColor = (key: keyof ThemeColors, value: string) => {
    const updated = { ...themeColors, [key]: value }
    updateConfigProp('themeColors', updated)
  }

  const applyThemePreset = (preset: ThemeColors) => {
    updateConfigProp('themeColors', preset)
  }

  const addItem = () => {
    const newItem: NewsCaseItem = {
      ...DEFAULT_NEW_ITEM,
      id: `caso-${Date.now()}`
    }
    const updated = [...newsItems, newItem]
    updateConfigProp('newsItems', updated)
    setExpandedItemId(newItem.id)
  }

  const updateItem = (itemId: string, field: keyof NewsCaseItem, val: any) => {
    const updated = newsItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: val }
      }
      return item
    })
    updateConfigProp('newsItems', updated)
  }

  const removeItem = (itemId: string) => {
    const updated = newsItems.filter((i) => i.id !== itemId)
    updateConfigProp('newsItems', updated)
    if (expandedItemId === itemId) setExpandedItemId(null)
  }

  return (
    <div
      className="widget-setting-galeria-casos-noticias jimu-widget-setting"
      style={{
        padding: '12px',
        color: '#ffffff',
        fontFamily: '"Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#1a1a1a',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: settingStyle }} />

      {/* SECCIÓN 1: CABECERA Y TEXTOS */}
      <SettingSection title="Cabecera Institucional">
        <SettingRow label="Subtítulo superior:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%' }}
            value={headerSubtitle}
            onChange={(e) => updateConfigProp('headerSubtitle', e.target.value)}
            placeholder="OBSERVATORIO · GALERÍA DE CASOS"
          />
        </SettingRow>

        <SettingRow label="Título principal:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%' }}
            value={headerTitle}
            onChange={(e) => updateConfigProp('headerTitle', e.target.value)}
            placeholder="Territorios que ya deciden con datos."
          />
        </SettingRow>

        <SettingRow label="Descripción contextual (opcional):" flow="wrap">
          <TextArea
            style={{ width: '100%', height: '55px' }}
            value={headerDescription}
            onChange={(e) => updateConfigProp('headerDescription', e.target.value)}
            placeholder="Casos de éxito y analítica del Gemelo Digital..."
          />
        </SettingRow>
      </SettingSection>

      {/* SECCIÓN 2: PERSONALIZACIÓN CROMÁTICA */}
      <SettingSection title="Colores y Estilo Visual">
        <SettingRow label="Color de fondo del widget:" flow="wrap">
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
            <input
              type="color"
              value={themeColors.widgetBg || '#070c14'}
              onChange={(e) => updateThemeColor('widgetBg', e.target.value)}
              style={{
                width: '32px',
                height: '28px',
                padding: '0',
                border: '1px solid #475569',
                borderRadius: '3px',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              title="Seleccionar color de fondo del widget"
            />
            <TextInput
              size="sm"
              style={{ flex: 1 }}
              value={themeColors.widgetBg || '#070c14'}
              onChange={(e) => updateThemeColor('widgetBg', e.target.value)}
              placeholder="#070c14"
            />
          </div>
        </SettingRow>

        <SettingRow label="Fondo de tarjetas:" flow="wrap">
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
            <input
              type="color"
              value={themeColors.cardBg || '#0e1622'}
              onChange={(e) => updateThemeColor('cardBg', e.target.value)}
              style={{
                width: '32px',
                height: '28px',
                padding: '0',
                border: '1px solid #475569',
                borderRadius: '3px',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              title="Seleccionar fondo de tarjetas"
            />
            <TextInput
              size="sm"
              style={{ flex: 1 }}
              value={themeColors.cardBg || '#0e1622'}
              onChange={(e) => updateThemeColor('cardBg', e.target.value)}
              placeholder="#0e1622"
            />
          </div>
        </SettingRow>

        <SettingRow label="Color institucional de acento:" flow="wrap">
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
            <input
              type="color"
              value={themeColors.accentColor || '#007ac2'}
              onChange={(e) => updateThemeColor('accentColor', e.target.value)}
              style={{
                width: '32px',
                height: '28px',
                padding: '0',
                border: '1px solid #475569',
                borderRadius: '3px',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              title="Seleccionar color de acento"
            />
            <TextInput
              size="sm"
              style={{ flex: 1 }}
              value={themeColors.accentColor || '#007ac2'}
              onChange={(e) => updateThemeColor('accentColor', e.target.value)}
              placeholder="#007ac2"
            />
          </div>
        </SettingRow>

        <SettingRow label="Borde de tarjetas:" flow="wrap">
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
            <input
              type="color"
              value={themeColors.cardBorder || '#1a2533'}
              onChange={(e) => updateThemeColor('cardBorder', e.target.value)}
              style={{
                width: '32px',
                height: '28px',
                padding: '0',
                border: '1px solid #475569',
                borderRadius: '3px',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              title="Seleccionar color de borde"
            />
            <TextInput
              size="sm"
              style={{ flex: 1 }}
              value={themeColors.cardBorder || '#1a2533'}
              onChange={(e) => updateThemeColor('cardBorder', e.target.value)}
              placeholder="#1a2533"
            />
          </div>
        </SettingRow>

        {/* Paletas preconfiguradas */}
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            Paletas predeterminadas:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => applyThemePreset({
                widgetBg: '#070c14',
                cardBg: '#0e1622',
                accentColor: '#007ac2',
                cardBorder: '#1a2533'
              })}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                background: '#242424',
                color: '#cbd5e1',
                border: '1px solid #3b4252',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Bogotá (Navy)
            </button>
            <button
              type="button"
              onClick={() => applyThemePreset({
                widgetBg: '#151515',
                cardBg: '#202020',
                accentColor: '#007ac2',
                cardBorder: '#323232'
              })}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                background: '#242424',
                color: '#cbd5e1',
                border: '1px solid #3b4252',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Calcite Slate
            </button>
            <button
              type="button"
              onClick={() => applyThemePreset({
                widgetBg: '#050a12',
                cardBg: '#0b1524',
                accentColor: '#009af2',
                cardBorder: '#162842'
              })}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                background: '#242424',
                color: '#cbd5e1',
                border: '1px solid #3b4252',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Metro PLMB (Cian)
            </button>
            <button
              type="button"
              onClick={() => applyThemePreset(DEFAULT_THEME_COLORS)}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px dashed #475569',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Restablecer
            </button>
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 3: CONTROL DE BUCLE */}
      <SettingSection title="Comportamiento del Bucle">
        <SettingRow label="Reproducción automática continua:">
          <Switch
            checked={autoplay}
            onChange={(e) => updateConfigProp('autoplay', e.target.checked)}
          />
        </SettingRow>

        {autoplay && (
          <SettingRow label={`Velocidad de transición: ${autoplaySpeed} segundos`} flow="wrap">
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={autoplaySpeed}
              onChange={(e) => updateConfigProp('autoplaySpeed', parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </SettingRow>
        )}
      </SettingSection>

      {/* SECCIÓN 4: GESTIÓN DE NOTICIAS Y CASOS */}
      <SettingSection title={`Noticias y Casos (${newsItems.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <button
            type="button"
            onClick={addItem}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#007ac2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '11px',
              textAlign: 'center'
            }}
          >
            + Añadir Noticia / Caso
          </button>

          {newsItems.map((item, idx) => {
            const isExpanded = expandedItemId === item.id

            return (
              <div
                key={item.id || idx}
                style={{
                  border: '1px solid #333333',
                  borderRadius: '3px',
                  backgroundColor: '#242424',
                  overflow: 'hidden'
                }}
              >
                {/* Cabecera colapsable */}
                <div
                  style={{
                    padding: '8px 10px',
                    backgroundColor: isExpanded ? '#2c2c2c' : '#242424',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                >
                  <div style={{ fontSize: '11.5px', color: '#ffffff', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {idx + 1}. {item.title || '(Sin título)'}
                  </div>

                  <span style={{ fontSize: '11px', color: '#999999' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {/* Formulario expandido */}
                {isExpanded && (
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #333333' }}>
                    <div>
                      <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                        Título de la noticia:
                      </label>
                      <TextInput
                        size="sm"
                        style={{ width: '100%' }}
                        value={item.title}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        placeholder="Título de la noticia..."
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                        Fuente oficial de información:
                      </label>
                      <TextInput
                        size="sm"
                        style={{ width: '100%' }}
                        value={item.source || ''}
                        onChange={(e) => updateItem(item.id, 'source', e.target.value)}
                        placeholder="Ej: Secretaría Distrital de Planeación"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                        Fecha o período de publicación:
                      </label>
                      <TextInput
                        size="sm"
                        style={{ width: '100%' }}
                        value={item.date || ''}
                        onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                        placeholder="Ej: Octubre 2024"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                        URL de la imagen de portada:
                      </label>
                      <TextInput
                        size="sm"
                        style={{ width: '100%' }}
                        value={item.imageUrl || ''}
                        onChange={(e) => updateItem(item.id, 'imageUrl', e.target.value)}
                        placeholder="https://.../imagen.jpg"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                        Acción al hacer clic:
                      </label>
                      <Select
                        size="sm"
                        style={{ width: '100%' }}
                        value={item.targetType || 'url'}
                        onChange={(e) => updateItem(item.id, 'targetType', e.target.value)}
                      >
                        <Option value="window">Ventana (Dialog de ExB)</Option>
                        <Option value="url">Enlace Web (URL)</Option>
                      </Select>
                    </div>

                    {item.targetType === 'window' ? (
                      <div>
                        <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                          Seleccionar ventana de Experience Builder:
                        </label>
                        <Select
                          size="sm"
                          style={{ width: '100%' }}
                          value={item.dialogId || ''}
                          onChange={(e) => updateItem(item.id, 'dialogId', e.target.value)}
                        >
                          <Option value="">-- Seleccionar ventana --</Option>
                          {availableWindows.map((w) => (
                            <Option key={w.id} value={w.id}>
                              {w.label} ({w.id})
                            </Option>
                          ))}
                        </Select>
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '10.5px', color: '#cccccc', display: 'block', marginBottom: '3px' }}>
                          URL del enlace:
                        </label>
                        <TextInput
                          size="sm"
                          style={{ width: '100%' }}
                          value={item.url || ''}
                          onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'transparent',
                          color: '#f43f5e',
                          border: '1px solid #f43f5e',
                          padding: '3px 8px',
                          borderRadius: '2px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar caso
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SettingSection>
    </div>
  )
}
