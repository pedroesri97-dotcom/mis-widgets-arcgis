System.register(["jimu-core/emotion","jimu-core","jimu-ui/advanced/setting-components","jimu-ui"],function(e,t){var i={},s={},n={},o={};return{setters:[function(e){i.jsx=e.jsx,i.jsxs=e.jsxs},function(e){s.React=e.React,s.css=e.css},function(e){n.MapWidgetSelector=e.MapWidgetSelector,n.SettingRow=e.SettingRow,n.SettingSection=e.SettingSection},function(e){o.TextInput=e.TextInput}],execute:function(){e((()=>{var e={244(e){"use strict";e.exports=s},386(e){"use strict";e.exports=i},321(e){"use strict";e.exports=o},298(e){"use strict";e.exports=n}},t={};function r(i){var s=t[i];if(void 0!==s)return s.exports;var n=t[i]={exports:{}};return e[i](n,n.exports,r),n.exports}r.d=(e,t)=>{for(var i in t)r.o(t,i)&&!r.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var a={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(a),r.d(a,{__set_webpack_public_path__:()=>o,default:()=>n});var e=r(386),t=r(244),i=r(298),s=r(321);class n extends t.React.PureComponent{constructor(){super(...arguments),this.onMapWidgetSelected=e=>{this.props.onSettingChange({id:this.props.id,useMapWidgetIds:e})},this.onTitleChange=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("title",e.target.value)})},this.onSubtitleChange=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("subtitle",e.target.value)})}}render(){var n,o;const r=t.css`
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
    `;return(0,e.jsxs)("div",{css:r,className:"widget-setting-capas",children:[(0,e.jsx)(i.SettingSection,{title:this.props.intl.formatMessage({id:"selectMapWidget",defaultMessage:"Seleccionar mapa"}),children:(0,e.jsx)(i.SettingRow,{children:(0,e.jsx)(i.MapWidgetSelector,{onSelect:this.onMapWidgetSelected,useMapWidgetIds:this.props.useMapWidgetIds})})}),(0,e.jsxs)(i.SettingSection,{title:this.props.intl.formatMessage({id:"settings",defaultMessage:"Configuraci\xf3n"}),children:[(0,e.jsx)(i.SettingRow,{children:(0,e.jsxs)("div",{className:"setting-row-item",children:[(0,e.jsx)("label",{children:"T\xedtulo del panel"}),(0,e.jsx)(s.TextInput,{value:(null===(n=this.props.config)||void 0===n?void 0:n.title)||"Panel operativo",onChange:this.onTitleChange,size:"sm"})]})}),(0,e.jsx)(i.SettingRow,{children:(0,e.jsxs)("div",{className:"setting-row-item",children:[(0,e.jsx)("label",{children:"Subt\xedtulo del panel"}),(0,e.jsx)(s.TextInput,{value:(null===(o=this.props.config)||void 0===o?void 0:o.subtitle)||"Capas y estado de la escena",onChange:this.onSubtitleChange,size:"sm"})]})})]})]})}}function o(e){r.p=e}})(),a})())}}});