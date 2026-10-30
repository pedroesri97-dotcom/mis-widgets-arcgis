export const styleText = `
  /* SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE THEME (INSPIRADO EN REFERENCIA) */
  .widget-capas-tematicas.calcite-mode-dark,
  .widget-capas-tematicas {
    --calcite-ui-brand: #0284c7;
    --calcite-ui-brand-hover: #0369a1;
    --calcite-ui-brand-press: #075985;
    --calcite-ui-info: #00b4d8;
    --calcite-ui-success: #10b981;
    --calcite-ui-warning: #f59e0b;
    --calcite-ui-danger: #f43f5e;
    --calcite-ui-background: #111822;
    --calcite-ui-foreground-1: #151f2b;
    --calcite-ui-foreground-2: #192635;
    --calcite-ui-foreground-3: #1e2d3d;
    --calcite-ui-text-1: #ffffff;
    --calcite-ui-text-2: #94a3b8;
    --calcite-ui-text-3: #64748b;
    --calcite-ui-border-1: #1e293b;
    --calcite-ui-border-2: #243447;
    --calcite-ui-border-3: #0284c7;
    --calcite-ui-border-input: #334155;
    --calcite-sans-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif;

    width: 100% !important;
    height: 100% !important;
    background-color: #111822 !important;
    color: #ffffff !important;
    font-family: var(--calcite-sans-family) !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    user-select: none !important;
  }

  .widget-capas-tematicas * {
    box-sizing: border-box !important;
    font-family: inherit !important;
  }

  /* CABECERA COMPACTA Y ELEGANTE */
  .widget-capas-tematicas .header-container {
    padding: 12px 14px 10px 14px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    flex-shrink: 0 !important;
    background: #0d141d !important;
  }

  .widget-capas-tematicas .header-subtitle {
    font-size: 10.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: #00b4d8 !important;
    margin: 0 0 3px 0 !important;
    line-height: 1.2 !important;
  }

  .widget-capas-tematicas .header-title {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    letter-spacing: -0.01em !important;
  }

  /* FECHA ARRIBA Y HORA DEBAJO (SIN PUNTOS) */
  .widget-capas-tematicas .header-datetime-block {
    margin-top: 5px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 1px !important;
  }

  .widget-capas-tematicas .header-date {
    font-size: 11px !important;
    font-weight: 600 !important;
    color: #94a3b8 !important;
    line-height: 1.25 !important;
    letter-spacing: 0.01em !important;
  }

  .widget-capas-tematicas .header-time {
    font-size: 11px !important;
    font-weight: 500 !important;
    color: #00e5ff !important;
    line-height: 1.25 !important;
    letter-spacing: 0.02em !important;
  }

  /* BOTONES DE ACCIÓN GLOBAL COMPACTOS TIPO PILL (ESTILO TODAS / NINGUNA) */
  .widget-capas-tematicas .category-quick-btn {
    background: #1c2633 !important;
    border: 1px solid #2d3b4e !important;
    color: #cbd5e1 !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.03em !important;
    padding: 3px 8px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    line-height: 1.3 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .widget-capas-tematicas .category-quick-btn:hover {
    background: #253447 !important;
    color: #ffffff !important;
    border-color: #38bdf8 !important;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.25) !important;
  }

  .widget-capas-tematicas .category-quick-btn:active {
    background: #17202c !important;
    transform: scale(0.97) !important;
  }

  /* ÁREA DE SCROLL CON SCROLLBAR COMPACTO */
  .widget-capas-tematicas .content-scroll {
    flex: 1 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 10px 10px 24px 10px !important;
  }

  .widget-capas-tematicas .content-scroll::-webkit-scrollbar {
    width: 4px !important;
  }
  .widget-capas-tematicas .content-scroll::-webkit-scrollbar-track {
    background: transparent !important;
  }
  .widget-capas-tematicas .content-scroll::-webkit-scrollbar-thumb {
    background: #1e293b !important;
    border-radius: 3px !important;
  }
  .widget-capas-tematicas .content-scroll::-webkit-scrollbar-thumb:hover {
    background: #334155 !important;
  }

  /* BLOQUE DE CATEGORÍA */
  .widget-capas-tematicas .category-block {
    margin-bottom: 12px !important;
  }

  /* CABECERA DE CATEGORÍA ESTILO COMPACTO */
  .widget-capas-tematicas .category-header-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 5px !important;
    padding: 4px 6px !important;
    border-radius: 4px !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease !important;
    gap: 6px !important;
  }

  .widget-capas-tematicas .category-header-row:hover {
    background: rgba(255, 255, 255, 0.04) !important;
  }

  .widget-capas-tematicas .category-header-left {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    flex: 1 !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .widget-capas-tematicas .category-chevron-icon {
    font-size: 8px !important;
    color: #38bdf8 !important;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: inline-block !important;
    flex-shrink: 0 !important;
  }

  .widget-capas-tematicas .category-chevron-icon.is-collapsed {
    transform: rotate(-90deg) !important;
  }

  .widget-capas-tematicas .category-label {
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #94a3b8 !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase !important;
    line-height: 1.3 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .widget-capas-tematicas .category-pill-badge {
    background: #1c2633 !important;
    border: 1px solid #2d3b4e !important;
    color: #7dd3fc !important;
    font-size: 9.5px !important;
    font-weight: 600 !important;
    letter-spacing: 0.04em !important;
    padding: 2px 7px !important;
    border-radius: 4px !important;
    text-transform: uppercase !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  /* LISTADO DE CAPAS */
  .widget-capas-tematicas .layers-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
  }

  /* SUBGRUPO COLAPSABLE COMPACTO */
  .widget-capas-tematicas .subgroup-container {
    margin: 4px 0 6px 0 !important;
    background: #141c26 !important;
    border: 1px solid #202d3d !important;
    border-radius: 5px !important;
    overflow: hidden !important;
  }

  .widget-capas-tematicas .subgroup-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 5px 8px !important;
    background: #16202c !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease !important;
  }

  .widget-capas-tematicas .subgroup-header:hover {
    background: #1c2938 !important;
  }

  .widget-capas-tematicas .subgroup-title-left {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    flex: 1 !important;
  }

  .widget-capas-tematicas .subgroup-chevron {
    font-size: 7.5px !important;
    color: #38bdf8 !important;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: inline-block !important;
  }

  .widget-capas-tematicas .subgroup-chevron.is-collapsed {
    transform: rotate(-90deg) !important;
  }

  .widget-capas-tematicas .subgroup-title-text {
    font-size: 11px !important;
    font-weight: 600 !important;
    color: #e2e8f0 !important;
    letter-spacing: 0.03em !important;
    text-transform: uppercase !important;
  }

  .widget-capas-tematicas .subgroup-content,
  .widget-capas-tematicas .subgroup-layers-body {
    padding: 3px 6px 4px 10px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
    border-left: 2px solid #0284c7 !important;
    background: #0f1620 !important;
  }

  /* FILA DE CAPA (CARD COMPACTO TIPO IMAGEN 3) */
  .widget-capas-tematicas .layer-item-card {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 5px 8px !important;
    border-radius: 4px !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    min-height: 30px !important;
    margin-bottom: 2px !important;
    gap: 6px !important;
  }

  .widget-capas-tematicas .layer-item-card:hover {
    background: rgba(255, 255, 255, 0.04) !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }

  /* ESTADO ENCENDIDO: FONDO SUTIL Y BORDE AZUL CLARO */
  .widget-capas-tematicas .layer-item-card.is-active {
    background: #142232 !important;
    border: 1px solid #0284c7 !important;
    box-shadow: 0 0 6px rgba(2, 132, 199, 0.2) !important;
  }

  /* CAPA NO DISPONIBLE EN VISTA 2D (INFORMATIVA, TOTALMENTE INTERACTIVA) */
  .widget-capas-tematicas .layer-item-card.is-unavailable {
    opacity: 1 !important;
    cursor: pointer !important;
  }

  .widget-capas-tematicas .layer-item-card.is-unavailable:hover {
    background: rgba(255, 255, 255, 0.04) !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }

  /* LADO IZQUIERDO: PUNTO + TÍTULO */
  .widget-capas-tematicas .layer-left-info {
    display: flex !important;
    align-items: center !important;
    gap: 7px !important;
    min-width: 0 !important;
    flex: 1 !important;
    overflow: hidden !important;
  }

  .widget-capas-tematicas .layer-color-dot {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
    transition: box-shadow 0.2s ease !important;
  }

  .widget-capas-tematicas .layer-name-text {
    font-size: 11.5px !important;
    font-weight: 500 !important;
    color: #e2e8f0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    letter-spacing: -0.01em !important;
    line-height: 1.3 !important;
    flex-shrink: 1 !important;
    min-width: 0 !important;
  }

  .widget-capas-tematicas .layer-item-card.is-active .layer-name-text {
    color: #ffffff !important;
    font-weight: 600 !important;
  }

  /* ETIQUETA NO DISPONIBLE 2D (MICRO AMBER COMPACTA) */
  .widget-capas-tematicas .layer-unavailable-tag {
    font-size: 7px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
    padding: 1px 4px !important;
    height: 13px !important;
    border-radius: 3px !important;
    background: rgba(245, 158, 11, 0.15) !important;
    color: #f59e0b !important;
    border: 0.5px solid rgba(245, 158, 11, 0.4) !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    line-height: 12px !important;
    text-transform: uppercase !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-left: 3px !important;
    box-sizing: border-box !important;
  }

  /* CHECKBOX CALCITE COMPACTO (ESTILO IMAGEN 3) */
  .widget-capas-tematicas .calcite-box {
    width: 16px !important;
    height: 16px !important;
    border-radius: 3.5px !important;
    border: 1.5px solid #475569 !important;
    background: #090e17 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    flex-shrink: 0 !important;
  }

  .widget-capas-tematicas .calcite-box:hover {
    border-color: #38bdf8 !important;
    background: #0e1724 !important;
  }

  .widget-capas-tematicas .calcite-box.is-checked {
    background: #0284c7 !important;
    border-color: #0284c7 !important;
    box-shadow: 0 0 6px rgba(2, 132, 199, 0.4) !important;
  }

  .widget-capas-tematicas .calcite-box svg {
    display: none !important;
    width: 10px !important;
    height: 10px !important;
    stroke: #ffffff !important;
    stroke-width: 3 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
  }

  .widget-capas-tematicas .calcite-box.is-checked svg {
    display: block !important;
  }
`
