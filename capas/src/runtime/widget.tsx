/** @jsx jsx */
import { React, AllWidgetProps, css, jsx } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import { Switch } from 'jimu-ui';
import { IMConfig } from '../config';
import defaultMessages from './translations/default';

interface LayerItem {
  id: string;
  title: string;
  visible: boolean;
  type: string;
  layer: __esri.Layer;
}

interface State {
  jmv: JimuMapView;
  layers: LayerItem[];
  mapViewReady: boolean;
  currentTime: string;
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  timer: any = null;
  handles: Array<{ remove: () => void }> = [];

  state: State = {
    jmv: null,
    layers: [],
    mapViewReady: false,
    currentTime: new Date().toLocaleTimeString()
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ currentTime: new Date().toLocaleTimeString() });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
    this.clearWatchers();
  }

  clearWatchers = () => {
    this.handles.forEach(h => {
      if (h && typeof h.remove === 'function') {
        h.remove();
      }
    });
    this.handles = [];
  };

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({ jmv, mapViewReady: true });
      this.loadLayers(jmv);

      if (jmv.view && jmv.view.map && jmv.view.map.layers) {
        jmv.view.map.layers.on('change', () => {
          this.loadLayers(jmv);
        });
      }
    }
  };

  loadLayers = (jmv: JimuMapView) => {
    if (!jmv || !jmv.view || !jmv.view.map) return;

    this.clearWatchers();

    const mapLayers = jmv.view.map.layers;
    const layerItems: LayerItem[] = [];

    mapLayers.forEach((layer: __esri.Layer) => {
      const item: LayerItem = {
        id: layer.id,
        title: layer.title || layer.id,
        visible: layer.visible,
        type: layer.type,
        layer: layer
      };
      layerItems.push(item);

      if (typeof layer.watch === 'function') {
        const handle = layer.watch('visible', (newVal: boolean) => {
          this.setState(prevState => ({
            layers: prevState.layers.map(l =>
              l.id === layer.id ? { ...l, visible: newVal } : l
            )
          }));
        });
        this.handles.push(handle);
      }
    });

    // Reverse so top-most layer in map is at the top of the UI list
    this.setState({ layers: layerItems.reverse() });
  };

  toggleLayerVisibility = (layerId: string) => {
    const target = this.state.layers.find(l => l.id === layerId);
    if (target && target.layer) {
      const newVis = !target.layer.visible;
      target.layer.visible = newVis;
      this.setState(prevState => ({
        layers: prevState.layers.map(item =>
          item.id === layerId ? { ...item, visible: newVis } : item
        )
      }));
    }
  };

  getIndicatorColor = (index: number, visible: boolean) => {
    if (!visible) return '#475569';
    const palette = ['#10b981', '#3b82f6', '#3b82f6', '#f59e0b', '#475569', '#475569', '#475569', '#475569', '#3b82f6', '#06b6d4'];
    return palette[index % palette.length];
  };

  render() {
    const { layers, mapViewReady, currentTime } = this.state;
    const activeLayersCount = layers.filter(l => l.visible).length;
    const totalLayersCount = layers.length;
    const title = this.props.config?.title || defaultMessages.panelTitle;
    const subtitle = this.props.config?.subtitle || defaultMessages.panelSubtitle;

    const style = css`
      background-color: #0d1424;
      color: #f8fafc;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .header-panel {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 12px;

        .title-group {
          .main-title {
            font-size: 1.05rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
          }
          .sub-title {
            font-size: 0.72rem;
            color: #94a3b8;
            margin: 2px 0 0 0;
          }
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.3);
          text-transform: uppercase;

          .pulse-dot {
            width: 6px;
            height: 6px;
            background-color: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 8px #10b981;
          }
        }
      }

      .info-box {
        background-color: #162032;
        border-radius: 8px;
        padding: 10px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .time-info {
          display: flex;
          flex-direction: column;
          .date-str {
            font-size: 0.68rem;
            color: #94a3b8;
          }
          .time-str {
            font-size: 1.15rem;
            font-weight: 700;
            color: #f1f5f9;
          }
        }

        .status-str {
          font-size: 0.68rem;
          color: #10b981;
          font-weight: 600;
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;

        .stat-card {
          background-color: #162032;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;

          .stat-value {
            font-size: 1.25rem;
            font-weight: 800;
            color: #ffffff;
          }

          .stat-label {
            font-size: 0.62rem;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
          }
        }
      }

      .section-header {
        font-size: 0.72rem;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-top: 4px;
      }

      .layer-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .layer-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #162032;
          border-radius: 8px;
          padding: 10px 12px;
          transition: background-color 0.2s;

          &:hover {
            background: #1e2d47;
          }

          .layer-info {
            display: flex;
            align-items: center;
            gap: 10px;
            overflow: hidden;

            .color-dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              flex-shrink: 0;
            }

            .layer-title {
              font-size: 0.82rem;
              font-weight: 500;
              color: #f1f5f9;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .msg-container {
        padding: 20px;
        text-align: center;
        color: #94a3b8;
        font-size: 0.82rem;
        background: #162032;
        border-radius: 8px;
      }
    `;

    const hasMap = this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0;
    const dateFormatted = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <div css={style} className="widget-capas jimu-widget">
        {hasMap && (
          <JimuMapViewComponent
            useMapWidgetId={this.props.useMapWidgetIds?.[0]}
            onActiveViewChange={this.activeViewChangeHandler}
          />
        )}

        {/* Panel Header */}
        <div className="header-panel">
          <div className="title-group">
            <h3 className="main-title">{title}</h3>
            <p className="sub-title">{subtitle}</p>
          </div>
          <div className="live-badge">
            <span className="pulse-dot" /> {defaultMessages.liveBadge}
          </div>
        </div>

        {/* Time / GPS status */}
        <div className="info-box">
          <div className="time-info">
            <span className="date-str">{dateFormatted}</span>
            <span className="time-str">{currentTime}</span>
          </div>
          <div className="status-str">{defaultMessages.gpsActive}</div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{activeLayersCount}</div>
            <div className="stat-label">{defaultMessages.activeLayers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalLayersCount}</div>
            <div className="stat-label">{defaultMessages.totalLayers}</div>
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header">{defaultMessages.visibilityHeader}</div>

        {/* Layers List */}
        {!hasMap ? (
          <div className="msg-container">
            {defaultMessages.selectMapWarning}
          </div>
        ) : layers.length === 0 ? (
          <div className="msg-container">
            {mapViewReady ? defaultMessages.noLayersFound : defaultMessages.loadingLayers}
          </div>
        ) : (
          <div className="layer-list">
            {layers.map((layerItem, idx) => (
              <div key={layerItem.id} className="layer-item">
                <div className="layer-info">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: this.getIndicatorColor(idx, layerItem.visible) }}
                  />
                  <span className="layer-title" title={layerItem.title}>
                    {layerItem.title}
                  </span>
                </div>
                <Switch
                  checked={layerItem.visible}
                  onChange={() => this.toggleLayerVisibility(layerItem.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
