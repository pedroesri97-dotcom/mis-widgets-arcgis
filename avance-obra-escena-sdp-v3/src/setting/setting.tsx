/** @jsxRuntime classic */
/** @jsx jsx */
import { React, jsx, css, getAppStore, type UseDataSource } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { TextInput, Select } from 'jimu-ui'
import { MapViewManager } from 'jimu-arcgis'
import type { IMConfig } from '../config'
import { outputDataSourceJson } from '../output-schema'

const style = css`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #d1d1d1;
  font-size: 11px;
  box-sizing: border-box;

  .setting-label {
    font-size: 11px;
    color: #a8a8a8;
    margin-bottom: 3px;
    display: block;
  }

  .status-item-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 6px;
  }

  .status-item-input {
    flex: 1;
    min-width: 0;
  }

  .color-picker-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 3px 0;
  }

  .color-picker-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .color-picker-input {
    width: 28px;
    height: 22px;
    border: 1px solid #383838;
    background: #1c1c1c;
    cursor: pointer;
    padding: 0;
    border-radius: 2px;
  }

  .color-hex-text {
    font-size: 10px;
    color: #a8a8a8;
    font-family: monospace;
    width: 60px;
  }
`

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const { id, config, useMapWidgetIds, onSettingChange } = props

  const [detectedSceneLayers, setDetectedSceneLayers] = React.useState<Array<{ id: string, title: string }>>([])

  React.useEffect(() => {
    try {
      const mvm = MapViewManager.getInstance()
      const allViews = mvm?.getAllJimuMapViews ? mvm.getAllJimuMapViews() : (mvm?.getAllJimuMapView ? mvm.getAllJimuMapView() : {})
      const list = Array.isArray(allViews) ? allViews : Object.values(allViews || {})
      const layersMap = new Map<string, string>()

      list.forEach((jmv: any) => {
        const isScene = jmv?.view?.type === '3d'
        const map = jmv?.view?.map
        if (map && isScene) {
          const allL = map.allLayers ? map.allLayers.toArray() : (map.layers ? map.layers.toArray() : [])
          allL.forEach((l: any) => {
            if (l?.type === 'scene' && l?.title) {
              layersMap.set(l.id || l.title, l.title.trim())
            }
          })
        }
      })

      setDetectedSceneLayers(Array.from(layersMap.entries()).map(([id, title]) => ({ id, title })))
    } catch (e) {}
  }, [useMapWidgetIds])

  const save = React.useCallback((change: { config?: IMConfig, useMapWidgetIds?: string[], useDataSources?: UseDataSource[] }) => {
    const label = getAppStore().getState().appStateInBuilder?.appConfig.widgets[id]?.label ?? 'Avance de obra (escena)'
    onSettingChange({ id, ...change } as any, [outputDataSourceJson(id, `Elementos de avance (${label})`)])
  }, [id, onSettingChange])

  React.useEffect(() => {
    if (!props.outputDataSources?.length) save({ config })
  }, [props.outputDataSources, config, save])

  const updateProp = (key: string, value: any) => {
    save({ config: config.set(key, value) })
  }

  return (
    <div css={style} className="widget-setting-avance-obra-escena">
      {/* SECCIÓN 1: VINCULACIÓN CON ESCENA 3D E INSUMOS */}
      <SettingSection title="Escena 3D e Insumos de Capas">
        <SettingRow>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="setting-label">Widget de mapa o escena:</span>
            <MapWidgetSelector useMapWidgetIds={useMapWidgetIds} onSelect={(ids: string[]) => { save({ useMapWidgetIds: ids }) }} />
          </div>
        </SettingRow>

        <SettingRow flow="wrap">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            <div>
              <span className="setting-label">Capa Estación 15 (E15):</span>
              {detectedSceneLayers.length > 0 ? (
                <Select
                  size="sm"
                  style={{ width: '100%' }}
                  value={config.layerIdE15 ?? ''}
                  onChange={e => updateProp('layerIdE15', e.target.value)}
                >
                  <option value="">(Autodetectar en la escena)</option>
                  {detectedSceneLayers.map(l => (
                    <option key={l.id} value={l.title}>{l.title}</option>
                  ))}
                </Select>
              ) : (
                <TextInput
                  size="sm"
                  style={{ width: '100%' }}
                  placeholder="(Autodetectar en la escena)"
                  value={config.layerIdE15 ?? ''}
                  onAcceptValue={value => updateProp('layerIdE15', value.trim())}
                />
              )}
            </div>

            <div>
              <span className="setting-label">Capa Interestación 16 (I16):</span>
              {detectedSceneLayers.length > 0 ? (
                <Select
                  size="sm"
                  style={{ width: '100%' }}
                  value={config.layerIdI16 ?? ''}
                  onChange={e => updateProp('layerIdI16', e.target.value)}
                >
                  <option value="">(Autodetectar en la escena)</option>
                  {detectedSceneLayers.map(l => (
                    <option key={l.id} value={l.title}>{l.title}</option>
                  ))}
                </Select>
              ) : (
                <TextInput
                  size="sm"
                  style={{ width: '100%' }}
                  placeholder="(Autodetectar en la escena)"
                  value={config.layerIdI16 ?? ''}
                  onAcceptValue={value => updateProp('layerIdI16', value.trim())}
                />
              )}
            </div>

            <div>
              <span className="setting-label">Capa Estación 16 (E16):</span>
              {detectedSceneLayers.length > 0 ? (
                <Select
                  size="sm"
                  style={{ width: '100%' }}
                  value={config.layerIdE16 ?? ''}
                  onChange={e => updateProp('layerIdE16', e.target.value)}
                >
                  <option value="">(Autodetectar en la escena)</option>
                  {detectedSceneLayers.map(l => (
                    <option key={l.id} value={l.title}>{l.title}</option>
                  ))}
                </Select>
              ) : (
                <TextInput
                  size="sm"
                  style={{ width: '100%' }}
                  placeholder="(Autodetectar en la escena)"
                  value={config.layerIdE16 ?? ''}
                  onAcceptValue={value => updateProp('layerIdE16', value.trim())}
                />
              )}
            </div>

            <div>
              <span className="setting-label">Capa Volumetría contextual (opcional):</span>
              {detectedSceneLayers.length > 0 ? (
                <Select
                  size="sm"
                  style={{ width: '100%' }}
                  value={config.layerIdVolumetry ?? ''}
                  onChange={e => updateProp('layerIdVolumetry', e.target.value)}
                >
                  <option value="">(Autodetectar en la escena / Ninguna)</option>
                  {detectedSceneLayers.map(l => (
                    <option key={l.id} value={l.title}>{l.title}</option>
                  ))}
                </Select>
              ) : (
                <TextInput
                  size="sm"
                  style={{ width: '100%' }}
                  placeholder="(Autodetectar en la escena / Ninguna)"
                  value={config.layerIdVolumetry ?? ''}
                  onAcceptValue={value => updateProp('layerIdVolumetry', value.trim())}
                />
              )}
            </div>
          </div>
        </SettingRow>
      </SettingSection>

      {/* SECCIÓN 2: TÍTULOS PRINCIPALES */}
      <SettingSection title="Títulos Principales">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div>
            <span className="setting-label">Título principal:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.headerTitle ?? 'Avance de Obra'}
              onAcceptValue={value => updateProp('headerTitle', value)}
            />
          </div>
          <div>
            <span className="setting-label">Título de secciones:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.sectionsTitle ?? 'Secciones de obra'}
              onAcceptValue={value => updateProp('sectionsTitle', value)}
            />
          </div>
          <div>
            <span className="setting-label">Título de modo de color:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.colorModeTitle ?? 'Modo de color'}
              onAcceptValue={value => updateProp('colorModeTitle', value)}
            />
          </div>
          <div>
            <span className="setting-label">Título de terreno:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.terrainTitle ?? 'Transparencia del terreno'}
              onAcceptValue={value => updateProp('terrainTitle', value)}
            />
          </div>
          <div>
            <span className="setting-label">Título de elemento seleccionado:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.selectedTitle ?? 'Elemento seleccionado'}
              onAcceptValue={value => updateProp('selectedTitle', value)}
            />
          </div>
          <div>
            <span className="setting-label">Título de herramientas 3D:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.toolsTitle ?? 'Herramientas 3D'}
              onAcceptValue={value => updateProp('toolsTitle', value)}
            />
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 3: NOMBRES EN SECCIONES DE OBRA */}
      <SettingSection title="Nombres en Secciones de Obra">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div>
            <span className="setting-label">Estación 15 (E15):</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.sectionLabelE15 ?? 'Estación 15 · Calle 63'}
              onAcceptValue={value => updateProp('sectionLabelE15', value)}
            />
          </div>
          <div>
            <span className="setting-label">Interestación 16 (I16):</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.sectionLabelI16 ?? 'Interestación 16 · viaducto'}
              onAcceptValue={value => updateProp('sectionLabelI16', value)}
            />
          </div>
          <div>
            <span className="setting-label">Estación 16 (E16):</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.sectionLabelE16 ?? 'Estación 16 · Calle 72'}
              onAcceptValue={value => updateProp('sectionLabelE16', value)}
            />
          </div>
          <div>
            <span className="setting-label">Capa de volumetría urbana:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.volumetryLabel ?? 'Volumetría (sin estaciones)'}
              onAcceptValue={value => updateProp('volumetryLabel', value)}
            />
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 4: NOMBRES EN MODO DE COLOR */}
      <SettingSection title="Nombres en Modo de Color">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div>
            <span className="setting-label">Opción Estado de avance:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.modeStatusLabel ?? 'Estado de avance'}
              onAcceptValue={value => updateProp('modeStatusLabel', value)}
            />
          </div>
          <div>
            <span className="setting-label">Opción Cronograma (4D):</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.modeScheduleLabel ?? 'Cronograma (4D)'}
              onAcceptValue={value => updateProp('modeScheduleLabel', value)}
            />
          </div>
          <div>
            <span className="setting-label">Opción Colores del modelo:</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              value={config.modeSourceLabel ?? 'Colores del modelo'}
              onAcceptValue={value => updateProp('modeSourceLabel', value)}
            />
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 5: ESTADOS DE AVANCE (NOMBRES Y COLORES) */}
      <SettingSection title="Estados de Avance (Nombres y Colores)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div>
            <span className="setting-label">Estado 1:</span>
            <div className="status-item-row">
              <TextInput
                size="sm"
                className="status-item-input"
                value={config.statusTerminadoLabel ?? 'Terminado'}
                onAcceptValue={value => updateProp('statusTerminadoLabel', value)}
              />
              <div className="color-picker-input-group">
                <input
                  type="color"
                  className="color-picker-input"
                  value={config.colorTerminado || '#44c58a'}
                  onChange={e => updateProp('colorTerminado', e.target.value)}
                />
                <span className="color-hex-text">{config.colorTerminado || '#44c58a'}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="setting-label">Estado 2:</span>
            <div className="status-item-row">
              <TextInput
                size="sm"
                className="status-item-input"
                value={config.statusEnCursoLabel ?? 'En curso'}
                onAcceptValue={value => updateProp('statusEnCursoLabel', value)}
              />
              <div className="color-picker-input-group">
                <input
                  type="color"
                  className="color-picker-input"
                  value={config.colorEnCurso || '#f2c94c'}
                  onChange={e => updateProp('colorEnCurso', e.target.value)}
                />
                <span className="color-hex-text">{config.colorEnCurso || '#f2c94c'}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="setting-label">Estado 3:</span>
            <div className="status-item-row">
              <TextInput
                size="sm"
                className="status-item-input"
                value={config.statusNoIniciadoLabel ?? 'No iniciado'}
                onAcceptValue={value => updateProp('statusNoIniciadoLabel', value)}
              />
              <div className="color-picker-input-group">
                <input
                  type="color"
                  className="color-picker-input"
                  value={config.colorNoIniciado || '#ef6464'}
                  onChange={e => updateProp('colorNoIniciado', e.target.value)}
                />
                <span className="color-hex-text">{config.colorNoIniciado || '#ef6464'}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="setting-label">Estado 4:</span>
            <div className="status-item-row">
              <TextInput
                size="sm"
                className="status-item-input"
                value={config.statusSinDatoLabel ?? 'Sin dato'}
                onAcceptValue={value => updateProp('statusSinDatoLabel', value)}
              />
              <div className="color-picker-input-group">
                <input
                  type="color"
                  className="color-picker-input"
                  value={config.colorSinDato || '#9aa5b1'}
                  onChange={e => updateProp('colorSinDato', e.target.value)}
                />
                <span className="color-hex-text">{config.colorSinDato || '#9aa5b1'}</span>
              </div>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 6: COLORES DE CRONOGRAMA 4D */}
      <SettingSection title="Colores de Cronograma 4D">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <div className="color-picker-row">
            <span>Curva programada:</span>
            <div className="color-picker-input-group">
              <input
                type="color"
                className="color-picker-input"
                value={config.colorCurvaProgramada || '#00b4d8'}
                onChange={e => updateProp('colorCurvaProgramada', e.target.value)}
              />
              <span className="color-hex-text">{config.colorCurvaProgramada || '#00b4d8'}</span>
            </div>
          </div>

          <div className="color-picker-row">
            <span>Línea de fecha de corte:</span>
            <div className="color-picker-input-group">
              <input
                type="color"
                className="color-picker-input"
                value={config.colorFechaCorte || '#fbbf24'}
                onChange={e => updateProp('colorFechaCorte', e.target.value)}
              />
              <span className="color-hex-text">{config.colorFechaCorte || '#fbbf24'}</span>
            </div>
          </div>

          <div className="color-picker-row">
            <span>Avance real consolidado:</span>
            <div className="color-picker-input-group">
              <input
                type="color"
                className="color-picker-input"
                value={config.colorRealHoy || '#34d399'}
                onChange={e => updateProp('colorRealHoy', e.target.value)}
              />
              <span className="color-hex-text">{config.colorRealHoy || '#34d399'}</span>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 7: COLORES DE INTERFAZ */}
      <SettingSection title="Colores de Interfaz">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <div className="color-picker-row">
            <span>Color de acento / títulos:</span>
            <div className="color-picker-input-group">
              <input
                type="color"
                className="color-picker-input"
                value={config.accentColor || '#00b4d8'}
                onChange={e => updateProp('accentColor', e.target.value)}
              />
              <span className="color-hex-text">{config.accentColor || '#00b4d8'}</span>
            </div>
          </div>

          <div className="color-picker-row">
            <span>Color de botones principales:</span>
            <div className="color-picker-input-group">
              <input
                type="color"
                className="color-picker-input"
                value={config.primaryColor || '#0284c7'}
                onChange={e => updateProp('primaryColor', e.target.value)}
              />
              <span className="color-hex-text">{config.primaryColor || '#0284c7'}</span>
            </div>
          </div>

          <div className="color-picker-row">
            <span>Fondo de tarjetas:</span>
            <div className="color-picker-input-group">
              <input
                type="color"
                className="color-picker-input"
                value={config.cardBackground || '#151f2b'}
                onChange={e => updateProp('cardBackground', e.target.value)}
              />
              <span className="color-hex-text">{config.cardBackground || '#151f2b'}</span>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* SECCIÓN 8: ORIGEN DE DATOS */}
      <SettingSection title="Origen de Datos (Opcional)">
        <SettingRow flow="wrap">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="setting-label">URL del servidor de avance (JSON):</span>
            <TextInput
              size="sm"
              style={{ width: '100%' }}
              placeholder="https://servidor-entidad/datos-avance"
              value={config.serverUrl ?? ''}
              onAcceptValue={value => updateProp('serverUrl', value.trim().replace(/\/$/, ''))}
            />
          </div>
        </SettingRow>
      </SettingSection>
    </div>
  )
}

export default Setting
