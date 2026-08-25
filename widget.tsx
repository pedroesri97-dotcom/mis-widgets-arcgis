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
  componentKey: 'AMBIENTAL' | 'URBANÍSTICA' | 'SOCIAL' | 'ECONÓMICA';
  iconType?: string;
  layer?: __esri.Layer;
}

interface ComponentCategory {
  key: 'AMBIENTAL' | 'URBANÍSTICA' | 'SOCIAL' | 'ECONÓMICA';
  title: string;
  color: string;
  icon: string;
}

const CATEGORIES: ComponentCategory[] = [
  { key: 'AMBIENTAL', title: 'AMBIENTAL', color: '#10b981', icon: 'plant' },
  { key: 'URBANÍSTICA', title: 'URBANÍSTICA', color: '#06b6d4', icon: 'building' },
  { key: 'SOCIAL', title: 'SOCIAL', color: '#a855f7', icon: 'users' },
  { key: 'ECONÓMICA', title: 'ECONÓMICA', color: '#0ea5e9', icon: 'coins' }
];

const DEFAULT_LAYERS: LayerItem[] = [
  // AMBIENTAL
  { id: 'env_air', title: 'Calidad del aire', visible: true, componentKey: 'AMBIENTAL', iconType: 'wind' },
  { id: 'env_noise', title: 'Índices de ruido', visible: true, componentKey: 'AMBIENTAL', iconType: 'sound' },
  { id: 'env_veg', title: 'Cobertura vegetal', visible: true, componentKey: 'AMBIENTAL', iconType: 'leaf' },
  { id: 'env_water', title: 'Cuerpos de agua', visible: true, componentKey: 'AMBIENTAL', iconType: 'water' },
  { id: 'env_risk', title: 'Zonas de riesgo', visible: true, componentKey: 'AMBIENTAL', iconType: 'warning' },

  // URBANÍSTICA
  { id: 'urb_land', title: 'Uso del suelo', visible: false, componentKey: 'URBANÍSTICA', iconType: 'layers' },
  { id: 'urb_equip', title: 'Equipamientos', visible: false, componentKey: 'URBANÍSTICA', iconType: 'building' },
  { id: 'urb_mob', title: 'Movilidad vial', visible: false, componentKey: 'URBANÍSTICA', iconType: 'car' },
  { id: 'urb_space', title: 'Espacio público', visible: false, componentKey: 'URBANÍSTICA', iconType: 'bench' },
  { id: 'urb_lic', title: 'Licencias urbanas', visible: false, componentKey: 'URBANÍSTICA', iconType: 'doc' },

  // SOCIAL
  { id: 'soc_pop', title: 'Población', visible: false, componentKey: 'SOCIAL', iconType: 'user' },
  { id: 'soc_health', title: 'Salud', visible: false, componentKey: 'SOCIAL', iconType: 'heart' },
  { id: 'soc_edu', title: 'Educación', visible: false, componentKey: 'SOCIAL', iconType: 'cap' },
  { id: 'soc_sec', title: 'Seguridad', visible: false, componentKey: 'SOCIAL', iconType: 'shield' },
  { id: 'soc_part', title: 'Participación ciudadana', visible: false, componentKey: 'SOCIAL', iconType: 'users' },

  // ECONÓMICA
  { id: 'eco_com', title: 'Actividad comercial', visible: false, componentKey: 'ECONÓMICA', iconType: 'bag' },
  { id: 'eco_emp', title: 'Empleo', visible: false, componentKey: 'ECONÓMICA', iconType: 'case' },
  { id: 'eco_tour', title: 'Turismo', visible: false, componentKey: 'ECONÓMICA', iconType: 'camera' },
  { id: 'eco_inv', title: 'Inversión', visible: false, componentKey: 'ECONÓMICA', iconType: 'chart' },
  { id: 'eco_cad', title: 'Catastro económico', visible: false, componentKey: 'ECONÓMICA', iconType: 'filechart' }
];

interface State {
  jmv: JimuMapView;
  expandedGroups: { [key: string]: boolean };
  layers: LayerItem[];
  mapConnected: boolean;
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  handles: Array<{ remove: () => void }> = [];

  state: State = {
    jmv: null,
    expandedGroups: { AMBIENTAL: true, URBANÍSTICA: false, SOCIAL: false, ECONÓMICA: false },
    layers: DEFAULT_LAYERS,
    mapConnected: false
  };

  componentWillUnmount() {
    this.clearWatchers();
  }

  clearWatchers = () => {
    this.handles.forEach(h => {
      if (h && typeof h.remove === 'function') h.remove();
    });
    this.handles = [];
  };

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({ jmv, mapConnected: true });
      this.syncMapLayers(jmv);

      if (jmv.view && jmv.view.map && jmv.view.map.layers) {
        jmv.view.map.layers.on('change', () => {
          this.syncMapLayers(jmv);
        });
      }
    }
  };

  syncMapLayers = (jmv: JimuMapView) => {
    if (!jmv || !jmv.view || !jmv.view.map) return;
    this.clearWatchers();

    const mapLayers = jmv.view.map.layers;
    const updatedLayers: LayerItem[] = [...this.state.layers];

    const processLayer = (layer: __esri.Layer, parentCategory?: 'AMBIENTAL' | 'URBANÍSTICA' | 'SOCIAL' | 'ECONÓMICA') => {
      if (layer.type === 'group') {
        const groupTitle = (layer.title || '').toLowerCase();
        let compKey = parentCategory;
        if (!compKey) {
          if (groupTitle.includes('ambien') || groupTitle.includes('agua') || groupTitle.includes('ruido') || groupTitle.includes('riesgo') || groupTitle.includes('arbol')) {
            compKey = 'AMBIENTAL';
          } else if (groupTitle.includes('socia') || groupTitle.includes('salud') || groupTitle.includes('pobl') || groupTitle.includes('edu')) {
            compKey = 'SOCIAL';
          } else if (groupTitle.includes('econ') || groupTitle.includes('comer') || groupTitle.includes('inver')) {
            compKey = 'ECONÓMICA';
          } else if (groupTitle.includes('urban') || groupTitle.includes('suelo') || groupTitle.includes('vial') || groupTitle.includes('licencia')) {
            compKey = 'URBANÍSTICA';
          }
        }
        const sublayers = (layer as any).layers;
        if (sublayers && typeof sublayers.forEach === 'function') {
          sublayers.forEach((sub: __esri.Layer) => processLayer(sub, compKey));
        }
      } else {
        const titleLower = (layer.title || layer.id).toLowerCase();
        let compKey: 'AMBIENTAL' | 'URBANÍSTICA' | 'SOCIAL' | 'ECONÓMICA' = parentCategory || 'URBANÍSTICA';

        if (!parentCategory) {
          if (titleLower.includes('ambien') || titleLower.includes('agua') || titleLower.includes('ruido') || titleLower.includes('riesgo') || titleLower.includes('arbol')) {
            compKey = 'AMBIENTAL';
          } else if (titleLower.includes('socia') || titleLower.includes('salud') || titleLower.includes('pobl') || titleLower.includes('edu')) {
            compKey = 'SOCIAL';
          } else if (titleLower.includes('econ') || titleLower.includes('comer') || titleLower.includes('inver')) {
            compKey = 'ECONÓMICA';
          }
        }

        const existing = updatedLayers.find(l => l.id === layer.id || l.title.toLowerCase() === (layer.title || '').toLowerCase());
        if (existing) {
          existing.layer = layer;
          existing.visible = layer.visible;
          existing.componentKey = compKey;
        } else {
          updatedLayers.push({
            id: layer.id,
            title: layer.title || layer.id,
            visible: layer.visible,
            componentKey: compKey,
            iconType: 'layers',
            layer: layer
          });
        }

        if (typeof layer.watch === 'function') {
          const handle = layer.watch('visible', (newVal: boolean) => {
            this.setState(prevState => ({
              layers: prevState.layers.map(l => l.id === layer.id ? { ...l, visible: newVal } : l)
            }));
          });
          this.handles.push(handle);
        }
      }
    };

    mapLayers.forEach((layer: __esri.Layer) => processLayer(layer));

    this.setState({ layers: updatedLayers });
  };

  toggleGroup = (groupKey: string) => {
    this.setState(prevState => ({
      expandedGroups: {
        ...prevState.expandedGroups,
        [groupKey]: !prevState.expandedGroups[groupKey]
      }
    }));
  };

  toggleLayerVisibility = (layerId: string) => {
    this.setState(prevState => {
      const newLayers = prevState.layers.map(item => {
        if (item.id === layerId) {
          const newVis = !item.visible;
          if (item.layer) {
            item.layer.visible = newVis;
          }
          return { ...item, visible: newVis };
        }
        return item;
      });
      return { layers: newLayers };
    });
  };

  renderCategoryIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'plant':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10a6 6 0 0 0-6-6H3v3a6 6 0 0 0 6 6h3" />
            <path d="M12 14a6 6 0 0 1 6-6h3v3a6 6 0 0 1-6 6h-3" />
            <path d="M12 22V10" />
          </svg>
        );
      case 'building':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 6h2" /><path d="M13 6h2" /><path d="M9 10h2" /><path d="M13 10h2" />
            <path d="M9 14h2" /><path d="M13 14h2" /><path d="M9 18h6" />
          </svg>
        );
      case 'users':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'coins':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
            <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </svg>
        );
      default:
        return null;
    }
  };

  renderLayerIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case 'wind':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>;
      case 'sound':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M2 10v4m4-7v10m4-13v16m4-11v6m4-9v12m4-7v2"/></svg>;
      case 'leaf':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.12 2 9 0 5.5-4.5 9-10 9z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
      case 'water':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
      case 'warning':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
      case 'layers':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
      case 'car':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="7" rx="2"/><path d="M5 11l2-5h10l2 5"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>;
      case 'bench':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 17h18M4 11h16M4 11v6M20 11v6M5 17v4M19 17v4"/></svg>;
      case 'doc':
      case 'filechart':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
      case 'user':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
      case 'heart':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
      case 'cap':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
      case 'shield':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
      case 'bag':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
      case 'case':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
      case 'camera':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
      case 'chart':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
      default:
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="8"/></svg>;
    }
  };

  render() {
    const { expandedGroups, layers } = this.state;
    const titlePrefix = this.props.config?.title || 'Capas por';
    const titleHighlight = this.props.config?.titleHighlight || 'componente';
    const hasMap = this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0;
    const mapWidgetId = hasMap ? this.props.useMapWidgetIds[0] : null;

    const style = css`
      background-color: #030712;
      color: #f8fafc;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .widget-title {
        font-size: 1.4rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 6px 0;
        letter-spacing: -0.3px;

        .highlight {
          color: #06b6d4;
          margin-left: 6px;
        }
      }

      .category-container {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .category-card {
        background-color: #0a1120;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #1e293b;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;

        &.expanded {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          cursor: pointer;
          user-select: none;
          background: #0a1120;

          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;

            .category-title {
              font-size: 0.85rem;
              font-weight: 800;
              letter-spacing: 0.8px;
            }
          }

          .chevron-icon {
            color: #64748b;
            transition: transform 0.25s ease;
            display: flex;
            align-items: center;
          }
        }

        .category-body {
          padding: 4px 12px 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #090e1a;
          border-top: 1px solid rgba(255, 255, 255, 0.05);

          .layer-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 12px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.02);
            transition: background 0.15s ease;

            &:hover {
              background: rgba(255, 255, 255, 0.05);
            }

            .layer-left {
              display: flex;
              align-items: center;
              gap: 12px;

              .layer-label {
                font-size: 0.85rem;
                font-weight: 500;
                color: #e2e8f0;
              }
            }
          }
        }
      }
    `;

    return (
      <div css={style} className="widget-plantilla-capas jimu-widget">
        {mapWidgetId && (
          <JimuMapViewComponent
            useMapWidgetId={mapWidgetId}
            onActiveViewChange={this.activeViewChangeHandler}
          />
        )}

        {/* Header Title */}
        <h2 className="widget-title">
          {titlePrefix}
          <span className="highlight">{titleHighlight}</span>
        </h2>

        {/* Categories Accordions */}
        <div className="category-container">
          {CATEGORIES.map(cat => {
            const isExpanded = !!expandedGroups[cat.key];
            const groupLayers = layers.filter(l => l.componentKey === cat.key);

            return (
              <div
                key={cat.key}
                className={`category-card ${isExpanded ? 'expanded' : ''}`}
                style={{
                  borderColor: isExpanded ? cat.color : '#1e293b'
                }}
              >
                {/* Header */}
                <div
                  className="category-header"
                  onClick={() => this.toggleGroup(cat.key)}
                >
                  <div className="header-left">
                    {this.renderCategoryIcon(cat.icon, cat.color)}
                    <span className="category-title" style={{ color: cat.color }}>
                      {cat.title}
                    </span>
                  </div>
                  <div className="chevron-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Sub-layers List */}
                {isExpanded && (
                  <div className="category-body">
                    {groupLayers.map(item => (
                      <div key={item.id} className="layer-row">
                        <div className="layer-left">
                          {this.renderLayerIcon(item.iconType || 'layers', cat.color)}
                          <span className="layer-label">{item.title}</span>
                        </div>
                        <Switch
                          checked={item.visible}
                          onChange={() => this.toggleLayerVisibility(item.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
