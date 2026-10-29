/** @jsxRuntime classic */
/** @jsx jsx */
import { React, jsx, css, getAppStore, type UseDataSource } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { TextInput } from 'jimu-ui'
import type { IMConfig } from '../config'
import { outputDataSourceJson } from '../output-schema'

const style = css`
  .note { font-size: 12px; color: var(--ref-palette-neutral-1000); margin: 8px 0 0; line-height: 1.4; }
`

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const { id, config, useMapWidgetIds, onSettingChange } = props

  // Every change re-registers the output data source, so Chart, Table, Filter and List can always pick it.
  const save = React.useCallback((change: { config?: IMConfig, useMapWidgetIds?: string[], useDataSources?: UseDataSource[] }) => {
    const label = getAppStore().getState().appStateInBuilder?.appConfig.widgets[id]?.label ?? 'Avance de obra (escena)'
    onSettingChange({ id, ...change } as any, [outputDataSourceJson(id, `Elementos de avance (${label})`)])
  }, [id, onSettingChange])

  React.useEffect(() => {
    if (!props.outputDataSources?.length) save({ config })
  }, [props.outputDataSources, config, save])

  return (
    <div css={style} className="widget-setting-avance-obra-escena">
      <SettingSection title="Mapa (opcional)">
        <SettingRow>
          <MapWidgetSelector useMapWidgetIds={useMapWidgetIds} onSelect={(ids: string[]) => { save({ useMapWidgetIds: ids }) }} />
        </SettingRow>
        <p className="note">
          Opcional. Sin Mapa, el widget abre en su propio recuadro el web scene «Avance de obra - PLMB» del portal de la SDP.
          Con un widget Mapa (con esa u otra escena con las capas E15, I16 y E16), colorea y filtra las capas de ese Mapa.
        </p>
      </SettingSection>
      <SettingSection title="Datos">
        <SettingRow flow="wrap" label="URL de los datos (sitio publicado o serve.mjs local)">
          <TextInput size="sm" value={config.serverUrl} onAcceptValue={value => { save({ config: config.set('serverUrl', value.trim().replace(/\/$/, '')) }) }} />
        </SettingRow>
        <p className="note">
          La tabla de elementos (avance y fechas) y las huellas prediales se leen de esta URL. El widget crea la fuente de
          datos «Elementos de avance»: elígela en los widgets de Gráfico, Tabla, Filtro o Lista.
        </p>
      </SettingSection>
    </div>
  )
}

export default Setting
