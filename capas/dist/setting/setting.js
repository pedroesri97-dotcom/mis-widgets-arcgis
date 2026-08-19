System.register(["jimu-core/emotion","jimu-core","jimu-ui/advanced/setting-components","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__, "__esModule", { value: true });
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
				__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__[key] = module[key];
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

/***/ "./your-extensions/widgets/capas/src/setting/translations/default.ts":
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
const __WEBPACK_DEFAULT_EXPORT__ = ({
  selectMapWidget: 'Seleccionar widget de Mapa',
  settings: 'Configuración',
  titleLabel: 'Título del Panel',
  subtitleLabel: 'Subtítulo del Panel'
});
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

/***/ "jimu-ui/advanced/setting-components":
(module) => {
"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__;
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
  "default": () => (Setting)
});
var _emotion_jsx = __webpack_require__("@emotion/react/jsx-runtime");
var jimu_core = __webpack_require__("jimu-core");
var setting_components = __webpack_require__("jimu-ui/advanced/setting-components");
var jimu_ui = __webpack_require__("jimu-ui");
var defaultI18nMessages = __webpack_require__("./your-extensions/widgets/capas/src/setting/translations/default.ts");

class Setting extends jimu_core.React.PureComponent {
  constructor() {
    super(...arguments);
    this.onMapWidgetSelected = (useMapWidgetIds) => {
      this.props.onSettingChange({
        id: this.props.id,
        useMapWidgetIds: useMapWidgetIds
      });
    };
    this.onTitleChange = (evt) => {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('title', evt.target.value)
      });
    };
    this.onSubtitleChange = (evt) => {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('subtitle', evt.target.value)
      });
    };
  }
  render() {
    var _a, _b;
    const style = jimu_core.css`
      .widget-setting-capas {
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

    return (_emotion_jsx.jsx)("div", {
      css: style,
      className: "widget-setting-capas",
      children: (_emotion_jsx.jsxs)("div", {
        children: [
          (_emotion_jsx.jsx)(setting_components.SettingSection, {
            title: this.props.intl.formatMessage({
              id: 'selectMapWidget',
              defaultMessage: defaultI18nMessages.default.selectMapWidget
            }),
            children: (_emotion_jsx.jsx)(setting_components.SettingRow, {
              children: (_emotion_jsx.jsx)(setting_components.MapWidgetSelector, {
                onSelect: this.onMapWidgetSelected,
                useMapWidgetIds: this.props.useMapWidgetIds
              })
            })
          }),
          (_emotion_jsx.jsxs)(setting_components.SettingSection, {
            title: this.props.intl.formatMessage({
              id: 'settings',
              defaultMessage: defaultI18nMessages.default.settings
            }),
            children: [
              (_emotion_jsx.jsx)(setting_components.SettingRow, {
                children: (_emotion_jsx.jsxs)("div", {
                  className: "setting-row-item",
                  children: [
                    (_emotion_jsx.jsx)("label", { children: defaultI18nMessages.default.titleLabel }),
                    (_emotion_jsx.jsx)(jimu_ui.TextInput, {
                      value: ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.title) || 'Panel operativo',
                      onChange: this.onTitleChange,
                      size: "sm"
                    })
                  ]
                })
              }),
              (_emotion_jsx.jsx)(setting_components.SettingRow, {
                children: (_emotion_jsx.jsxs)("div", {
                  className: "setting-row-item",
                  children: [
                    (_emotion_jsx.jsx)("label", { children: defaultI18nMessages.default.subtitleLabel }),
                    (_emotion_jsx.jsx)(jimu_ui.TextInput, {
                      value: ((_b = this.props.config) === null || _b === void 0 ? void 0 : _b.subtitle) || 'Capas y estado de la escena',
                      onChange: this.onSubtitleChange,
                      size: "sm"
                    })
                  ]
                })
              })
            ]
          })
        ]
      })
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
