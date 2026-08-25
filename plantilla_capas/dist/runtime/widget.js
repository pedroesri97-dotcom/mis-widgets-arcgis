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

/***/ "jimu-arcgis"
/*!******************************!*\
  !*** external "jimu-arcgis" ***!
  \******************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__;

/***/ },

/***/ "jimu-core"
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;

/***/ },

/***/ "@emotion/react/jsx-runtime"
/*!************************************!*\
  !*** external "jimu-core/emotion" ***!
  \************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__;

/***/ },

/***/ "jimu-ui"
/*!**************************!*\
  !*** external "jimu-ui" ***!
  \**************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./jimu-core/lib/set-public-path.ts ***!
  \******************************************/
/**
 * Webpack will replace __webpack_public_path__ with __webpack_require__.p to set the public path dynamically.
 * The reason why we can't set the publicPath in webpack config is: we change the publicPath when download.
 * */
__webpack_require__.p = window.jimuConfig.baseUrl;

})();

// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************************************************************************!*\
  !*** ./your-extensions/widgets/plantilla_capas 1/plantilla_capas/src/runtime/widget.tsx ***!
  \******************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (/* binding */ Widget)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_arcgis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-arcgis */ "jimu-arcgis");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");

/** @jsx jsx */



const CATEGORIES = [
    { key: 'AMBIENTAL', title: 'AMBIENTAL', color: '#10b981', icon: 'plant' },
    { key: 'URBANÍSTICA', title: 'URBANÍSTICA', color: '#06b6d4', icon: 'building' },
    { key: 'SOCIAL', title: 'SOCIAL', color: '#a855f7', icon: 'users' },
    { key: 'ECONÓMICA', title: 'ECONÓMICA', color: '#0ea5e9', icon: 'coins' }
];
const DEFAULT_LAYERS = [
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
class Widget extends jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.PureComponent {
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
                if (h && typeof h.remove === 'function')
                    h.remove();
            });
            this.handles = [];
        };
        this.activeViewChangeHandler = (jmv) => {
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
        this.syncMapLayers = (jmv) => {
            if (!jmv || !jmv.view || !jmv.view.map)
                return;
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
                        }
                        else if (groupTitle.includes('socia') || groupTitle.includes('salud') || groupTitle.includes('pobl') || groupTitle.includes('edu')) {
                            compKey = 'SOCIAL';
                        }
                        else if (groupTitle.includes('econ') || groupTitle.includes('comer') || groupTitle.includes('inver')) {
                            compKey = 'ECONÓMICA';
                        }
                        else if (groupTitle.includes('urban') || groupTitle.includes('suelo') || groupTitle.includes('vial') || groupTitle.includes('licencia')) {
                            compKey = 'URBANÍSTICA';
                        }
                    }
                    const sublayers = layer.layers;
                    if (sublayers && typeof sublayers.forEach === 'function') {
                        sublayers.forEach((sub) => processLayer(sub, compKey));
                    }
                }
                else {
                    const titleLower = (layer.title || layer.id).toLowerCase();
                    let compKey = parentCategory || 'URBANÍSTICA';
                    if (!parentCategory) {
                        if (titleLower.includes('ambien') || titleLower.includes('agua') || titleLower.includes('ruido') || titleLower.includes('riesgo') || titleLower.includes('arbol')) {
                            compKey = 'AMBIENTAL';
                        }
                        else if (titleLower.includes('socia') || titleLower.includes('salud') || titleLower.includes('pobl') || titleLower.includes('edu')) {
                            compKey = 'SOCIAL';
                        }
                        else if (titleLower.includes('econ') || titleLower.includes('comer') || titleLower.includes('inver')) {
                            compKey = 'ECONÓMICA';
                        }
                    }
                    const existing = updatedLayers.find(l => l.id === layer.id || l.title.toLowerCase() === (layer.title || '').toLowerCase());
                    if (existing) {
                        existing.layer = layer;
                        existing.visible = layer.visible;
                        existing.componentKey = compKey;
                    }
                    else {
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
                                layers: prevState.layers.map(l => l.id === layer.id ? Object.assign(Object.assign({}, l), { visible: newVal }) : l)
                            }));
                        });
                        this.handles.push(handle);
                    }
                }
            };
            mapLayers.forEach((layer) => processLayer(layer));
            this.setState({ layers: updatedLayers });
        };
        this.toggleGroup = (groupKey) => {
            this.setState(prevState => ({
                expandedGroups: Object.assign(Object.assign({}, prevState.expandedGroups), { [groupKey]: !prevState.expandedGroups[groupKey] })
            }));
        };
        this.toggleLayerVisibility = (layerId) => {
            this.setState(prevState => {
                const newLayers = prevState.layers.map(item => {
                    if (item.id === layerId) {
                        const newVis = !item.visible;
                        if (item.layer) {
                            item.layer.visible = newVis;
                        }
                        return Object.assign(Object.assign({}, item), { visible: newVis });
                    }
                    return item;
                });
                return { layers: newLayers };
            });
        };
        this.renderCategoryIcon = (iconName, color) => {
            switch (iconName) {
                case 'plant':
                    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 10a6 6 0 0 0-6-6H3v3a6 6 0 0 0 6 6h3" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 14a6 6 0 0 1 6-6h3v3a6 6 0 0 1-6 6h-3" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 22V10" })] }));
                case 'building':
                    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9 6h2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M13 6h2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9 10h2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M13 10h2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9 14h2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M13 14h2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9 18h6" })] }));
                case 'users':
                    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "9", cy: "7", r: "4" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }));
                case 'coins':
                    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ellipse", { cx: "12", cy: "6", rx: "8", ry: "3" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" })] }));
                default:
                    return null;
            }
        };
        this.renderLayerIcon = (iconType, color) => {
            switch (iconType) {
                case 'wind':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" }) });
                case 'sound':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M2 10v4m4-7v10m4-13v16m4-11v6m4-9v12m4-7v2" }) });
                case 'leaf':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.12 2 9 0 5.5-4.5 9-10 9z" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" })] });
                case 'water':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" }) });
                case 'warning':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })] });
                case 'layers':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", { points: "2 17 12 22 22 17" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", { points: "2 12 12 17 22 12" })] });
                case 'car':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", { x: "3", y: "11", width: "18", height: "7", rx: "2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M5 11l2-5h10l2 5" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "7", cy: "18", r: "1.5" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "17", cy: "18", r: "1.5" })] });
                case 'bench':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M3 17h18M4 11h16M4 11v6M20 11v6M5 17v4M19 17v4" }) });
                case 'doc':
                case 'filechart':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", { points: "14 2 14 8 20 8" })] });
                case 'user':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "12", cy: "7", r: "4" })] });
                case 'heart':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) });
                case 'cap':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M6 12v5c3 3 9 3 12 0v-5" })] });
                case 'shield':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) });
                case 'bag':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M16 10a4 4 0 0 1-8 0" })] });
                case 'case':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })] });
                case 'camera':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "12", cy: "13", r: "4" })] });
                case 'chart':
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", { points: "17 6 23 6 23 12" })] });
                default:
                    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "12", cy: "12", r: "8" }) });
            }
        };
    }
    componentWillUnmount() {
        this.clearWatchers();
    }
    render() {
        var _a, _b;
        const { expandedGroups, layers } = this.state;
        const titlePrefix = ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.title) || 'Capas por';
        const titleHighlight = ((_b = this.props.config) === null || _b === void 0 ? void 0 : _b.titleHighlight) || 'componente';
        const hasMap = this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0;
        const mapWidgetId = hasMap ? this.props.useMapWidgetIds[0] : null;
        const style = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.css) `
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
        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { css: style, className: "widget-plantilla-capas jimu-widget", children: [mapWidgetId && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_arcgis__WEBPACK_IMPORTED_MODULE_2__.JimuMapViewComponent, { useMapWidgetId: mapWidgetId, onActiveViewChange: this.activeViewChangeHandler })), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h2", { className: "widget-title", children: [titlePrefix, (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "highlight", children: titleHighlight })] }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "category-container", children: CATEGORIES.map(cat => {
                        const isExpanded = !!expandedGroups[cat.key];
                        const groupLayers = layers.filter(l => l.componentKey === cat.key);
                        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `category-card ${isExpanded ? 'expanded' : ''}`, style: {
                                borderColor: isExpanded ? cat.color : '#1e293b'
                            }, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "category-header", onClick: () => this.toggleGroup(cat.key), children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-left", children: [this.renderCategoryIcon(cat.icon, cat.color), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "category-title", style: { color: cat.color }, children: cat.title })] }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "chevron-icon", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", style: {
                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                                }, children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", { points: "6 9 12 15 18 9" }) }) })] }), isExpanded && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "category-body", children: groupLayers.map(item => ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "layer-row", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "layer-left", children: [this.renderLayerIcon(item.iconType || 'layers', cat.color), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "layer-label", children: item.title })] }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Switch, { checked: item.visible, onChange: () => this.toggleLayerVisibility(item.id) })] }, item.id))) }))] }, cat.key));
                    }) })] }));
    }
}
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9wbGFudGlsbGFfY2FwYXMgMS9wbGFudGlsbGFfY2FwYXMvZGlzdC9ydW50aW1lL3dpZGdldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5RDs7Ozs7Ozs7Ozs7QUNBQSx1RDs7Ozs7Ozs7Ozs7QUNBQSx3RTs7Ozs7Ozs7Ozs7QUNBQSxxRDs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztXQ05BLDJCOzs7Ozs7Ozs7O0FDQUE7OztLQUdLO0FBQ0wscUJBQXVCLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0puRCxlQUFlO0FBQzZDO0FBQ0k7QUFDL0I7QUFvQmpDLE1BQU0sVUFBVSxHQUF3QjtJQUN0QyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDekUsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQ2hGLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9B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LElBQUksQ0FBQyxFQUFFLENBQUMsR0FDbkQsS0FSTSxJQUFJLENBQUMsRUFBRSxDQVNYLENBQ1AsQ0FBQyxHQUNFLENBQ1AsS0FwREksR0FBRyxDQUFDLEdBQUcsQ0FxRFIsQ0FDUCxDQUFDO29CQUNKLENBQUMsQ0FBQyxHQUNFLElBQ0YsQ0FDUCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRU8sU0FBUywyQkFBMkIsQ0FBQyxHQUFHLElBQUkscUJBQXVCLEdBQUcsR0FBRyxFQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtYXJjZ2lzXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LWNvcmVcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZS9lbW90aW9uXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LXVpXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL2ppbXUtY29yZS9saWIvc2V0LXB1YmxpYy1wYXRoLnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9wbGFudGlsbGFfY2FwYXMgMS9wbGFudGlsbGFfY2FwYXMvc3JjL3J1bnRpbWUvd2lkZ2V0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV9hcmNnaXNfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV9jb3JlX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX19lbW90aW9uX3JlYWN0X2pzeF9ydW50aW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfdWlfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBleGlzdHMgKGRldmVsb3BtZW50IG9ubHkpXG5cdGlmIChfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCIvKipcclxuICogV2VicGFjayB3aWxsIHJlcGxhY2UgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gd2l0aCBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgdG8gc2V0IHRoZSBwdWJsaWMgcGF0aCBkeW5hbWljYWxseS5cclxuICogVGhlIHJlYXNvbiB3aHkgd2UgY2FuJ3Qgc2V0IHRoZSBwdWJsaWNQYXRoIGluIHdlYnBhY2sgY29uZmlnIGlzOiB3ZSBjaGFuZ2UgdGhlIHB1YmxpY1BhdGggd2hlbiBkb3dubG9hZC5cclxuICogKi9cclxuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB3aW5kb3cuamltdUNvbmZpZy5iYXNlVXJsXHJcbiIsIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVhY3QsIEFsbFdpZGdldFByb3BzLCBjc3MsIGpzeCB9IGZyb20gJ2ppbXUtY29yZSc7XG5pbXBvcnQgeyBKaW11TWFwVmlld0NvbXBvbmVudCwgSmltdU1hcFZpZXcgfSBmcm9tICdqaW11LWFyY2dpcyc7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tICdqaW11LXVpJztcbmltcG9ydCB7IElNQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBkZWZhdWx0TWVzc2FnZXMgZnJvbSAnLi90cmFuc2xhdGlvbnMvZGVmYXVsdCc7XG5cbmludGVyZmFjZSBMYXllckl0ZW0ge1xuICBpZDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aXNpYmxlOiBib29sZWFuO1xuICBjb21wb25lbnRLZXk6ICdBTUJJRU5UQUwnIHwgJ1VSQkFOw41TVElDQScgfCAnU09DSUFMJyB8ICdFQ09Ow5NNSUNBJztcbiAgaWNvblR5cGU/OiBzdHJpbmc7XG4gIGxheWVyPzogX19lc3JpLkxheWVyO1xufVxuXG5pbnRlcmZhY2UgQ29tcG9uZW50Q2F0ZWdvcnkge1xuICBrZXk6ICdBTUJJRU5UQUwnIHwgJ1VSQkFOw41TVElDQScgfCAnU09DSUFMJyB8ICdFQ09Ow5NNSUNBJztcbiAgdGl0bGU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xufVxuXG5jb25zdCBDQVRFR09SSUVTOiBDb21wb25lbnRDYXRlZ29yeVtdID0gW1xuICB7IGtleTogJ0FNQklFTlRBTCcsIHRpdGxlOiAnQU1CSUVOVEFMJywgY29sb3I6ICcjMTBiOTgxJywgaWNvbjogJ3BsYW50JyB9LFxuICB7IGtleTogJ1VSQkFOw41TVElDQScsIHRpdGxlOiAnVVJCQU7DjVNUSUNBJywgY29sb3I6ICcjMDZiNmQ0JywgaWNvbjogJ2J1aWxkaW5nJyB9LFxuICB7IGtleTogJ1NPQ0lBTCcsIHRpdGxlOiAnU09DSUFMJywgY29sb3I6ICcjYTg1NWY3JywgaWNvbjogJ3VzZXJzJyB9LFxuICB7IGtleTogJ0VDT07Dk01JQ0EnLCB0aXRsZTogJ0VDT07Dk01JQ0EnLCBjb2xvcjogJyMwZWE1ZTknLCBpY29uOiAnY29pbnMnIH1cbl07XG5cbmNvbnN0IERFRkFVTFRfTEFZRVJTOiBMYXllckl0ZW1bXSA9IFtcbiAgLy8gQU1CSUVOVEFMXG4gIHsgaWQ6ICdlbnZfYWlyJywgdGl0bGU6ICdDYWxpZGFkIGRlbCBhaXJlJywgdmlzaWJsZTogdHJ1ZSwgY29tcG9uZW50S2V5OiAnQU1CSUVOVEFMJywgaWNvblR5cGU6ICd3aW5kJyB9LFxuICB7IGlkOiAnZW52X25vaXNlJywgdGl0bGU6ICfDjW5kaWNlcyBkZSBydWlkbycsIHZpc2libGU6IHRydWUsIGNvbXBvbmVudEtleTogJ0FNQklFTlRBTCcsIGljb25UeXBlOiAnc291bmQnIH0sXG4gIHsgaWQ6ICdlbnZfdmVnJywgdGl0bGU6ICdDb2JlcnR1cmEgdmVnZXRhbCcsIHZpc2libGU6IHRydWUsIGNvbXBvbmVudEtleTogJ0FNQklFTlRBTCcsIGljb25UeXBlOiAnbGVhZicgfSxcbiAgeyBpZDogJ2Vudl93YXRlcicsIHRpdGxlOiAnQ3VlcnBvcyBkZSBhZ3VhJywgdmlzaWJsZTogdHJ1ZSwgY29tcG9uZW50S2V5OiAnQU1CSUVOVEFMJywgaWNvblR5cGU6ICd3YXRlcicgfSxcbiAgeyBpZDogJ2Vudl9yaXNrJywgdGl0bGU6ICdab25hcyBkZSByaWVzZ28nLCB2aXNpYmxlOiB0cnVlLCBjb21wb25lbnRLZXk6ICdBTUJJRU5UQUwnLCBpY29uVHlwZTogJ3dhcm5pbmcnIH0sXG5cbiAgLy8gVVJCQU7DjVNUSUNBXG4gIHsgaWQ6ICd1cmJfbGFuZCcsIHRpdGxlOiAnVXNvIGRlbCBzdWVsbycsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdVUkJBTsONU1RJQ0EnLCBpY29uVHlwZTogJ2xheWVycycgfSxcbiAgeyBpZDogJ3VyYl9lcXVpcCcsIHRpdGxlOiAnRXF1aXBhbWllbnRvcycsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdVUkJBTsONU1RJQ0EnLCBpY29uVHlwZTogJ2J1aWxkaW5nJyB9LFxuICB7IGlkOiAndXJiX21vYicsIHRpdGxlOiAnTW92aWxpZGFkIHZpYWwnLCB2aXNpYmxlOiBmYWxzZSwgY29tcG9uZW50S2V5OiAnVVJCQU7DjVNUSUNBJywgaWNvblR5cGU6ICdjYXInIH0sXG4gIHsgaWQ6ICd1cmJfc3BhY2UnLCB0aXRsZTogJ0VzcGFjaW8gcMO6YmxpY28nLCB2aXNpYmxlOiBmYWxzZSwgY29tcG9uZW50S2V5OiAnVVJCQU7DjVNUSUNBJywgaWNvblR5cGU6ICdiZW5jaCcgfSxcbiAgeyBpZDogJ3VyYl9saWMnLCB0aXRsZTogJ0xpY2VuY2lhcyB1cmJhbmFzJywgdmlzaWJsZTogZmFsc2UsIGNvbXBvbmVudEtleTogJ1VSQkFOw41TVElDQScsIGljb25UeXBlOiAnZG9jJyB9LFxuXG4gIC8vIFNPQ0lBTFxuICB7IGlkOiAnc29jX3BvcCcsIHRpdGxlOiAnUG9ibGFjacOzbicsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdTT0NJQUwnLCBpY29uVHlwZTogJ3VzZXInIH0sXG4gIHsgaWQ6ICdzb2NfaGVhbHRoJywgdGl0bGU6ICdTYWx1ZCcsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdTT0NJQUwnLCBpY29uVHlwZTogJ2hlYXJ0JyB9LFxuICB7IGlkOiAnc29jX2VkdScsIHRpdGxlOiAnRWR1Y2FjacOzbicsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdTT0NJQUwnLCBpY29uVHlwZTogJ2NhcCcgfSxcbiAgeyBpZDogJ3NvY19zZWMnLCB0aXRsZTogJ1NlZ3VyaWRhZCcsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdTT0NJQUwnLCBpY29uVHlwZTogJ3NoaWVsZCcgfSxcbiAgeyBpZDogJ3NvY19wYXJ0JywgdGl0bGU6ICdQYXJ0aWNpcGFjacOzbiBjaXVkYWRhbmEnLCB2aXNpYmxlOiBmYWxzZSwgY29tcG9uZW50S2V5OiAnU09DSUFMJywgaWNvblR5cGU6ICd1c2VycycgfSxcblxuICAvLyBFQ09Ow5NNSUNBXG4gIHsgaWQ6ICdlY29fY29tJywgdGl0bGU6ICdBY3RpdmlkYWQgY29tZXJjaWFsJywgdmlzaWJsZTogZmFsc2UsIGNvbXBvbmVudEtleTogJ0VDT07Dk01JQ0EnLCBpY29uVHlwZTogJ2JhZycgfSxcbiAgeyBpZDogJ2Vjb19lbXAnLCB0aXRsZTogJ0VtcGxlbycsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdFQ09Ow5NNSUNBJywgaWNvblR5cGU6ICdjYXNlJyB9LFxuICB7IGlkOiAnZWNvX3RvdXInLCB0aXRsZTogJ1R1cmlzbW8nLCB2aXNpYmxlOiBmYWxzZSwgY29tcG9uZW50S2V5OiAnRUNPTsOTTUlDQScsIGljb25UeXBlOiAnY2FtZXJhJyB9LFxuICB7IGlkOiAnZWNvX2ludicsIHRpdGxlOiAnSW52ZXJzacOzbicsIHZpc2libGU6IGZhbHNlLCBjb21wb25lbnRLZXk6ICdFQ09Ow5NNSUNBJywgaWNvblR5cGU6ICdjaGFydCcgfSxcbiAgeyBpZDogJ2Vjb19jYWQnLCB0aXRsZTogJ0NhdGFzdHJvIGVjb27Ds21pY28nLCB2aXNpYmxlOiBmYWxzZSwgY29tcG9uZW50S2V5OiAnRUNPTsOTTUlDQScsIGljb25UeXBlOiAnZmlsZWNoYXJ0JyB9XG5dO1xuXG5pbnRlcmZhY2UgU3RhdGUge1xuICBqbXY6IEppbXVNYXBWaWV3O1xuICBleHBhbmRlZEdyb3VwczogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH07XG4gIGxheWVyczogTGF5ZXJJdGVtW107XG4gIG1hcENvbm5lY3RlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2lkZ2V0IGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudDxBbGxXaWRnZXRQcm9wczxJTUNvbmZpZz4sIFN0YXRlPiB7XG4gIGhhbmRsZXM6IEFycmF5PHsgcmVtb3ZlOiAoKSA9PiB2b2lkIH0+ID0gW107XG5cbiAgc3RhdGU6IFN0YXRlID0ge1xuICAgIGptdjogbnVsbCxcbiAgICBleHBhbmRlZEdyb3VwczogeyBBTUJJRU5UQUw6IHRydWUsIFVSQkFOw41TVElDQTogZmFsc2UsIFNPQ0lBTDogZmFsc2UsIEVDT07Dk01JQ0E6IGZhbHNlIH0sXG4gICAgbGF5ZXJzOiBERUZBVUxUX0xBWUVSUyxcbiAgICBtYXBDb25uZWN0ZWQ6IGZhbHNlXG4gIH07XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5jbGVhcldhdGNoZXJzKCk7XG4gIH1cblxuICBjbGVhcldhdGNoZXJzID0gKCkgPT4ge1xuICAgIHRoaXMuaGFuZGxlcy5mb3JFYWNoKGggPT4ge1xuICAgICAgaWYgKGggJiYgdHlwZW9mIGgucmVtb3ZlID09PSAnZnVuY3Rpb24nKSBoLnJlbW92ZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuaGFuZGxlcyA9IFtdO1xuICB9O1xuXG4gIGFjdGl2ZVZpZXdDaGFuZ2VIYW5kbGVyID0gKGptdjogSmltdU1hcFZpZXcpID0+IHtcbiAgICBpZiAoam12KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgam12LCBtYXBDb25uZWN0ZWQ6IHRydWUgfSk7XG4gICAgICB0aGlzLnN5bmNNYXBMYXllcnMoam12KTtcblxuICAgICAgaWYgKGptdi52aWV3ICYmIGptdi52aWV3Lm1hcCAmJiBqbXYudmlldy5tYXAubGF5ZXJzKSB7XG4gICAgICAgIGptdi52aWV3Lm1hcC5sYXllcnMub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICB0aGlzLnN5bmNNYXBMYXllcnMoam12KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHN5bmNNYXBMYXllcnMgPSAoam12OiBKaW11TWFwVmlldykgPT4ge1xuICAgIGlmICgham12IHx8ICFqbXYudmlldyB8fCAham12LnZpZXcubWFwKSByZXR1cm47XG4gICAgdGhpcy5jbGVhcldhdGNoZXJzKCk7XG5cbiAgICBjb25zdCBtYXBMYXllcnMgPSBqbXYudmlldy5tYXAubGF5ZXJzO1xuICAgIGNvbnN0IHVwZGF0ZWRMYXllcnM6IExheWVySXRlbVtdID0gWy4uLnRoaXMuc3RhdGUubGF5ZXJzXTtcblxuICAgIGNvbnN0IHByb2Nlc3NMYXllciA9IChsYXllcjogX19lc3JpLkxheWVyLCBwYXJlbnRDYXRlZ29yeT86ICdBTUJJRU5UQUwnIHwgJ1VSQkFOw41TVElDQScgfCAnU09DSUFMJyB8ICdFQ09Ow5NNSUNBJykgPT4ge1xuICAgICAgaWYgKGxheWVyLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBUaXRsZSA9IChsYXllci50aXRsZSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IGNvbXBLZXkgPSBwYXJlbnRDYXRlZ29yeTtcbiAgICAgICAgaWYgKCFjb21wS2V5KSB7XG4gICAgICAgICAgaWYgKGdyb3VwVGl0bGUuaW5jbHVkZXMoJ2FtYmllbicpIHx8IGdyb3VwVGl0bGUuaW5jbHVkZXMoJ2FndWEnKSB8fCBncm91cFRpdGxlLmluY2x1ZGVzKCdydWlkbycpIHx8IGdyb3VwVGl0bGUuaW5jbHVkZXMoJ3JpZXNnbycpIHx8IGdyb3VwVGl0bGUuaW5jbHVkZXMoJ2FyYm9sJykpIHtcbiAgICAgICAgICAgIGNvbXBLZXkgPSAnQU1CSUVOVEFMJztcbiAgICAgICAgICB9IGVsc2UgaWYgKGdyb3VwVGl0bGUuaW5jbHVkZXMoJ3NvY2lhJykgfHwgZ3JvdXBUaXRsZS5pbmNsdWRlcygnc2FsdWQnKSB8fCBncm91cFRpdGxlLmluY2x1ZGVzKCdwb2JsJykgfHwgZ3JvdXBUaXRsZS5pbmNsdWRlcygnZWR1JykpIHtcbiAgICAgICAgICAgIGNvbXBLZXkgPSAnU09DSUFMJztcbiAgICAgICAgICB9IGVsc2UgaWYgKGdyb3VwVGl0bGUuaW5jbHVkZXMoJ2Vjb24nKSB8fCBncm91cFRpdGxlLmluY2x1ZGVzKCdjb21lcicpIHx8IGdyb3VwVGl0bGUuaW5jbHVkZXMoJ2ludmVyJykpIHtcbiAgICAgICAgICAgIGNvbXBLZXkgPSAnRUNPTsOTTUlDQSc7XG4gICAgICAgICAgfSBlbHNlIGlmIChncm91cFRpdGxlLmluY2x1ZGVzKCd1cmJhbicpIHx8IGdyb3VwVGl0bGUuaW5jbHVkZXMoJ3N1ZWxvJykgfHwgZ3JvdXBUaXRsZS5pbmNsdWRlcygndmlhbCcpIHx8IGdyb3VwVGl0bGUuaW5jbHVkZXMoJ2xpY2VuY2lhJykpIHtcbiAgICAgICAgICAgIGNvbXBLZXkgPSAnVVJCQU7DjVNUSUNBJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3VibGF5ZXJzID0gKGxheWVyIGFzIGFueSkubGF5ZXJzO1xuICAgICAgICBpZiAoc3VibGF5ZXJzICYmIHR5cGVvZiBzdWJsYXllcnMuZm9yRWFjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHN1YmxheWVycy5mb3JFYWNoKChzdWI6IF9fZXNyaS5MYXllcikgPT4gcHJvY2Vzc0xheWVyKHN1YiwgY29tcEtleSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0aXRsZUxvd2VyID0gKGxheWVyLnRpdGxlIHx8IGxheWVyLmlkKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgY29tcEtleTogJ0FNQklFTlRBTCcgfCAnVVJCQU7DjVNUSUNBJyB8ICdTT0NJQUwnIHwgJ0VDT07Dk01JQ0EnID0gcGFyZW50Q2F0ZWdvcnkgfHwgJ1VSQkFOw41TVElDQSc7XG5cbiAgICAgICAgaWYgKCFwYXJlbnRDYXRlZ29yeSkge1xuICAgICAgICAgIGlmICh0aXRsZUxvd2VyLmluY2x1ZGVzKCdhbWJpZW4nKSB8fCB0aXRsZUxvd2VyLmluY2x1ZGVzKCdhZ3VhJykgfHwgdGl0bGVMb3dlci5pbmNsdWRlcygncnVpZG8nKSB8fCB0aXRsZUxvd2VyLmluY2x1ZGVzKCdyaWVzZ28nKSB8fCB0aXRsZUxvd2VyLmluY2x1ZGVzKCdhcmJvbCcpKSB7XG4gICAgICAgICAgICBjb21wS2V5ID0gJ0FNQklFTlRBTCc7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aXRsZUxvd2VyLmluY2x1ZGVzKCdzb2NpYScpIHx8IHRpdGxlTG93ZXIuaW5jbHVkZXMoJ3NhbHVkJykgfHwgdGl0bGVMb3dlci5pbmNsdWRlcygncG9ibCcpIHx8IHRpdGxlTG93ZXIuaW5jbHVkZXMoJ2VkdScpKSB7XG4gICAgICAgICAgICBjb21wS2V5ID0gJ1NPQ0lBTCc7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aXRsZUxvd2VyLmluY2x1ZGVzKCdlY29uJykgfHwgdGl0bGVMb3dlci5pbmNsdWRlcygnY29tZXInKSB8fCB0aXRsZUxvd2VyLmluY2x1ZGVzKCdpbnZlcicpKSB7XG4gICAgICAgICAgICBjb21wS2V5ID0gJ0VDT07Dk01JQ0EnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gdXBkYXRlZExheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gbGF5ZXIuaWQgfHwgbC50aXRsZS50b0xvd2VyQ2FzZSgpID09PSAobGF5ZXIudGl0bGUgfHwgJycpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICBleGlzdGluZy5sYXllciA9IGxheWVyO1xuICAgICAgICAgIGV4aXN0aW5nLnZpc2libGUgPSBsYXllci52aXNpYmxlO1xuICAgICAgICAgIGV4aXN0aW5nLmNvbXBvbmVudEtleSA9IGNvbXBLZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXBkYXRlZExheWVycy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBsYXllci5pZCxcbiAgICAgICAgICAgIHRpdGxlOiBsYXllci50aXRsZSB8fCBsYXllci5pZCxcbiAgICAgICAgICAgIHZpc2libGU6IGxheWVyLnZpc2libGUsXG4gICAgICAgICAgICBjb21wb25lbnRLZXk6IGNvbXBLZXksXG4gICAgICAgICAgICBpY29uVHlwZTogJ2xheWVycycsXG4gICAgICAgICAgICBsYXllcjogbGF5ZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbGF5ZXIud2F0Y2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjb25zdCBoYW5kbGUgPSBsYXllci53YXRjaCgndmlzaWJsZScsIChuZXdWYWw6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgICAgIGxheWVyczogcHJldlN0YXRlLmxheWVycy5tYXAobCA9PiBsLmlkID09PSBsYXllci5pZCA/IHsgLi4ubCwgdmlzaWJsZTogbmV3VmFsIH0gOiBsKVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuaGFuZGxlcy5wdXNoKGhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbWFwTGF5ZXJzLmZvckVhY2goKGxheWVyOiBfX2VzcmkuTGF5ZXIpID0+IHByb2Nlc3NMYXllcihsYXllcikpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxheWVyczogdXBkYXRlZExheWVycyB9KTtcbiAgfTtcblxuICB0b2dnbGVHcm91cCA9IChncm91cEtleTogc3RyaW5nKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgIGV4cGFuZGVkR3JvdXBzOiB7XG4gICAgICAgIC4uLnByZXZTdGF0ZS5leHBhbmRlZEdyb3VwcyxcbiAgICAgICAgW2dyb3VwS2V5XTogIXByZXZTdGF0ZS5leHBhbmRlZEdyb3Vwc1tncm91cEtleV1cbiAgICAgIH1cbiAgICB9KSk7XG4gIH07XG5cbiAgdG9nZ2xlTGF5ZXJWaXNpYmlsaXR5ID0gKGxheWVySWQ6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgIGNvbnN0IG5ld0xheWVycyA9IHByZXZTdGF0ZS5sYXllcnMubWFwKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoaXRlbS5pZCA9PT0gbGF5ZXJJZCkge1xuICAgICAgICAgIGNvbnN0IG5ld1ZpcyA9ICFpdGVtLnZpc2libGU7XG4gICAgICAgICAgaWYgKGl0ZW0ubGF5ZXIpIHtcbiAgICAgICAgICAgIGl0ZW0ubGF5ZXIudmlzaWJsZSA9IG5ld1ZpcztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgLi4uaXRlbSwgdmlzaWJsZTogbmV3VmlzIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7IGxheWVyczogbmV3TGF5ZXJzIH07XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyQ2F0ZWdvcnlJY29uID0gKGljb25OYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcpID0+IHtcbiAgICBzd2l0Y2ggKGljb25OYW1lKSB7XG4gICAgICBjYXNlICdwbGFudCc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDEwYTYgNiAwIDAgMC02LTZIM3YzYTYgNiAwIDAgMCA2IDZoM1wiIC8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDE0YTYgNiAwIDAgMSA2LTZoM3YzYTYgNiAwIDAgMS02IDZoLTNcIiAvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0xMiAyMlYxMFwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgICk7XG4gICAgICBjYXNlICdidWlsZGluZyc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICA8cmVjdCB4PVwiNFwiIHk9XCIyXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjIwXCIgcng9XCIyXCIgLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNOSA2aDJcIiAvPjxwYXRoIGQ9XCJNMTMgNmgyXCIgLz48cGF0aCBkPVwiTTkgMTBoMlwiIC8+PHBhdGggZD1cIk0xMyAxMGgyXCIgLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNOSAxNGgyXCIgLz48cGF0aCBkPVwiTTEzIDE0aDJcIiAvPjxwYXRoIGQ9XCJNOSAxOGg2XCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3VzZXJzJzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MlwiIC8+XG4gICAgICAgICAgICA8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiN1wiIHI9XCI0XCIgLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjIgMjF2LTJhNCA0IDAgMCAwLTMtMy44N1wiIC8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTE2IDMuMTNhNCA0IDAgMCAxIDAgNy43NVwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgICk7XG4gICAgICBjYXNlICdjb2lucyc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICA8ZWxsaXBzZSBjeD1cIjEyXCIgY3k9XCI2XCIgcng9XCI4XCIgcnk9XCIzXCIgLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNNCA2djZjMCAxLjY2IDMuNTggMyA4IDNzOC0xLjM0IDgtM1Y2XCIgLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNNCAxMnY2YzAgMS42NiAzLjU4IDMgOCAzczgtMS4zNCA4LTN2LTZcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlckxheWVySWNvbiA9IChpY29uVHlwZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nKSA9PiB7XG4gICAgc3dpdGNoIChpY29uVHlwZSkge1xuICAgICAgY2FzZSAnd2luZCc6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNOS41OSA0LjU5QTIgMiAwIDEgMSAxMSA4SDJtMTAuNTkgMTEuNDFBMiAyIDAgMSAwIDE0IDE2SDJtMTUuNzMtOC4yN0EyLjUgMi41IDAgMSAxIDE5LjUgMTJIMlwiLz48L3N2Zz47XG4gICAgICBjYXNlICdzb3VuZCc6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMiAxMHY0bTQtN3YxMG00LTEzdjE2bTQtMTF2Nm00LTl2MTJtNC03djJcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnbGVhZic6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMTEgMjBBNyA3IDAgMCAxIDkuOCA2LjFDMTUuNSA1IDE3IDQuNCAxOSAyYzEgMiAyIDQuMTIgMiA5IDAgNS41LTQuNSA5LTEwIDl6XCIvPjxwYXRoIGQ9XCJNMiAyMWMwLTMgMS44NS01LjM2IDUuMDgtNkM5LjUgMTQuNTIgMTIgMTMgMTMgMTJcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnd2F0ZXInOlxuICAgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIj48cGF0aCBkPVwiTTEyIDIuNjlsNS42NiA1LjY2YTggOCAwIDEgMS0xMS4zMSAwelwiLz48L3N2Zz47XG4gICAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIyXCI+PHBhdGggZD1cIk0xMC4yOSAzLjg2TDEuODIgMThhMiAyIDAgMCAwIDEuNzEgM2gxNi45NGEyIDIgMCAwIDAgMS43MS0zTDEzLjcxIDMuODZhMiAyIDAgMCAwLTMuNDIgMHpcIi8+PGxpbmUgeDE9XCIxMlwiIHkxPVwiOVwiIHgyPVwiMTJcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjE3XCIgeDI9XCIxMi4wMVwiIHkyPVwiMTdcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnbGF5ZXJzJzpcbiAgICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIyXCI+PHBvbHlnb24gcG9pbnRzPVwiMTIgMiAyIDcgMTIgMTIgMjIgNyAxMiAyXCIvPjxwb2x5bGluZSBwb2ludHM9XCIyIDE3IDEyIDIyIDIyIDE3XCIvPjxwb2x5bGluZSBwb2ludHM9XCIyIDEyIDEyIDE3IDIyIDEyXCIvPjwvc3ZnPjtcbiAgICAgIGNhc2UgJ2Nhcic6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxyZWN0IHg9XCIzXCIgeT1cIjExXCIgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjdcIiByeD1cIjJcIi8+PHBhdGggZD1cIk01IDExbDItNWgxMGwyIDVcIi8+PGNpcmNsZSBjeD1cIjdcIiBjeT1cIjE4XCIgcj1cIjEuNVwiLz48Y2lyY2xlIGN4PVwiMTdcIiBjeT1cIjE4XCIgcj1cIjEuNVwiLz48L3N2Zz47XG4gICAgICBjYXNlICdiZW5jaCc6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMyAxN2gxOE00IDExaDE2TTQgMTF2Nk0yMCAxMXY2TTUgMTd2NE0xOSAxN3Y0XCIvPjwvc3ZnPjtcbiAgICAgIGNhc2UgJ2RvYyc6XG4gICAgICBjYXNlICdmaWxlY2hhcnQnOlxuICAgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIj48cGF0aCBkPVwiTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAndXNlcic6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MlwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjdcIiByPVwiNFwiLz48L3N2Zz47XG4gICAgICBjYXNlICdoZWFydCc6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMjAuODQgNC42MWE1LjUgNS41IDAgMCAwLTcuNzggMEwxMiA1LjY3bC0xLjA2LTEuMDZhNS41IDUuNSAwIDAgMC03Ljc4IDcuNzhsMS4wNiAxLjA2TDEyIDIxLjIzbDguNzItOC43MiAxLjA2LTEuMDZhNS41IDUuNSAwIDAgMCAwLTcuNzh6XCIvPjwvc3ZnPjtcbiAgICAgIGNhc2UgJ2NhcCc6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJNMjIgMTB2Nk0yIDEwbDEwLTUgMTAgNS0xMCA1elwiLz48cGF0aCBkPVwiTTYgMTJ2NWMzIDMgOSAzIDEyIDB2LTVcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnc2hpZWxkJzpcbiAgICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIyXCI+PHBhdGggZD1cIk0xMiAyMnM4LTQgOC0xMFY1bC04LTMtOCAzdjdjMCA2IDggMTAgOCAxMHpcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnYmFnJzpcbiAgICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIyXCI+PHBhdGggZD1cIk02IDJMMyA2djE0YTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMlY2bC0zLTR6XCIvPjxsaW5lIHgxPVwiM1wiIHkxPVwiNlwiIHgyPVwiMjFcIiB5Mj1cIjZcIi8+PHBhdGggZD1cIk0xNiAxMGE0IDQgMCAwIDEtOCAwXCIvPjwvc3ZnPjtcbiAgICAgIGNhc2UgJ2Nhc2UnOlxuICAgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIj48cmVjdCB4PVwiMlwiIHk9XCI3XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjE0XCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNMTYgMjFWNWEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MTZcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnY2FtZXJhJzpcbiAgICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIyXCI+PHBhdGggZD1cIk0yMyAxOWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNGwyLTNoNmwyIDNoNGEyIDIgMCAwIDEgMiAyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEzXCIgcj1cIjRcIi8+PC9zdmc+O1xuICAgICAgY2FzZSAnY2hhcnQnOlxuICAgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIj48cG9seWxpbmUgcG9pbnRzPVwiMjMgNiAxMy41IDE1LjUgOC41IDEwLjUgMSAxOFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgNiAyMyA2IDIzIDEyXCIvPjwvc3ZnPjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMlwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOFwiLz48L3N2Zz47XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGV4cGFuZGVkR3JvdXBzLCBsYXllcnMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgdGl0bGVQcmVmaXggPSB0aGlzLnByb3BzLmNvbmZpZz8udGl0bGUgfHwgJ0NhcGFzIHBvcic7XG4gICAgY29uc3QgdGl0bGVIaWdobGlnaHQgPSB0aGlzLnByb3BzLmNvbmZpZz8udGl0bGVIaWdobGlnaHQgfHwgJ2NvbXBvbmVudGUnO1xuICAgIGNvbnN0IGhhc01hcCA9IHRoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzICYmIHRoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzLmxlbmd0aCA+IDA7XG4gICAgY29uc3QgbWFwV2lkZ2V0SWQgPSBoYXNNYXAgPyB0aGlzLnByb3BzLnVzZU1hcFdpZGdldElkc1swXSA6IG51bGw7XG5cbiAgICBjb25zdCBzdHlsZSA9IGNzc2BcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMzA3MTI7XG4gICAgICBjb2xvcjogI2Y4ZmFmYztcbiAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIHNhbnMtc2VyaWY7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgcGFkZGluZzogMjBweCAxNnB4O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBnYXA6IDE2cHg7XG5cbiAgICAgIC53aWRnZXQtdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDEuNHJlbTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICAgICAgY29sb3I6ICNmZmZmZmY7XG4gICAgICAgIG1hcmdpbjogMCAwIDZweCAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogLTAuM3B4O1xuXG4gICAgICAgIC5oaWdobGlnaHQge1xuICAgICAgICAgIGNvbG9yOiAjMDZiNmQ0O1xuICAgICAgICAgIG1hcmdpbi1sZWZ0OiA2cHg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLmNhdGVnb3J5LWNvbnRhaW5lciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMTRweDtcbiAgICAgIH1cblxuICAgICAgLmNhdGVnb3J5LWNhcmQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGExMTIwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjMWUyOTNiO1xuICAgICAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4yNXMgZWFzZSwgYm94LXNoYWRvdyAwLjI1cyBlYXNlO1xuXG4gICAgICAgICYuZXhwYW5kZWQge1xuICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDIwcHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLmNhdGVnb3J5LWhlYWRlciB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgIGJhY2tncm91bmQ6ICMwYTExMjA7XG5cbiAgICAgICAgICAuaGVhZGVyLWxlZnQge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBnYXA6IDEycHg7XG5cbiAgICAgICAgICAgIC5jYXRlZ29yeS10aXRsZSB7XG4gICAgICAgICAgICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuOHB4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC5jaGV2cm9uLWljb24ge1xuICAgICAgICAgICAgY29sb3I6ICM2NDc0OGI7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4yNXMgZWFzZTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5jYXRlZ29yeS1ib2R5IHtcbiAgICAgICAgICBwYWRkaW5nOiA0cHggMTJweCAxNHB4IDEycHg7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgIGdhcDogNnB4O1xuICAgICAgICAgIGJhY2tncm91bmQ6ICMwOTBlMWE7XG4gICAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XG5cbiAgICAgICAgICAubGF5ZXItcm93IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgcGFkZGluZzogOXB4IDEycHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjE1cyBlYXNlO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmxheWVyLWxlZnQge1xuICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICBnYXA6IDEycHg7XG5cbiAgICAgICAgICAgICAgLmxheWVyLWxhYmVsIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogI2UyZThmMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjc3M9e3N0eWxlfSBjbGFzc05hbWU9XCJ3aWRnZXQtcGxhbnRpbGxhLWNhcGFzIGppbXUtd2lkZ2V0XCI+XG4gICAgICAgIHttYXBXaWRnZXRJZCAmJiAoXG4gICAgICAgICAgPEppbXVNYXBWaWV3Q29tcG9uZW50XG4gICAgICAgICAgICB1c2VNYXBXaWRnZXRJZD17bWFwV2lkZ2V0SWR9XG4gICAgICAgICAgICBvbkFjdGl2ZVZpZXdDaGFuZ2U9e3RoaXMuYWN0aXZlVmlld0NoYW5nZUhhbmRsZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogSGVhZGVyIFRpdGxlICovfVxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwid2lkZ2V0LXRpdGxlXCI+XG4gICAgICAgICAge3RpdGxlUHJlZml4fVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZ2hsaWdodFwiPnt0aXRsZUhpZ2hsaWdodH08L3NwYW4+XG4gICAgICAgIDwvaDI+XG5cbiAgICAgICAgey8qIENhdGVnb3JpZXMgQWNjb3JkaW9ucyAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1jb250YWluZXJcIj5cbiAgICAgICAgICB7Q0FURUdPUklFUy5tYXAoY2F0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSAhIWV4cGFuZGVkR3JvdXBzW2NhdC5rZXldO1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBMYXllcnMgPSBsYXllcnMuZmlsdGVyKGwgPT4gbC5jb21wb25lbnRLZXkgPT09IGNhdC5rZXkpO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAga2V5PXtjYXQua2V5fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNhdGVnb3J5LWNhcmQgJHtpc0V4cGFuZGVkID8gJ2V4cGFuZGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBpc0V4cGFuZGVkID8gY2F0LmNvbG9yIDogJyMxZTI5M2InXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMudG9nZ2xlR3JvdXAoY2F0LmtleSl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXItbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJDYXRlZ29yeUljb24oY2F0Lmljb24sIGNhdC5jb2xvcil9XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNhdGVnb3J5LXRpdGxlXCIgc3R5bGU9e3sgY29sb3I6IGNhdC5jb2xvciB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7Y2F0LnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hldnJvbi1pY29uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxNlwiXG4gICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyLjVcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogaXNFeHBhbmRlZCA/ICdyb3RhdGUoMTgwZGVnKScgOiAncm90YXRlKDBkZWcpJ1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiNiA5IDEyIDE1IDE4IDlcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFN1Yi1sYXllcnMgTGlzdCAqL31cbiAgICAgICAgICAgICAgICB7aXNFeHBhbmRlZCAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAge2dyb3VwTGF5ZXJzLm1hcChpdGVtID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPVwibGF5ZXItcm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyTGF5ZXJJY29uKGl0ZW0uaWNvblR5cGUgfHwgJ2xheWVycycsIGNhdC5jb2xvcil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImxheWVyLWxhYmVsXCI+e2l0ZW0udGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2l0ZW0udmlzaWJsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHRoaXMudG9nZ2xlTGF5ZXJWaXNpYmlsaXR5KGl0ZW0uaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==