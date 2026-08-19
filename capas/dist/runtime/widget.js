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

/***/ "./your-extensions/widgets/capas/src/runtime/translations/default.ts":
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
const __WEBPACK_DEFAULT_EXPORT__ = ({
  _widgetLabel: 'Capas',
  panelTitle: 'Panel operativo',
  panelSubtitle: 'Capas y estado de la escena',
  visibilityHeader: 'VISIBILIDAD',
  activeLayers: 'Capas Visibles',
  totalLayers: 'Total Capas',
  selectMapWarning: 'Por favor, seleccione un widget de Mapa en la configuración del widget.',
  noLayersFound: 'No se encontraron capas en el mapa.',
  loadingLayers: 'Cargando capas...',
  liveBadge: 'LIVE',
  gpsActive: 'GPS: Activo'
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
var defaultMessages = __webpack_require__("./your-extensions/widgets/capas/src/runtime/translations/default.ts");

class Widget extends jimu_core.React.PureComponent {
  constructor() {
    super(...arguments);
    this.timer = null;
    this.handles = [];
    this.state = {
      jmv: null,
      layers: [],
      mapViewReady: false,
      currentTime: new Date().toLocaleTimeString()
    };
    this.clearWatchers = () => {
      this.handles.forEach(h => {
        if (h && typeof h.remove === 'function') h.remove();
      });
      this.handles = [];
    };
    this.activeViewChangeHandler = (jmv) => {
      if (jmv) {
        this.setState({ jmv: jmv, mapViewReady: true });
        this.loadLayers(jmv);
        if (jmv.view && jmv.view.map && jmv.view.map.layers) {
          jmv.view.map.layers.on('change', () => {
            this.loadLayers(jmv);
          });
        }
      }
    };
    this.loadLayers = (jmv) => {
      if (!jmv || !jmv.view || !jmv.view.map) return;
      this.clearWatchers();
      const mapLayers = jmv.view.map.layers;
      const layerItems = [];
      mapLayers.forEach(layer => {
        layerItems.push({
          id: layer.id,
          title: layer.title || layer.id,
          visible: layer.visible,
          type: layer.type,
          layer: layer
        });
        if (typeof layer.watch === 'function') {
          const handle = layer.watch('visible', (newVal) => {
            this.setState(prevState => ({
              layers: prevState.layers.map(l => l.id === layer.id ? Object.assign({}, l, { visible: newVal }) : l)
            }));
          });
          this.handles.push(handle);
        }
      });
      this.setState({ layers: layerItems.reverse() });
    };
    this.toggleLayerVisibility = (layerId) => {
      const target = this.state.layers.find(l => l.id === layerId);
      if (target && target.layer) {
        const newVis = !target.layer.visible;
        target.layer.visible = newVis;
        this.setState(prevState => ({
          layers: prevState.layers.map(item => item.id === layerId ? Object.assign({}, item, { visible: newVis }) : item)
        }));
      }
    };
    this.getIndicatorColor = (index, visible) => {
      if (!visible) return '#475569';
      const palette = ['#10b981', '#3b82f6', '#3b82f6', '#f59e0b', '#475569', '#475569', '#475569', '#475569', '#3b82f6', '#06b6d4'];
      return palette[index % palette.length];
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ currentTime: new Date().toLocaleTimeString() });
    }, 1000);
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
    this.clearWatchers();
  }
  render() {
    var _a, _b, _c;
    const { layers, mapViewReady, currentTime } = this.state;
    const activeLayersCount = layers.filter(l => l.visible).length;
    const totalLayersCount = layers.length;
    const title = ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.title) || defaultMessages.default.panelTitle;
    const subtitle = ((_b = this.props.config) === null || _b === void 0 ? void 0 : _b.subtitle) || defaultMessages.default.panelSubtitle;

    const style = jimu_core.css`
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

    return (_emotion_jsx.jsxs)("div", {
      css: style,
      className: "widget-capas jimu-widget",
      children: [
        hasMap && (_emotion_jsx.jsx)(jimu_arcgis.JimuMapViewComponent, {
          useMapWidgetId: (_c = this.props.useMapWidgetIds) === null || _c === void 0 ? void 0 : _c[0],
          onActiveViewChange: this.activeViewChangeHandler
        }),
        (_emotion_jsx.jsxs)("div", {
          className: "header-panel",
          children: [
            (_emotion_jsx.jsxs)("div", {
              className: "title-group",
              children: [
                (_emotion_jsx.jsx)("h3", { className: "main-title", children: title }),
                (_emotion_jsx.jsx)("p", { className: "sub-title", children: subtitle })
              ]
            }),
            (_emotion_jsx.jsxs)("div", {
              className: "live-badge",
              children: [
                (_emotion_jsx.jsx)("span", { className: "pulse-dot" }),
                " ",
                defaultMessages.default.liveBadge
              ]
            })
          ]
        }),
        (_emotion_jsx.jsxs)("div", {
          className: "info-box",
          children: [
            (_emotion_jsx.jsxs)("div", {
              className: "time-info",
              children: [
                (_emotion_jsx.jsx)("span", { className: "date-str", children: dateFormatted }),
                (_emotion_jsx.jsx)("span", { className: "time-str", children: currentTime })
              ]
            }),
            (_emotion_jsx.jsx)("div", { className: "status-str", children: defaultMessages.default.gpsActive })
          ]
        }),
        (_emotion_jsx.jsxs)("div", {
          className: "stats-grid",
          children: [
            (_emotion_jsx.jsxs)("div", {
              className: "stat-card",
              children: [
                (_emotion_jsx.jsx)("div", { className: "stat-value", children: activeLayersCount }),
                (_emotion_jsx.jsx)("div", { className: "stat-label", children: defaultMessages.default.activeLayers })
              ]
            }),
            (_emotion_jsx.jsxs)("div", {
              className: "stat-card",
              children: [
                (_emotion_jsx.jsx)("div", { className: "stat-value", children: totalLayersCount }),
                (_emotion_jsx.jsx)("div", { className: "stat-label", children: defaultMessages.default.totalLayers })
              ]
            })
          ]
        }),
        (_emotion_jsx.jsx)("div", { className: "section-header", children: defaultMessages.default.visibilityHeader }),
        !hasMap ? (
          (_emotion_jsx.jsx)("div", { className: "msg-container", children: defaultMessages.default.selectMapWarning })
        ) : layers.length === 0 ? (
          (_emotion_jsx.jsx)("div", { className: "msg-container", children: mapViewReady ? defaultMessages.default.noLayersFound : defaultMessages.default.loadingLayers })
        ) : (
          (_emotion_jsx.jsx)("div", {
            className: "layer-list",
            children: layers.map((layerItem, idx) => (
              (_emotion_jsx.jsxs)("div", {
                className: "layer-item",
                children: [
                  (_emotion_jsx.jsxs)("div", {
                    className: "layer-info",
                    children: [
                      (_emotion_jsx.jsx)("span", {
                        className: "color-dot",
                        style: { backgroundColor: this.getIndicatorColor(idx, layerItem.visible) }
                      }),
                      (_emotion_jsx.jsx)("span", { className: "layer-title", title: layerItem.title, children: layerItem.title })
                    ]
                  }),
                  (_emotion_jsx.jsx)(jimu_ui.Switch, {
                    checked: layerItem.visible,
                    onChange: () => this.toggleLayerVisibility(layerItem.id)
                  })
                ]
              }, layerItem.id)
            ))
          })
        )
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
