/**
 * ============================================================================
 * PANEL DE CONFIGURACIÓN: ECOSISTEMA Y COLABORACIÓN
 * ============================================================================
 * 
 * Interfaz en escala de grises con diseño vertical responsivo.
 * Permite gestionar la cabecera única, las dos tarjetas contiguas,
 * la lista de puntos con guiones, selección de ventanas y personalización cromática.
 */

import { React, Immutable, getAppStore } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, TextArea, Select, Option, Switch } from 'jimu-ui'
import type { IMConfig, ChannelItem, ThemeColors } from '../config'

const { useMemo } = React

const DEFAULT_THEME_COLORS: ThemeColors = {
  widgetBg: '#070c14',
  cardBg: '#0e1622',
  accentColor: '#007ac2',
  cardBorder: '#1a2533'
}

const settingStyle = `
  .widget-setting-ecosistema-colaboracion .jimu-widget-setting--row-label,
  .widget-setting-ecosistema-colaboracion label {
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
  .widget-setting-ecosistema-colaboracion * {
    font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif !important;
    font-style: normal !important;
  }
  .widget-setting-ecosistema-colaboracion .jimu-widget-setting--row {
    margin-bottom: 12px !important;
  }
`

export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const { config, id, onSettingChange } = props

  const showDividerBar = config?.showDividerBar ?? true
  const headerTitle = config?.headerTitle ?? 'Colabora con el Gemelo Digital'
  const headerDescription = config?.headerDescription ?? 'Espacio de articulación interinstitucional y participación técnica para fortalecer el modelo territorial de Bogotá.'
  const feedbackEnabled = config?.feedbackEnabled ?? true

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

  const themeColors: ThemeColors = useMemo(() => {
    const raw = config?.themeColors
    if (!raw) return DEFAULT_THEME_COLORS
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...DEFAULT_THEME_COLORS, ...raw }
  }, [config?.themeColors])

  const entityChannel: ChannelItem = useMemo(() => {
    const raw = config?.entityChannel
    if (!raw) {
      return {
        id: 'entity',
        title: '¿Tu entidad quiere sumarse al ecosistema?',
        subtitle: 'Conoce los acuerdos de intercambio de datos espaciales y los niveles de servicio disponibles.',
        buttonText: 'Solicitar acceso',
        buttonType: 'primary',
        targetType: 'window',
        features: []
      }
    }
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...raw }
  }, [config?.entityChannel])

  const feedbackChannel: ChannelItem = useMemo(() => {
    const raw = config?.feedbackChannel
    if (!raw) {
      return {
        id: 'feedback',
        title: 'Aportar datos o dejar una sugerencia',
        subtitle: 'Contribuye con observaciones técnicas, capas territoriales o sugerencias.',
        buttonText: 'Dejar opinión',
        buttonType: 'secondary',
        targetType: 'window',
        features: []
      }
    }
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...raw }
  }, [config?.feedbackChannel])

  const updateConfigProp = (prop: string, value: any) => {
    onSettingChange({
      id,
      config: config.set(prop, value)
    })
  }

  const updateEntityProp = (field: keyof ChannelItem, value: any) => {
    const updated = { ...entityChannel, [field]: value }
    updateConfigProp('entityChannel', updated)
  }

  const updateFeedbackProp = (field: keyof ChannelItem, value: any) => {
    const updated = { ...feedbackChannel, [field]: value }
    updateConfigProp('feedbackChannel', updated)
  }

  const updateThemeColor = (key: keyof ThemeColors, value: string) => {
    const updated = { ...themeColors, [key]: value }
    updateConfigProp('themeColors', updated)
  }

  const applyThemePreset = (preset: ThemeColors) => {
    updateConfigProp('themeColors', preset)
  }

  return (
    <div
      className="widget-setting-ecosistema-colaboracion jimu-widget-setting"
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

      {/* SECCIÓN 1: CABECERA INSTITUCIONAL */}
      <SettingSection title="Cabecera del Widget">
        <SettingRow label="Mostrar barra separadora azul:">
          <Switch
            checked={showDividerBar}
            onChange={(e) => updateConfigProp('showDividerBar', e.target.checked)}
          />
        </SettingRow>

        <SettingRow label="Título único principal:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%' }}
            value={headerTitle}
            onChange={(e) => updateConfigProp('headerTitle', e.target.value)}
            placeholder="Colabora con el Gemelo Digital"
          />
        </SettingRow>

        <SettingRow label="Descripción principal:" flow="wrap">
          <TextArea
            style={{ width: '100%', height: '55px' }}
            value={headerDescription}
            onChange={(e) => updateConfigProp('headerDescription', e.target.value)}
            placeholder="Espacio de articulación interinstitucional..."
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
              title="Seleccionar color de fondo"
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

        <SettingRow label="Color institucional de acento / botones:" flow="wrap">
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
              title="Seleccionar borde"
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

        {/* Paletas predeterminadas */}
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

      {/* SECCIÓN 3: TARJETA 1 (VINCULACIÓN INSTITUCIONAL) */}
      <SettingSection title="Tarjeta 1: Vinculación Institucional">
        <SettingRow label="Título de la tarjeta:" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%' }}
            value={entityChannel.title}
            onChange={(e) => updateEntityProp('title', e.target.value)}
            placeholder="¿Tu entidad quiere sumarse al ecosistema?"
          />
        </SettingRow>

        <SettingRow label="Descripción:" flow="wrap">
          <TextArea
            style={{ width: '100%', height: '55px' }}
            value={entityChannel.subtitle}
            onChange={(e) => updateEntityProp('subtitle', e.target.value)}
            placeholder="Conoce los acuerdos de intercambio de datos..."
          />
        </SettingRow>

        <SettingRow label="Texto del botón (al pie):" flow="wrap">
          <TextInput
            size="sm"
            style={{ width: '100%' }}
            value={entityChannel.buttonText}
            onChange={(e) => updateEntityProp('buttonText', e.target.value)}
            placeholder="Solicitar acceso"
          />
        </SettingRow>

        <SettingRow label="Tipo de acción:" flow="wrap">
          <Select
            size="sm"
            style={{ width: '100%' }}
            value={entityChannel.targetType || 'window'}
            onChange={(e) => updateEntityProp('targetType', e.target.value)}
          >
            <Option value="window">Ventana Emergente (Dialog de ExB)</Option>
            <Option value="url">Enlace Web (URL externa)</Option>
          </Select>
        </SettingRow>

        {entityChannel.targetType === 'window' ? (
          <SettingRow label="Ventana de Experience Builder:" flow="wrap">
            <Select
              size="sm"
              style={{ width: '100%' }}
              value={entityChannel.dialogId || ''}
              onChange={(e) => updateEntityProp('dialogId', e.target.value)}
            >
              <Option value="">-- Seleccionar ventana --</Option>
              {availableWindows.map((w) => (
                <Option key={w.id} value={w.id}>
                  {w.label} ({w.id})
                </Option>
              ))}
            </Select>
          </SettingRow>
        ) : (
          <SettingRow label="URL del enlace:" flow="wrap">
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={entityChannel.url || ''}
              onChange={(e) => updateEntityProp('url', e.target.value)}
              placeholder="https://..."
            />
          </SettingRow>
        )}
      </SettingSection>

      {/* SECCIÓN 4: TARJETA 2 (PARTICIPACIÓN Y OPINIÓN) */}
      <SettingSection title="Tarjeta 2: Participación y Aportes">
        <SettingRow label="Mostrar segunda tarjeta:">
          <Switch
            checked={feedbackEnabled}
            onChange={(e) => updateConfigProp('feedbackEnabled', e.target.checked)}
          />
        </SettingRow>

        {feedbackEnabled && (
          <>
            <SettingRow label="Título de la tarjeta:" flow="wrap">
              <TextInput
                size="sm"
                style={{ width: '100%' }}
                value={feedbackChannel.title}
                onChange={(e) => updateFeedbackProp('title', e.target.value)}
                placeholder="Aportar datos o dejar una sugerencia"
              />
            </SettingRow>

            <SettingRow label="Descripción:" flow="wrap">
              <TextArea
                style={{ width: '100%', height: '55px' }}
                value={feedbackChannel.subtitle}
                onChange={(e) => updateFeedbackProp('subtitle', e.target.value)}
                placeholder="Contribuye con observaciones técnicas..."
              />
            </SettingRow>

            <SettingRow label="Texto del botón (al pie):" flow="wrap">
              <TextInput
                size="sm"
                style={{ width: '100%' }}
                value={feedbackChannel.buttonText}
                onChange={(e) => updateFeedbackProp('buttonText', e.target.value)}
                placeholder="Dejar opinión"
              />
            </SettingRow>

            <SettingRow label="Tipo de acción:" flow="wrap">
              <Select
                size="sm"
                style={{ width: '100%' }}
                value={feedbackChannel.targetType || 'window'}
                onChange={(e) => updateFeedbackProp('targetType', e.target.value)}
              >
                <Option value="window">Ventana Emergente (Dialog de ExB)</Option>
                <Option value="url">Enlace Web (URL externa)</Option>
              </Select>
            </SettingRow>

            {feedbackChannel.targetType === 'window' ? (
              <SettingRow label="Ventana de Experience Builder:" flow="wrap">
                <Select
                  size="sm"
                  style={{ width: '100%' }}
                  value={feedbackChannel.dialogId || ''}
                  onChange={(e) => updateFeedbackProp('dialogId', e.target.value)}
                >
                  <Option value="">-- Seleccionar ventana --</Option>
                  {availableWindows.map((w) => (
                    <Option key={w.id} value={w.id}>
                      {w.label} ({w.id})
                    </Option>
                  ))}
                </Select>
              </SettingRow>
            ) : (
              <SettingRow label="URL del enlace:" flow="wrap">
                <TextInput
                  size="sm"
                  style={{ width: '100%' }}
                  value={feedbackChannel.url || ''}
                  onChange={(e) => updateFeedbackProp('url', e.target.value)}
                  placeholder="https://..."
                />
              </SettingRow>
            )}
          </>
        )}
      </SettingSection>
    </div>
  )
}
