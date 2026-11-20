export const styleText = `
  /* SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE COMPACT */
  .widget-aplicativos-por-indicador.calcite-mode-dark,
  .widget-aplicativos-por-indicador {
    --calcite-ui-brand: #007ac2;
    --calcite-ui-brand-hover: #00619b;
    --calcite-ui-brand-press: #004875;
    --calcite-ui-background: #0d141d;
    --calcite-ui-foreground-1: #131d2a;
    --calcite-ui-foreground-2: #192635;
    --calcite-ui-border: #1e293b;
    --calcite-ui-border-hover: #007ac2;
    --calcite-ui-text-1: #ffffff;
    --calcite-ui-text-2: #cbd5e1;
    --calcite-ui-text-3: #94a3b8;
    --calcite-font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif;

    width: 100% !important;
    height: 100% !important;
    background-color: #0d141d !important;
    color: #ffffff !important;
    font-family: var(--calcite-font-family) !important;
    font-style: normal !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    user-select: none !important;
  }

  .widget-aplicativos-por-indicador * {
    box-sizing: border-box !important;
    font-family: var(--calcite-font-family) !important;
    font-style: normal !important;
  }

  /* CABECERA COMPACTA NATIVA ARCGIS */
  .widget-aplicativos-por-indicador .header-container {
    padding: 10px 14px 8px 14px !important;
    background: #0f1824 !important;
    border-bottom: 1px solid #1e293b !important;
    flex-shrink: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
  }

  .widget-aplicativos-por-indicador .header-subtitle {
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    color: #94a3b8 !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-aplicativos-por-indicador .header-title-row {
    display: flex !important;
    align-items: center !important;
  }

  .widget-aplicativos-por-indicador .header-title {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-aplicativos-por-indicador .header-desc {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.35 !important;
    margin: 0 !important;
    max-width: 900px !important;
    font-style: normal !important;
  }

  /* BARRA DE CONTROLES COMPACTA: FILTROS + BUSCADOR */
  .widget-aplicativos-por-indicador .banner-controls-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    margin-top: 4px !important;
  }

  /* SEGMENTED CONTROL / PESTAÑAS COMPACTAS CALCITE */
  .widget-aplicativos-por-indicador .dimension-filter-tabs {
    display: inline-flex !important;
    align-items: center !important;
    gap: 2px !important;
    background: #09101a !important;
    padding: 2px !important;
    border-radius: 2px !important;
    border: 1px solid #1e293b !important;
    height: 26px !important;
  }

  .widget-aplicativos-por-indicador .dimension-filter-btn {
    background: transparent !important;
    border: none !important;
    color: #94a3b8 !important;
    padding: 2px 8px !important;
    font-size: 10.5px !important;
    font-weight: 500 !important;
    border-radius: 2px !important;
    cursor: pointer !important;
    transition: all 0.12s ease !important;
    white-space: nowrap !important;
    font-style: normal !important;
    line-height: 1 !important;
    height: 20px !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  .widget-aplicativos-por-indicador .dimension-filter-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.05) !important;
  }

  .widget-aplicativos-por-indicador .dimension-filter-btn.active {
    background: #007ac2 !important;
    color: #ffffff !important;
    font-weight: 600 !important;
  }

  /* BUSCADOR COMPACTO CALCITE */
  .widget-aplicativos-por-indicador .search-box-wrapper {
    display: inline-flex !important;
    align-items: center !important;
    background: #09101a !important;
    border: 1px solid #1e293b !important;
    border-radius: 2px !important;
    padding: 0 8px !important;
    height: 26px !important;
    min-width: 190px !important;
    transition: border-color 0.12s ease !important;
  }

  .widget-aplicativos-por-indicador .search-box-wrapper:focus-within {
    border-color: #007ac2 !important;
  }

  .widget-aplicativos-por-indicador .search-icon {
    color: #64748b !important;
    margin-right: 5px !important;
    flex-shrink: 0 !important;
  }

  .widget-aplicativos-por-indicador .search-input {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    color: #ffffff !important;
    font-size: 11px !important;
    font-weight: 400 !important;
    font-style: normal !important;
    width: 100% !important;
  }

  .widget-aplicativos-por-indicador .search-input::placeholder {
    color: #64748b !important;
    font-size: 11px !important;
  }

  .widget-aplicativos-por-indicador .search-clear-btn {
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

  .widget-aplicativos-por-indicador .search-clear-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  /* REJILLA RESPONSIVA CALCITE COMPACTA */
  .widget-aplicativos-por-indicador .boards-scroll-container {
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 12px 14px 16px 14px !important;
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    gap: 10px !important;
    align-content: start !important;
  }

  .widget-aplicativos-por-indicador .boards-scroll-container::-webkit-scrollbar {
    width: 4px !important;
  }
  .widget-aplicativos-por-indicador .boards-scroll-container::-webkit-scrollbar-track {
    background: #0d141d !important;
  }
  .widget-aplicativos-por-indicador .boards-scroll-container::-webkit-scrollbar-thumb {
    background: #1e293b !important;
    border-radius: 2px !important;
  }
  .widget-aplicativos-por-indicador .boards-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #334155 !important;
  }

  /* TARJETA INDIVIDUAL (CALCITE CARD: BORDE UNIFORME, SIN LÍNEAS ARTIFICIALES) */
  .widget-aplicativos-por-indicador .board-card {
    background-color: #131d2a !important;
    border: 1px solid #1e293b !important;
    border-radius: 3px !important;
    padding: 12px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    transition: border-color 0.12s ease !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .widget-aplicativos-por-indicador .board-card:hover {
    border-color: #007ac2 !important;
  }

  .widget-aplicativos-por-indicador .card-top-content {
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    flex: 1 1 auto !important;
  }

  /* FILA METADATOS: KPI Y DIMENSIÓN */
  .widget-aplicativos-por-indicador .card-meta-row {
    display: flex !important;
    align-items: flex-start !important;
    justify-content: space-between !important;
    gap: 6px !important;
  }

  .widget-aplicativos-por-indicador .meta-left-stacked {
    display: flex !important;
    flex-direction: column !important;
    gap: 1px !important;
  }

  .widget-aplicativos-por-indicador .kpi-code-text {
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-aplicativos-por-indicador .dimension-label {
    font-size: 10px !important;
    font-weight: 500 !important;
    color: #94a3b8 !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  /* INDICADOR DE ESTADO COMPACTO */
  .widget-aplicativos-por-indicador .status-indicator {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    font-size: 10px !important;
    font-weight: 500 !important;
    color: #cbd5e1 !important;
    white-space: nowrap !important;
    line-height: 1 !important;
    font-style: normal !important;
  }

  .widget-aplicativos-por-indicador .status-text {
    font-size: 10px !important;
    font-weight: 500 !important;
    color: #cbd5e1 !important;
    white-space: nowrap !important;
    line-height: 1 !important;
    font-style: normal !important;
  }

  .widget-aplicativos-por-indicador .status-dot {
    width: 5px !important;
    height: 5px !important;
    border-radius: 50% !important;
    display: inline-block !important;
    flex-shrink: 0 !important;
  }

  .widget-aplicativos-por-indicador .status-dot.status-produccion {
    background-color: #007ac2 !important;
  }
  .widget-aplicativos-por-indicador .status-dot.status-activo {
    background-color: #10b981 !important;
  }
  .widget-aplicativos-por-indicador .status-dot.status-inactivo {
    background-color: #64748b !important;
  }
  .widget-aplicativos-por-indicador .status-dot.status-actualizando {
    background-color: #f59e0b !important;
  }

  /* TÍTULO DEL TABLERO */
  .widget-aplicativos-por-indicador .board-title {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    font-style: normal !important;
  }

  /* DESCRIPCIÓN TÉCNICA */
  .widget-aplicativos-por-indicador .board-description {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    text-align: left !important;
    font-style: normal !important;
  }

  /* FECHA DE ACTUALIZACIÓN (TEXTO PLANO) */
  .widget-aplicativos-por-indicador .card-update-row {
    font-size: 10.5px !important;
    font-weight: 400 !important;
    color: #64748b !important;
    margin-top: 1px !important;
    line-height: 1.3 !important;
    font-style: normal !important;
  }

  /* ALERTA / AVISO COMPACTO CALCITE */
  .widget-aplicativos-por-indicador .update-warning-banner {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    padding: 4px 8px !important;
    background: rgba(245, 158, 11, 0.06) !important;
    border-left: 2px solid #f59e0b !important;
    border-radius: 2px !important;
    margin-top: 2px !important;
    flex-shrink: 0 !important;
  }

  .widget-aplicativos-por-indicador .warning-icon {
    color: #f59e0b !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
  }

  .widget-aplicativos-por-indicador .warning-text {
    font-size: 10.5px !important;
    font-weight: 500 !important;
    color: #f59e0b !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    font-style: normal !important;
  }

  /* FILA INFERIOR DE ACCIÓN */
  .widget-aplicativos-por-indicador .card-action-row {
    padding-top: 8px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    margin-top: 8px !important;
    flex-shrink: 0 !important;
    min-height: 30px !important;
  }

  /* NOTA CUANDO ESTÁ INACTIVO */
  .widget-aplicativos-por-indicador .inactive-notice {
    font-size: 10.5px !important;
    color: #64748b !important;
    font-weight: 500 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    font-style: normal !important;
  }

  /* BOTÓN OFICIAL CALCITE DE ARCGIS (2PX BORDER RADIUS, 26PX HEIGHT, AZUL #007AC2) */
  .widget-aplicativos-por-indicador .calcite-app-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    height: 26px !important;
    padding: 0 12px !important;
    border-radius: 2px !important;
    background-color: #007ac2 !important;
    color: #ffffff !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-decoration: none !important;
    border: none !important;
    cursor: pointer !important;
    transition: background-color 0.12s ease !important;
    outline: none !important;
    white-space: nowrap !important;
    font-style: normal !important;
  }

  .widget-aplicativos-por-indicador .calcite-app-btn:hover {
    background-color: #00619b !important;
    color: #ffffff !important;
  }

  .widget-aplicativos-por-indicador .calcite-app-btn:active {
    background-color: #004875 !important;
  }

  .widget-aplicativos-por-indicador .calcite-app-btn-disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    background-color: #243447 !important;
  }

  .widget-aplicativos-por-indicador .empty-state {
    grid-column: 1 / -1 !important;
    padding: 24px 16px !important;
    text-align: center !important;
    color: #94a3b8 !important;
    font-size: 11.5px !important;
    font-style: normal !important;
  }
`
