System.register(["jimu-core/emotion","jimu-core","jimu-arcgis","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	return {
		setters: [
			function(module) {
				__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_core__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_core__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_ui__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./your-extensions/widgets/plantilla_capas/src/runtime/translations/default.ts":
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
const __WEBPACK_DEFAULT_EXPORT__ = ({
  _widgetLabel: 'Plantilla Capas por Componente',
  title: 'Capas por',
  titleHighlight: 'componente',
  selectMapWarning: 'Por favor, seleccione un widget de Mapa en la configuración del widget.'
});
/***/ },

/***/ "jimu-arcgis":
(module) => {
"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__;
/***/ },

/***/ "jimu-core":
(module) => {
"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;
/***/ },

/***/ "jimu-ui":
(module) => {
"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;
/***/ },

/***/ "@emotion/react/jsx-runtime":
(module) => {
"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__;
/***/ }

/******/ 	});
/******/ 	var __webpack_module_cache__ = {};
/******/ 	function __webpack_require__(moduleId) {
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			exports: {}
/******/ 		};
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 		return module.exports;
/******/ 	}
/******/ 	(() => {
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	(() => {
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
var __webpack_exports__ = {};
(() => {
__webpack_require__.p = window.jimuConfig.baseUrl;
})();

(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  __set_webpack_public_path__: () => (__set_webpack_public_path__),
  "default": () => (Widget)
});
var _emotion_jsx = __webpack_require__("@emotion/react/jsx-runtime");
var jimu_core = __webpack_require__("jimu-core");
var jimu_arcgis = __webpack_require__("jimu-arcgis");
var jimu_ui = __webpack_require__("jimu-ui");
var defaultMessages = __webpack_require__("./your-extensions/widgets/plantilla_capas/src/runtime/translations/default.ts");

const CATEGORIES = [
  { key: 'AMBIENTAL', title: 'AMBIENTAL', color: '#10b981', icon: 'plant' },
  { key: 'URBANÍSTICA', title: 'URBANÍSTICA', color: '#06b6d4', icon: 'building' },
  { key: 'SOCIAL', title: 'SOCIAL', color: '#a855f7', icon: 'users' },
  { key: 'ECONÓMICA', title: 'ECONÓMICA', color: '#0ea5e9', icon: 'coins' }
];

const DEFAULT_LAYERS = [
  { id: 'env_air', title: 'Calidad del aire', visible: true, componentKey: 'AMBIENTAL', iconType: 'wind' },
  { id: 'env_noise', title: 'Índices de ruido', visible: true, componentKey: 'AMBIENTAL', iconType: 'sound' },
  { id: 'env_veg', title: 'Cobertura vegetal', visible: true, componentKey: 'AMBIENTAL', iconType: 'leaf' },
  { id: 'env_water', title: 'Cuerpos de agua', visible: true, componentKey: 'AMBIENTAL', iconType: 'water' },
  { id: 'env_risk', title: 'Zonas de riesgo', visible: true, componentKey: 'AMBIENTAL', iconType: 'warning' },

  { id: 'urb_land', title: 'Uso del suelo', visible: false, componentKey: 'URBANÍSTICA', iconType: 'layers' },
  { id: 'urb_equip', title: 'Equipamientos', visible: false, componentKey: 'URBANÍSTICA', iconType: 'building' },
  { id: 'urb_mob', title: 'Movilidad vial', visible: false, componentKey: 'URBANÍSTICA', iconType: 'car' },
  { id: 'urb_space', title: 'Espacio público', visible: false, componentKey: 'URBANÍSTICA', iconType: 'bench' },
  { id: 'urb_lic', title: 'Licencias urbanas', visible: false, componentKey: 'URBANÍSTICA', iconType: 'doc' },

  { id: 'soc_pop', title: 'Población', visible: false, componentKey: 'SOCIAL', iconType: 'user' },
  { id: 'soc_health', title: 'Salud', visible: false, componentKey: 'SOCIAL', iconType: 'heart' },
  { id: 'soc_edu', title: 'Educación', visible: false, componentKey: 'SOCIAL', iconType: 'cap' },
  { id: 'soc_sec', title: 'Seguridad', visible: false, componentKey: 'SOCIAL', iconType: 'shield' },
  { id: 'soc_part', title: 'Participación ciudadana', visible: false, componentKey: 'SOCIAL', iconType: 'users' },

  { id: 'eco_com', title: 'Actividad comercial', visible: false, componentKey: 'ECONÓMICA', iconType: 'bag' },
  { id: 'eco_emp', title: 'Empleo', visible: false, componentKey: 'ECONÓMICA', iconType: 'case' },
  { id: 'eco_tour', title: 'Turismo', visible: false, componentKey: 'ECONÓMICA', iconType: 'camera' },
  { id: 'eco_inv', title: 'Inversión', visible: false, componentKey: 'ECONÓMICA', iconType: 'chart' },
  { id: 'eco_cad', title: 'Catastro económico', visible: false, componentKey: 'ECONÓMICA', iconType: 'filechart' }
];

class Widget extends jimu_core.React.PureComponent {
  constructor() {
    super(...arguments);
    this.handles = [];
    this.state = {
      jmv: null,
      expandedGroups: { AMBIENTAL: true, URBANÍSTICA: false, SOCIAL: false, ECONÓMICA: false },
      layers: DEFAULT_LAYERS,
      mapConnected: false
    };
    this.clearWatchers = () => {
      this.handles.forEach(h => {
        if (h && typeof h.remove === 'function') h.remove();
      });
      this.handles = [];
    };
    this.activeViewChangeHandler = (jmv) => {
      if (jmv) {
        this.setState({ jmv: jmv, mapConnected: true });
        this.syncMapLayers(jmv);
        if (jmv.view && jmv.view.map && jmv.view.map.layers) {
          jmv.view.map.layers.on('change', () => {
            this.syncMapLayers(jmv);
          });
        }
      }
    };
    this.syncMapLayers = (jmv) => {
      if (!jmv || !jmv.view || !jmv.view.map) return;
      this.clearWatchers();
      const mapLayers = jmv.view.map.layers;
      const updatedLayers = [...this.state.layers];

      const processLayer = (layer, parentCategory) => {
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
          const sublayers = layer.layers;
          if (sublayers && typeof sublayers.forEach === 'function') {
            sublayers.forEach(sub => processLayer(sub, compKey));
          }
        } else {
          const titleLower = (layer.title || layer.id).toLowerCase();
          let compKey = parentCategory || 'URBANÍSTICA';
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
            const handle = layer.watch('visible', (newVal) => {
              this.setState(prevState => ({
                layers: prevState.layers.map(l => l.id === layer.id ? Object.assign({}, l, { visible: newVal }) : l)
              }));
            });
            this.handles.push(handle);
          }
        }
      };

      mapLayers.forEach(layer => processLayer(layer));
      this.setState({ layers: updatedLayers });
    };

    this.toggleGroup = (groupKey) => {
      this.setState(prevState => ({
        expandedGroups: Object.assign({}, prevState.expandedGroups, { [groupKey]: !prevState.expandedGroups[groupKey] })
      }));
    };
    this.toggleLayerVisibility = (layerId) => {
      this.setState(prevState => {
        const newLayers = prevState.layers.map(item => {
          if (item.id === layerId) {
            const newVis = !item.visible;
            if (item.layer) item.layer.visible = newVis;
            return Object.assign({}, item, { visible: newVis });
          }
          return item;
        });
        return { layers: newLayers };
      });
    };
  }
  componentWillUnmount() {
    this.clearWatchers();
  }
  renderCategoryIcon(iconName, color) {
    switch (iconName) {
      case 'plant':
        return (_emotion_jsx.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(_emotion_jsx.jsx)("path", { d: "M12 10a6 6 0 0 0-6-6H3v3a6 6 0 0 0 6 6h3" }), (_emotion_jsx.jsx)("path", { d: "M12 14a6 6 0 0 1 6-6h3v3a6 6 0 0 1-6 6h-3" }), (_emotion_jsx.jsx)("path", { d: "M12 22V10" })] });
      case 'building':
        return (_emotion_jsx.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(_emotion_jsx.jsx)("rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }), (_emotion_jsx.jsx)("path", { d: "M9 6h2" }), (_emotion_jsx.jsx)("path", { d: "M13 6h2" }), (_emotion_jsx.jsx)("path", { d: "M9 10h2" }), (_emotion_jsx.jsx)("path", { d: "M13 10h2" }), (_emotion_jsx.jsx)("path", { d: "M9 14h2" }), (_emotion_jsx.jsx)("path", { d: "M13 14h2" }), (_emotion_jsx.jsx)("path", { d: "M9 18h6" })] });
      case 'users':
        return (_emotion_jsx.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(_emotion_jsx.jsx)("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }), (_emotion_jsx.jsx)("circle", { cx: "9", cy: "7", r: "4" }), (_emotion_jsx.jsx)("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }), (_emotion_jsx.jsx)("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] });
      case 'coins':
        return (_emotion_jsx.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(_emotion_jsx.jsx)("ellipse", { cx: "12", cy: "6", rx: "8", ry: "3" }), (_emotion_jsx.jsx)("path", { d: "M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" }), (_emotion_jsx.jsx)("path", { d: "M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" })] });
      default: return null;
    }
  }
  renderLayerIcon(iconType, color) {
    switch (iconType) {
      case 'wind': return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("path", { d: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" }) });
      case 'sound': return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("path", { d: "M2 10v4m4-7v10m4-13v16m4-11v6m4-9v12m4-7v2" }) });
      case 'leaf': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.12 2 9 0 5.5-4.5 9-10 9z" }), (_emotion_jsx.jsx)("path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" })] });
      case 'water': return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("path", { d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" }) });
      case 'warning': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), (_emotion_jsx.jsx)("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), (_emotion_jsx.jsx)("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })] });
      case 'layers': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }), (_emotion_jsx.jsx)("polyline", { points: "2 17 12 22 22 17" }), (_emotion_jsx.jsx)("polyline", { points: "2 12 12 17 22 12" })] });
      case 'car': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("rect", { x: "3", y: "11", width: "18", height: "7", rx: "2" }), (_emotion_jsx.jsx)("path", { d: "M5 11l2-5h10l2 5" }), (_emotion_jsx.jsx)("circle", { cx: "7", cy: "18", r: "1.5" }), (_emotion_jsx.jsx)("circle", { cx: "17", cy: "18", r: "1.5" })] });
      case 'bench': return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("path", { d: "M3 17h18M4 11h16M4 11v6M20 11v6M5 17v4M19 17v4" }) });
      case 'doc':
      case 'filechart': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), (_emotion_jsx.jsx)("polyline", { points: "14 2 14 8 20 8" })] });
      case 'user': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), (_emotion_jsx.jsx)("circle", { cx: "12", cy: "7", r: "4" })] });
      case 'heart': return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) });
      case 'cap': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z" }), (_emotion_jsx.jsx)("path", { d: "M6 12v5c3 3 9 3 12 0v-5" })] });
      case 'shield': return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) });
      case 'bag': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), (_emotion_jsx.jsx)("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), (_emotion_jsx.jsx)("path", { d: "M16 10a4 4 0 0 1-8 0" })] });
      case 'case': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2" }), (_emotion_jsx.jsx)("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })] });
      case 'camera': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }), (_emotion_jsx.jsx)("circle", { cx: "12", cy: "13", r: "4" })] });
      case 'chart': return (_emotion_jsx.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(_emotion_jsx.jsx)("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }), (_emotion_jsx.jsx)("polyline", { points: "17 6 23 6 23 12" })] });
      default: return (_emotion_jsx.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (_emotion_jsx.jsx)("circle", { cx: "12", cy: "12", r: "8" }) });
    }
  }
  render() {
    var _a, _b, _c;
    const { expandedGroups, layers } = this.state;
    const titlePrefix = ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.title) || 'Capas por';
    const titleHighlight = ((_b = this.props.config) === null || _b === void 0 ? void 0 : _b.titleHighlight) || 'componente';
    const hasMap = this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0;
    const mapWidgetId = hasMap ? this.props.useMapWidgetIds[0] : null;

    const style = jimu_core.css`
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

    return (_emotion_jsx.jsxs)("div", {
      css: style,
      className: "widget-plantilla-capas jimu-widget",
      children: [
        mapWidgetId && (_emotion_jsx.jsx)(jimu_arcgis.JimuMapViewComponent, {
          useMapWidgetId: mapWidgetId,
          onActiveViewChange: this.activeViewChangeHandler
        }),
        (_emotion_jsx.jsxs)("h2", {
          className: "widget-title",
          children: [
            titlePrefix,
            (_emotion_jsx.jsx)("span", { className: "highlight", children: titleHighlight })
          ]
        }),
        (_emotion_jsx.jsx)("div", {
          className: "category-container",
          children: CATEGORIES.map(cat => {
            const isExpanded = !!expandedGroups[cat.key];
            const groupLayers = layers.filter(l => l.componentKey === cat.key);
            return (_emotion_jsx.jsxs)("div", {
              className: `category-card ${isExpanded ? 'expanded' : ''}`,
              style: { borderColor: isExpanded ? cat.color : '#1e293b' },
              children: [
                (_emotion_jsx.jsxs)("div", {
                  className: "category-header",
                  onClick: () => this.toggleGroup(cat.key),
                  children: [
                    (_emotion_jsx.jsxs)("div", {
                      className: "header-left",
                      children: [
                        this.renderCategoryIcon(cat.icon, cat.color),
                        (_emotion_jsx.jsx)("span", { className: "category-title", style: { color: cat.color }, children: cat.title })
                      ]
                    }),
                    (_emotion_jsx.jsx)("div", {
                      className: "chevron-icon",
                      children: (_emotion_jsx.jsx)("svg", {
                        width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap="round", strokeLinejoin="round",
                        style: { transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' },
                        children: (_emotion_jsx.jsx)("polyline", { points: "6 9 12 15 18 9" })
                      })
                    })
                  ]
                }),
                isExpanded && (_emotion_jsx.jsx)("div", {
                  className: "category-body",
                  children: groupLayers.map(item => (
                    (_emotion_jsx.jsxs)("div", {
                      className: "layer-row",
                      children: [
                        (_emotion_jsx.jsxs)("div", {
                          className: "layer-left",
                          children: [
                            this.renderLayerIcon(item.iconType || 'layers', cat.color),
                            (_emotion_jsx.jsx)("span", { className: "layer-label", children: item.title })
                          ]
                        }),
                        (_emotion_jsx.jsx)(jimu_ui.Switch, {
                          checked: item.visible,
                          onChange: () => this.toggleLayerVisibility(item.id)
                        })
                      ]
                    }, item.id)
                  ))
                })
              ]
            }, cat.key);
          })
        })
      ]
    });
  }
}
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }
})();
return __webpack_exports__;
})()
			);
		}
	};
});
