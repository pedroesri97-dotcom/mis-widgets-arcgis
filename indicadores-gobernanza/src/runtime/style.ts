export const styleText = `
  /* SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE COMPACT */
  .widget-indicadores-gobernanza.calcite-mode-dark,
  .widget-indicadores-gobernanza {
    --calcite-ui-brand: #007ac2;
    --calcite-ui-brand-hover: #00619b;
    --calcite-ui-brand-press: #004875;
    --calcite-ui-info: #007ac2;
    --calcite-ui-success: #10b981;
    --calcite-ui-warning: #f59e0b;
    --calcite-ui-danger: #f43f5e;
    --calcite-ui-background: #0d141d;
    --calcite-ui-foreground-1: #131d2a;
    --calcite-ui-foreground-2: #192635;
    --calcite-ui-foreground-3: #1e2d3d;
    --calcite-ui-text-1: #ffffff;
    --calcite-ui-text-2: #cbd5e1;
    --calcite-ui-text-3: #94a3b8;
    --calcite-ui-border-1: #1e293b;
    --calcite-ui-border-2: #243447;
    --calcite-ui-border-3: #007ac2;
    --calcite-ui-border-input: #334155;
    --calcite-sans-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif;

    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    max-height: 100% !important;
    background-color: #0d141d !important;
    color: #ffffff !important;
    font-family: var(--calcite-sans-family) !important;
    font-style: normal !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    user-select: none !important;
    position: relative !important;
  }

  .widget-indicadores-gobernanza * {
    box-sizing: border-box !important;
    font-family: var(--calcite-sans-family) !important;
    font-style: normal !important;
  }

  /* CABECERA CALCITE COMPACTA */
  .widget-indicadores-gobernanza .header-container {
    padding: 10px 14px 8px 14px !important;
    border-bottom: 1px solid #1e293b !important;
    flex-shrink: 0 !important;
    background: #0f1824 !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
  }

  .widget-indicadores-gobernanza .header-subtitle {
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    color: #94a3b8 !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .header-title-row {
    display: flex !important;
    align-items: center !important;
  }

  .widget-indicadores-gobernanza .header-title {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .header-desc {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.35 !important;
    margin: 0 !important;
    font-style: normal !important;
  }

  /* CONTROLES DE CABECERA: BUSCADOR ALINEADO A LA IZQUIERDA */
  .widget-indicadores-gobernanza .header-controls-row {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    margin-top: 4px !important;
  }

  .widget-indicadores-gobernanza .search-box-wrapper {
    display: inline-flex !important;
    align-items: center !important;
    background: #09101a !important;
    border: 1px solid #1e293b !important;
    border-radius: 2px !important;
    padding: 0 8px !important;
    height: 26px !important;
    width: 100% !important;
    max-width: 260px !important;
    transition: border-color 0.12s ease !important;
  }

  .widget-indicadores-gobernanza .search-box-wrapper:focus-within {
    border-color: #007ac2 !important;
  }

  .widget-indicadores-gobernanza .search-icon {
    color: #64748b !important;
    margin-right: 5px !important;
    flex-shrink: 0 !important;
  }

  .widget-indicadores-gobernanza .search-input {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    color: #ffffff !important;
    font-size: 11px !important;
    font-weight: 400 !important;
    font-style: normal !important;
    width: 100% !important;
  }

  .widget-indicadores-gobernanza .search-input::placeholder {
    color: #64748b !important;
    font-size: 11px !important;
  }

  .widget-indicadores-gobernanza .search-clear-btn {
    background: transparent !important;
    border: none !important;
    color: #94a3b8 !important;
    font-size: 10px !important;
    cursor: pointer !important;
    padding: 1px 3px !important;
    border-radius: 2px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .widget-indicadores-gobernanza .search-clear-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  /* CONTENEDOR CON SCROLL Y REJILLA RESPONSIVA */
  .widget-indicadores-gobernanza .cards-scroll-container {
    flex: 1 1 0px !important;
    min-height: 0 !important;
    max-height: 100% !important;
    height: 100% !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 12px 14px 16px 14px !important;
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    grid-auto-rows: max-content !important;
    gap: 12px !important;
    align-content: start !important;
    scrollbar-width: thin !important;
    scrollbar-color: #475569 #09101a !important;
  }

  .widget-indicadores-gobernanza .cards-scroll-container::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
  }
  .widget-indicadores-gobernanza .cards-scroll-container::-webkit-scrollbar-track {
    background: #09101a !important;
    border-radius: 3px !important;
  }
  .widget-indicadores-gobernanza .cards-scroll-container::-webkit-scrollbar-thumb {
    background: #475569 !important;
    border-radius: 3px !important;
  }
  .widget-indicadores-gobernanza .cards-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #64748b !important;
  }

  /* TARJETA DE INDICADOR */
  .widget-indicadores-gobernanza .indicator-card {
    background: #131d2a !important;
    border: 1px solid #1e293b !important;
    border-radius: 3px !important;
    padding: 12px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    min-height: 175px !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
    transition: border-color 0.12s ease !important;
    position: relative !important;
  }

  .widget-indicadores-gobernanza .indicator-card:hover {
    border-color: #007ac2 !important;
  }

  /* TÍTULO DE LA TARJETA */
  .widget-indicadores-gobernanza .card-title {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    font-style: normal !important;
  }

  /* FILA DEL VALOR PRINCIPAL Y DELTA BADGE */
  .widget-indicadores-gobernanza .card-metric-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin: 0 !important;
  }

  .widget-indicadores-gobernanza .card-metric-left {
    display: flex !important;
    align-items: baseline !important;
    gap: 2px !important;
  }

  .widget-indicadores-gobernanza .metric-value {
    font-size: 20px !important;
    font-weight: 600 !important;
    line-height: 1 !important;
    letter-spacing: -0.01em !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .metric-unit {
    font-size: 11.5px !important;
    font-weight: 500 !important;
    opacity: 0.85 !important;
    font-style: normal !important;
  }

  /* PILL DELTA (VARIACIÓN) COMPACTO CALCITE */
  .widget-indicadores-gobernanza .trend-badge {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1px 6px !important;
    border-radius: 2px !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.01em !important;
    white-space: nowrap !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .trend-badge.trend-positive {
    background: rgba(16, 185, 129, 0.1) !important;
    border: 1px solid rgba(16, 185, 129, 0.3) !important;
    color: #10b981 !important;
  }

  .widget-indicadores-gobernanza .trend-badge.trend-negative {
    background: rgba(244, 63, 94, 0.1) !important;
    border: 1px solid rgba(244, 63, 94, 0.3) !important;
    color: #f43f5e !important;
  }

  .widget-indicadores-gobernanza .trend-badge.trend-neutral {
    background: rgba(100, 116, 139, 0.1) !important;
    border: 1px solid rgba(100, 116, 139, 0.3) !important;
    color: #94a3b8 !important;
  }

  /* CAJA INTERNA DE COMPARATIVA TEMPORAL (OBJETIVO 100%) */
  .widget-indicadores-gobernanza .comparison-box {
    background: #0b121c !important;
    border: 1px solid #1e293b !important;
    border-radius: 2px !important;
    padding: 6px 8px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
  }

  .widget-indicadores-gobernanza .comparison-header-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 1px !important;
  }

  .widget-indicadores-gobernanza .comparison-label-left {
    font-size: 9.5px !important;
    font-weight: 600 !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
    color: #64748b !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .comparison-label-right {
    font-size: 9.5px !important;
    font-weight: 600 !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
    color: #64748b !important;
    font-style: normal !important;
  }

  /* FILAS DE BARRAS DE PROGRESO (CALCITE FLAT, SIN GLOW NI DEGRADADOS EXAGERADOS) */
  .widget-indicadores-gobernanza .progress-row {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }

  .widget-indicadores-gobernanza .progress-period-label {
    font-size: 10.5px !important;
    font-weight: 500 !important;
    color: #94a3b8 !important;
    min-width: 46px !important;
    flex-shrink: 0 !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .progress-track {
    flex: 1 1 auto !important;
    height: 6px !important;
    background: rgba(255, 255, 255, 0.06) !important;
    border-radius: 1px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .widget-indicadores-gobernanza .progress-fill {
    height: 100% !important;
    border-radius: 1px !important;
    transition: width 0.4s ease !important;
  }

  .widget-indicadores-gobernanza .progress-fill.fill-prev {
    background: #007ac2 !important;
    opacity: 0.65 !important;
  }

  .widget-indicadores-gobernanza .progress-fill.fill-curr {
    background: #007ac2 !important;
    opacity: 1 !important;
  }

  .widget-indicadores-gobernanza .progress-value-label {
    font-size: 10.5px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    min-width: 38px !important;
    text-align: right !important;
    flex-shrink: 0 !important;
    font-style: normal !important;
  }

  /* DESCRIPCIÓN DEL INDICADOR */
  .widget-indicadores-gobernanza .card-desc {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    font-style: normal !important;
  }

  .widget-indicadores-gobernanza .empty-state {
    grid-column: 1 / -1 !important;
    padding: 24px 16px !important;
    text-align: center !important;
    color: #94a3b8 !important;
    font-size: 11.5px !important;
    font-style: normal !important;
  }
`
