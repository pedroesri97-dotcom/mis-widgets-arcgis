System.register(["jimu-core","jimu-arcgis","jimu-ui"],(function(e,i){var t={},s={},o={};return{setters:[function(e){t.React=e.React,t.css=e.css,t.jsx=e.jsx},function(e){s.JimuMapViewComponent=e.JimuMapViewComponent},function(e){o.Switch=e.Switch}],execute:function(){e((()=>{var e={686:e=>{"use strict";e.exports=s},244:e=>{"use strict";e.exports=t},321:e=>{"use strict";e.exports=o}},i={};function n(t){var s=i[t];if(void 0!==s)return s.exports;var o=i[t]={exports:{}};return e[t](o,o.exports,n),o.exports}n.d=(e,i)=>{for(var t in i)n.o(i,t)&&!n.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:i[t]})},n.o=(e,i)=>Object.prototype.hasOwnProperty.call(e,i),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="";var r={};return n.p=window.jimuConfig.baseUrl,(()=>{"use strict";n.r(r),n.d(r,{__set_webpack_public_path__:()=>l,default:()=>a});var e=n(244),i=n(686),t=n(321);const s=[{key:"AMBIENTAL",title:"AMBIENTAL",color:"#10b981",icon:"plant"},{key:"URBAN\xcdSTICA",title:"URBAN\xcdSTICA",color:"#06b6d4",icon:"building"},{key:"SOCIAL",title:"SOCIAL",color:"#a855f7",icon:"users"},{key:"ECON\xd3MICA",title:"ECON\xd3MICA",color:"#0ea5e9",icon:"coins"}],o=[{id:"env_air",title:"Calidad del aire",visible:!0,componentKey:"AMBIENTAL",iconType:"wind"},{id:"env_noise",title:"\xcdndices de ruido",visible:!0,componentKey:"AMBIENTAL",iconType:"sound"},{id:"env_veg",title:"Cobertura vegetal",visible:!0,componentKey:"AMBIENTAL",iconType:"leaf"},{id:"env_water",title:"Cuerpos de agua",visible:!0,componentKey:"AMBIENTAL",iconType:"water"},{id:"env_risk",title:"Zonas de riesgo",visible:!0,componentKey:"AMBIENTAL",iconType:"warning"},{id:"urb_land",title:"Uso del suelo",visible:!1,componentKey:"URBAN\xcdSTICA",iconType:"layers"},{id:"urb_equip",title:"Equipamientos",visible:!1,componentKey:"URBAN\xcdSTICA",iconType:"building"},{id:"urb_mob",title:"Movilidad vial",visible:!1,componentKey:"URBAN\xcdSTICA",iconType:"car"},{id:"urb_space",title:"Espacio p\xfablico",visible:!1,componentKey:"URBAN\xcdSTICA",iconType:"bench"},{id:"urb_lic",title:"Licencias urbanas",visible:!1,componentKey:"URBAN\xcdSTICA",iconType:"doc"},{id:"soc_pop",title:"Poblaci\xf3n",visible:!1,componentKey:"SOCIAL",iconType:"user"},{id:"soc_health",title:"Salud",visible:!1,componentKey:"SOCIAL",iconType:"heart"},{id:"soc_edu",title:"Educaci\xf3n",visible:!1,componentKey:"SOCIAL",iconType:"cap"},{id:"soc_sec",title:"Seguridad",visible:!1,componentKey:"SOCIAL",iconType:"shield"},{id:"soc_part",title:"Participaci\xf3n ciudadana",visible:!1,componentKey:"SOCIAL",iconType:"users"},{id:"eco_com",title:"Actividad comercial",visible:!1,componentKey:"ECON\xd3MICA",iconType:"bag"},{id:"eco_emp",title:"Empleo",visible:!1,componentKey:"ECON\xd3MICA",iconType:"case"},{id:"eco_tour",title:"Turismo",visible:!1,componentKey:"ECON\xd3MICA",iconType:"camera"},{id:"eco_inv",title:"Inversi\xf3n",visible:!1,componentKey:"ECON\xd3MICA",iconType:"chart"},{id:"eco_cad",title:"Catastro econ\xf3mico",visible:!1,componentKey:"ECON\xd3MICA",iconType:"filechart"}];class a extends e.React.PureComponent{constructor(){super(...arguments),this.handles=[],this.state={jmv:null,expandedGroups:{AMBIENTAL:!0,URBAN\u00cdSTICA:!1,SOCIAL:!1,ECON\u00d3MICA:!1},layers:o,mapConnected:!1},this.clearWatchers=()=>{this.handles.forEach((e=>{e&&"function"==typeof e.remove&&e.remove()})),this.handles=[]},this.activeViewChangeHandler=e=>{e&&(this.setState({jmv:e,mapConnected:!0}),this.syncMapLayers(e),e.view&&e.view.map&&e.view.map.layers&&e.view.map.layers.on("change",(()=>{this.syncMapLayers(e)})))},this.syncMapLayers=e=>{if(!e||!e.view||!e.view.map)return;this.clearWatchers();const i=e.view.map.layers,t=[...this.state.layers],s=(e,i)=>{if("group"===e.type){const t=(e.title||"").toLowerCase();let o=i;o||(t.includes("ambien")||t.includes("agua")||t.includes("ruido")||t.includes("riesgo")||t.includes("arbol")?o="AMBIENTAL":t.includes("socia")||t.includes("salud")||t.includes("pobl")||t.includes("edu")?o="SOCIAL":t.includes("econ")||t.includes("comer")||t.includes("inver")?o="ECON\xd3MICA":(t.includes("urban")||t.includes("suelo")||t.includes("vial")||t.includes("licencia"))&&(o="URBAN\xcdSTICA"));const n=e.layers;n&&"function"==typeof n.forEach&&n.forEach((e=>s(e,o)))}else{const s=(e.title||e.id).toLowerCase();let o=i||"URBAN\xcdSTICA";i||(s.includes("ambien")||s.includes("agua")||s.includes("ruido")||s.includes("riesgo")||s.includes("arbol")?o="AMBIENTAL":s.includes("socia")||s.includes("salud")||s.includes("pobl")||s.includes("edu")?o="SOCIAL":(s.includes("econ")||s.includes("comer")||s.includes("inver"))&&(o="ECON\xd3MICA"));const n=t.find((i=>i.id===e.id||i.title.toLowerCase()===(e.title||"").toLowerCase()));if(n?(n.layer=e,n.visible=e.visible,n.componentKey=o):t.push({id:e.id,title:e.title||e.id,visible:e.visible,componentKey:o,iconType:"layers",layer:e}),"function"==typeof e.watch){const i=e.watch("visible",(i=>{this.setState((t=>({layers:t.layers.map((t=>t.id===e.id?Object.assign(Object.assign({},t),{visible:i}):t))})))}));this.handles.push(i)}}};i.forEach((e=>s(e))),this.setState({layers:t})},this.toggleGroup=e=>{this.setState((i=>({expandedGroups:Object.assign(Object.assign({},i.expandedGroups),{[e]:!i.expandedGroups[e]})})))},this.toggleLayerVisibility=e=>{this.setState((i=>({layers:i.layers.map((i=>{if(i.id===e){const e=!i.visible;return i.layer&&(i.layer.visible=e),Object.assign(Object.assign({},i),{visible:e})}return i}))})))},this.renderCategoryIcon=(i,t)=>{switch(i){case"plant":return(0,e.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},(0,e.jsx)("path",{d:"M12 10a6 6 0 0 0-6-6H3v3a6 6 0 0 0 6 6h3"}),(0,e.jsx)("path",{d:"M12 14a6 6 0 0 1 6-6h3v3a6 6 0 0 1-6 6h-3"}),(0,e.jsx)("path",{d:"M12 22V10"}));case"building":return(0,e.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},(0,e.jsx)("rect",{x:"4",y:"2",width:"16",height:"20",rx:"2"}),(0,e.jsx)("path",{d:"M9 6h2"}),(0,e.jsx)("path",{d:"M13 6h2"}),(0,e.jsx)("path",{d:"M9 10h2"}),(0,e.jsx)("path",{d:"M13 10h2"}),(0,e.jsx)("path",{d:"M9 14h2"}),(0,e.jsx)("path",{d:"M13 14h2"}),(0,e.jsx)("path",{d:"M9 18h6"}));case"users":return(0,e.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},(0,e.jsx)("path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}),(0,e.jsx)("circle",{cx:"9",cy:"7",r:"4"}),(0,e.jsx)("path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}),(0,e.jsx)("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"}));case"coins":return(0,e.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},(0,e.jsx)("ellipse",{cx:"12",cy:"6",rx:"8",ry:"3"}),(0,e.jsx)("path",{d:"M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"}),(0,e.jsx)("path",{d:"M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"}));default:return null}},this.renderLayerIcon=(i,t)=>{switch(i){case"wind":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"}));case"sound":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M2 10v4m4-7v10m4-13v16m4-11v6m4-9v12m4-7v2"}));case"leaf":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.12 2 9 0 5.5-4.5 9-10 9z"}),(0,e.jsx)("path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"}));case"water":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"}));case"warning":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),(0,e.jsx)("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),(0,e.jsx)("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"}));case"layers":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),(0,e.jsx)("polyline",{points:"2 17 12 22 22 17"}),(0,e.jsx)("polyline",{points:"2 12 12 17 22 12"}));case"car":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("rect",{x:"3",y:"11",width:"18",height:"7",rx:"2"}),(0,e.jsx)("path",{d:"M5 11l2-5h10l2 5"}),(0,e.jsx)("circle",{cx:"7",cy:"18",r:"1.5"}),(0,e.jsx)("circle",{cx:"17",cy:"18",r:"1.5"}));case"bench":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M3 17h18M4 11h16M4 11v6M20 11v6M5 17v4M19 17v4"}));case"doc":case"filechart":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),(0,e.jsx)("polyline",{points:"14 2 14 8 20 8"}));case"user":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),(0,e.jsx)("circle",{cx:"12",cy:"7",r:"4"}));case"heart":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"}));case"cap":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M22 10v6M2 10l10-5 10 5-10 5z"}),(0,e.jsx)("path",{d:"M6 12v5c3 3 9 3 12 0v-5"}));case"shield":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"}));case"bag":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"}),(0,e.jsx)("line",{x1:"3",y1:"6",x2:"21",y2:"6"}),(0,e.jsx)("path",{d:"M16 10a4 4 0 0 1-8 0"}));case"case":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2"}),(0,e.jsx)("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}));case"camera":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("path",{d:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"}),(0,e.jsx)("circle",{cx:"12",cy:"13",r:"4"}));case"chart":return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("polyline",{points:"23 6 13.5 15.5 8.5 10.5 1 18"}),(0,e.jsx)("polyline",{points:"17 6 23 6 23 12"}));default:return(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2"},(0,e.jsx)("circle",{cx:"12",cy:"12",r:"8"}))}}}componentWillUnmount(){this.clearWatchers()}render(){var o,n;const{expandedGroups:r,layers:a}=this.state,l=(null===(o=this.props.config)||void 0===o?void 0:o.title)||"Capas por",c=(null===(n=this.props.config)||void 0===n?void 0:n.titleHighlight)||"componente",d=this.props.useMapWidgetIds&&this.props.useMapWidgetIds.length>0?this.props.useMapWidgetIds[0]:null,h=e.css`
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
    `;return(0,e.jsx)("div",{css:h,className:"widget-plantilla-capas jimu-widget"},d&&(0,e.jsx)(i.JimuMapViewComponent,{useMapWidgetId:d,onActiveViewChange:this.activeViewChangeHandler}),(0,e.jsx)("h2",{className:"widget-title"},l,(0,e.jsx)("span",{className:"highlight"},c)),(0,e.jsx)("div",{className:"category-container"},s.map((i=>{const s=!!r[i.key],o=a.filter((e=>e.componentKey===i.key));return(0,e.jsx)("div",{key:i.key,className:"category-card "+(s?"expanded":""),style:{borderColor:s?i.color:"#1e293b"}},(0,e.jsx)("div",{className:"category-header",onClick:()=>this.toggleGroup(i.key)},(0,e.jsx)("div",{className:"header-left"},this.renderCategoryIcon(i.icon,i.color),(0,e.jsx)("span",{className:"category-title",style:{color:i.color}},i.title)),(0,e.jsx)("div",{className:"chevron-icon"},(0,e.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",style:{transform:s?"rotate(180deg)":"rotate(0deg)"}},(0,e.jsx)("polyline",{points:"6 9 12 15 18 9"})))),s&&(0,e.jsx)("div",{className:"category-body"},o.map((s=>(0,e.jsx)("div",{key:s.id,className:"layer-row"},(0,e.jsx)("div",{className:"layer-left"},this.renderLayerIcon(s.iconType||"layers",i.color),(0,e.jsx)("span",{className:"layer-label"},s.title)),(0,e.jsx)(t.Switch,{checked:s.visible,onChange:()=>this.toggleLayerVisibility(s.id)}))))))}))))}}function l(e){n.p=e}})(),r})())}}}));