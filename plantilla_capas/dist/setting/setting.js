System.register(["jimu-core","jimu-ui/advanced/setting-components","jimu-ui"],(function(t,e){var i={},s={},n={};return{setters:[function(t){i.React=t.React,i.css=t.css,i.jsx=t.jsx},function(t){s.MapWidgetSelector=t.MapWidgetSelector,s.SettingRow=t.SettingRow,s.SettingSection=t.SettingSection},function(t){n.TextInput=t.TextInput}],execute:function(){t((()=>{var t={244:t=>{"use strict";t.exports=i},321:t=>{"use strict";t.exports=n},298:t=>{"use strict";t.exports=s}},e={};function o(i){var s=e[i];if(void 0!==s)return s.exports;var n=e[i]={exports:{}};return t[i](n,n.exports,o),n.exports}o.d=(t,e)=>{for(var i in e)o.o(e,i)&&!o.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.p="";var a={};return o.p=window.jimuConfig.baseUrl,(()=>{"use strict";o.r(a),o.d(a,{__set_webpack_public_path__:()=>g,default:()=>p});var t=o(244),e=o(298),i=o(321);const s="Seleccionar widget de Mapa",n="Configuraci\xf3n",r="T\xedtulo principal",l="Texto resaltado (Cyan)";class p extends t.React.PureComponent{constructor(){super(...arguments),this.onMapWidgetSelected=t=>{this.props.onSettingChange({id:this.props.id,useMapWidgetIds:t})},this.onTitleChange=t=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("title",t.target.value)})},this.onTitleHighlightChange=t=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("titleHighlight",t.target.value)})}}render(){var o,a;const p=t.css`
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
    `;return(0,t.jsx)("div",{css:p,className:"widget-setting-plantilla-capas"},(0,t.jsx)(e.SettingSection,{title:this.props.intl.formatMessage({id:"selectMapWidget",defaultMessage:s})},(0,t.jsx)(e.SettingRow,null,(0,t.jsx)(e.MapWidgetSelector,{onSelect:this.onMapWidgetSelected,useMapWidgetIds:this.props.useMapWidgetIds}))),(0,t.jsx)(e.SettingSection,{title:this.props.intl.formatMessage({id:"settings",defaultMessage:n})},(0,t.jsx)(e.SettingRow,null,(0,t.jsx)("div",{className:"setting-row-item"},(0,t.jsx)("label",null,r),(0,t.jsx)(i.TextInput,{value:(null===(o=this.props.config)||void 0===o?void 0:o.title)||"Capas por",onChange:this.onTitleChange,size:"sm"}))),(0,t.jsx)(e.SettingRow,null,(0,t.jsx)("div",{className:"setting-row-item"},(0,t.jsx)("label",null,l),(0,t.jsx)(i.TextInput,{value:(null===(a=this.props.config)||void 0===a?void 0:a.titleHighlight)||"componente",onChange:this.onTitleHighlightChange,size:"sm"})))))}}function g(t){o.p=t}})(),a})())}}}));