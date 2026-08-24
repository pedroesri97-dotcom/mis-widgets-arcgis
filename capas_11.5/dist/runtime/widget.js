System.register(["jimu-core/emotion","jimu-core","jimu-arcgis","jimu-ui"],function(e,t){var s={},i={},a={},r={};return{setters:[function(e){s.jsx=e.jsx,s.jsxs=e.jsxs},function(e){i.React=e.React,i.css=e.css},function(e){a.JimuMapViewComponent=e.JimuMapViewComponent},function(e){r.Switch=e.Switch}],execute:function(){e((()=>{var e={686(e){"use strict";e.exports=a},244(e){"use strict";e.exports=i},386(e){"use strict";e.exports=s},321(e){"use strict";e.exports=r}},t={};function o(s){var i=t[s];if(void 0!==i)return i.exports;var a=t[s]={exports:{}};return e[s](a,a.exports,o),a.exports}o.d=(e,t)=>{for(var s in t)o.o(t,s)&&!o.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.p="";var n={};return o.p=window.jimuConfig.baseUrl,(()=>{"use strict";o.r(n),o.d(n,{__set_webpack_public_path__:()=>x,default:()=>g});var e=o(386),t=o(244),s=o(686),i=o(321);const a="Panel operativo",r="Capas y estado de la escena",l="VISIBILIDAD",c="Capas Visibles",d="Total Capas",p="Por favor, seleccione un widget de Mapa en la configuraci\xf3n del widget.",m="No se encontraron capas en el mapa.",h="Cargando capas...",f="LIVE",u="GPS: Activo";class g extends t.React.PureComponent{constructor(){super(...arguments),this.timer=null,this.handles=[],this.state={jmv:null,layers:[],mapViewReady:!1,currentTime:(new Date).toLocaleTimeString()},this.clearWatchers=()=>{this.handles.forEach(e=>{e&&"function"==typeof e.remove&&e.remove()}),this.handles=[]},this.activeViewChangeHandler=e=>{e&&(this.setState({jmv:e,mapViewReady:!0}),this.loadLayers(e),e.view&&e.view.map&&e.view.map.layers&&e.view.map.layers.on("change",()=>{this.loadLayers(e)}))},this.loadLayers=e=>{if(!e||!e.view||!e.view.map)return;this.clearWatchers();const t=e.view.map.layers,s=[];t.forEach(e=>{const t={id:e.id,title:e.title||e.id,visible:e.visible,type:e.type,layer:e};if(s.push(t),"function"==typeof e.watch){const t=e.watch("visible",t=>{this.setState(s=>({layers:s.layers.map(s=>s.id===e.id?Object.assign(Object.assign({},s),{visible:t}):s)}))});this.handles.push(t)}}),this.setState({layers:s.reverse()})},this.toggleLayerVisibility=e=>{const t=this.state.layers.find(t=>t.id===e);if(t&&t.layer){const s=!t.layer.visible;t.layer.visible=s,this.setState(t=>({layers:t.layers.map(t=>t.id===e?Object.assign(Object.assign({},t),{visible:s}):t)}))}},this.getIndicatorColor=(e,t)=>{if(!t)return"#475569";const s=["#10b981","#3b82f6","#3b82f6","#f59e0b","#475569","#475569","#475569","#475569","#3b82f6","#06b6d4"];return s[e%s.length]}}componentDidMount(){this.timer=setInterval(()=>{this.setState({currentTime:(new Date).toLocaleTimeString()})},1e3)}componentWillUnmount(){this.timer&&clearInterval(this.timer),this.clearWatchers()}render(){var o,n,g;const{layers:x,mapViewReady:b,currentTime:v}=this.state,y=x.filter(e=>e.visible).length,w=x.length,j=(null===(o=this.props.config)||void 0===o?void 0:o.title)||a,N=(null===(n=this.props.config)||void 0===n?void 0:n.subtitle)||r,S=t.css`
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
    `,C=this.props.useMapWidgetIds&&this.props.useMapWidgetIds.length>0,k=(new Date).toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"});return(0,e.jsxs)("div",{css:S,className:"widget-capas jimu-widget",children:[C&&(0,e.jsx)(s.JimuMapViewComponent,{useMapWidgetId:null===(g=this.props.useMapWidgetIds)||void 0===g?void 0:g[0],onActiveViewChange:this.activeViewChangeHandler}),(0,e.jsxs)("div",{className:"header-panel",children:[(0,e.jsxs)("div",{className:"title-group",children:[(0,e.jsx)("h3",{className:"main-title",children:j}),(0,e.jsx)("p",{className:"sub-title",children:N})]}),(0,e.jsxs)("div",{className:"live-badge",children:[(0,e.jsx)("span",{className:"pulse-dot"})," ",f]})]}),(0,e.jsxs)("div",{className:"info-box",children:[(0,e.jsxs)("div",{className:"time-info",children:[(0,e.jsx)("span",{className:"date-str",children:k}),(0,e.jsx)("span",{className:"time-str",children:v})]}),(0,e.jsx)("div",{className:"status-str",children:u})]}),(0,e.jsxs)("div",{className:"stats-grid",children:[(0,e.jsxs)("div",{className:"stat-card",children:[(0,e.jsx)("div",{className:"stat-value",children:y}),(0,e.jsx)("div",{className:"stat-label",children:c})]}),(0,e.jsxs)("div",{className:"stat-card",children:[(0,e.jsx)("div",{className:"stat-value",children:w}),(0,e.jsx)("div",{className:"stat-label",children:d})]})]}),(0,e.jsx)("div",{className:"section-header",children:l}),C?0===x.length?(0,e.jsx)("div",{className:"msg-container",children:b?m:h}):(0,e.jsx)("div",{className:"layer-list",children:x.map((t,s)=>(0,e.jsxs)("div",{className:"layer-item",children:[(0,e.jsxs)("div",{className:"layer-info",children:[(0,e.jsx)("span",{className:"color-dot",style:{backgroundColor:this.getIndicatorColor(s,t.visible)}}),(0,e.jsx)("span",{className:"layer-title",title:t.title,children:t.title})]}),(0,e.jsx)(i.Switch,{checked:t.visible,onChange:()=>this.toggleLayerVisibility(t.id)})]},t.id))}):(0,e.jsx)("div",{className:"msg-container",children:p})]})}}function x(e){o.p=e}})(),n})())}}});