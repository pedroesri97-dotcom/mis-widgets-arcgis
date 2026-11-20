import { React } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { TextInput } from 'jimu-ui'
import type { IMConfig } from '../config'

export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const { config, id, onSettingChange } = props

  const onMapSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id,
      useMapWidgetIds
    })
  }

  const updateConfig = (key: string, value: any) => {
    onSettingChange({
      id,
      config: config.set(key, value)
    })
  }

  const defaultHour = config?.defaultHour ?? 13.0
  const animationSpeed = config?.animationSpeed ?? 1.0
  const defaultShadows = config?.defaultShadows ?? true

  const settingStyle = `
    .widget-setting-control-tiempo-3d .jimu-widget-setting--row-label,
    .widget-setting-control-tiempo-3d label {
      width: 100% !important;
      white-space: normal !important;
      word-break: normal !important;
      color: #cccccc !important;
      font-size: 11.5px !important;
      font-weight: 500 !important;
      font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif !important;
      font-style: normal !important;
    }
    .widget-setting-control-tiempo-3d * {
      font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif !important;
      font-style: normal !important;
    }
  `

  return (
    <div
      className="widget-setting-control-tiempo-3d"
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#d1d1d1',
        fontSize: '11px',
        fontFamily: '"Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: '#1a1a1a'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: settingStyle }} />
      {/* SECCIÓN 1: VINCULACIÓN CON ESCENA 3D */}
      <SettingSection title="Escena 3D">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <label style={{ fontSize: '11px', color: '#a8a8a8', display: 'block' }}>
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

      {/* SECCIÓN 2: TÍTULO Y GENERAL */}
      <SettingSection title="General">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '11px', color: '#a8a8a8', marginBottom: '3px' }}>
              Título del widget:
            </label>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config?.headerTitle ?? 'Tiempo y Sombras 3D'}
              onChange={(e) => updateConfig('headerTitle', e.target.value)}
              placeholder="Tiempo y Sombras 3D"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '11px', color: '#a8a8a8', marginBottom: '3px' }}>
              Hora inicial: {Math.floor(defaultHour)}:{Math.floor((defaultHour % 1) * 60) < 10 ? '0' : ''}{Math.floor((defaultHour % 1) * 60)}
            </label>
            <input
              type="range"
              min="0"
              max="24"
              step="0.25"
              value={defaultHour}
              onChange={(e) => updateConfig('defaultHour', parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '11px', color: '#a8a8a8', marginBottom: '3px' }}>
              Velocidad de ciclo:
            </label>
            <select
              value={animationSpeed}
              onChange={(e) => updateConfig('animationSpeed', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '5px 8px',
                background: '#262626',
                color: '#ffffff',
                border: '1px solid #3d3d3d',
                borderRadius: '2px',
                fontSize: '11px'
              }}
            >
              <option value={0.5}>0.5x (Lento)</option>
              <option value={1.0}>1.0x (Normal)</option>
              <option value={2.0}>2.0x (Rápido)</option>
            </select>
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 3: ILUMINACIÓN Y SOMBRAS */}
      <SettingSection title="Iluminación y Sombras">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <label style={{ fontSize: '11px', color: '#ffffff', cursor: 'pointer' }}>
            Sombras directas por defecto:
          </label>
          <input
            type="checkbox"
            checked={defaultShadows}
            onChange={(e) => updateConfig('defaultShadows', e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </SettingSection>
    </div>
  )
}
