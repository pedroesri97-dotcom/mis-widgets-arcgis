/** @jsx jsx */
import { React, css, jsx } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { TextInput } from 'jimu-ui';
import { IMConfig } from '../config';
import defaultI18nMessages from './translations/default';

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, any> {
  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  };

  onTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('title', evt.target.value)
    });
  };

  onTitleHighlightChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('titleHighlight', evt.target.value)
    });
  };

  render() {
    const style = css`
      .widget-setting-plantilla-capas {
        padding: 12px;

        .setting-row-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          margin-top: 6px;

          label {
            font-size: 0.8rem;
            color: #555;
            font-weight: 500;
          }
        }
      }
    `;

    return (
      <div css={style} className="widget-setting-plantilla-capas">
        <SettingSection
          title={this.props.intl.formatMessage({
            id: 'selectMapWidget',
            defaultMessage: defaultI18nMessages.selectMapWidget
          })}
        >
          <SettingRow>
            <MapWidgetSelector
              onSelect={this.onMapWidgetSelected}
              useMapWidgetIds={this.props.useMapWidgetIds}
            />
          </SettingRow>
        </SettingSection>

        <SettingSection
          title={this.props.intl.formatMessage({
            id: 'settings',
            defaultMessage: defaultI18nMessages.settings
          })}
        >
          <SettingRow>
            <div className="setting-row-item">
              <label>{defaultI18nMessages.titleLabel}</label>
              <TextInput
                value={this.props.config?.title || 'Capas por'}
                onChange={this.onTitleChange}
                size="sm"
              />
            </div>
          </SettingRow>

          <SettingRow>
            <div className="setting-row-item">
              <label>{defaultI18nMessages.titleHighlightLabel}</label>
              <TextInput
                value={this.props.config?.titleHighlight || 'componente'}
                onChange={this.onTitleHighlightChange}
                size="sm"
              />
            </div>
          </SettingRow>
        </SettingSection>
      </div>
    );
  }
}
