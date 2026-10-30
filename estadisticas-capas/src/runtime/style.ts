export const styleText = `
  /* ==========================================================================
     SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE
     Línea gráfica oficial integrada con Capas Temáticas
     ========================================================================== */

  .widget-estadisticas-capas.calcite-mode-dark,
  .widget-estadisticas-capas {
    --calcite-ui-background: #111822;
    --calcite-ui-surface-1: #151f2b;
    --calcite-ui-surface-2: #1e293b;
    --calcite-ui-inset: #0d1e33;
    --calcite-ui-border-1: #1e293b;
    --calcite-ui-border-2: #243447;
    --calcite-ui-brand: #0284c7;
    --calcite-ui-brand-hover: #0369a1;
    --calcite-ui-info: #00b4d8;
    --calcite-ui-success: #34d399;
    --calcite-ui-text-1: #ffffff;
    --calcite-ui-text-2: #94a3b8;
    --calcite-ui-text-3: #64748b;

    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    background-color: var(--calcite-ui-background) !important;
    color: var(--calcite-ui-text-1) !important;
    font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-style: normal !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    user-select: none !important;
  }

  .widget-estadisticas-capas * {
    box-sizing: border-box !important;
    font-family: inherit !important;
    font-style: normal !important;
  }

  /* CABECERA COMPACTA */
  .widget-estadisticas-capas .header-container {
    padding: 10px 12px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    flex-shrink: 0 !important;
    background: #0d141d !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .widget-estadisticas-capas .header-title {
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #00b4d8 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  /* CONTENEDOR DE TARJETAS */
  .widget-estadisticas-capas .cards-container {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    height: 100% !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 8px 10px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .widget-estadisticas-capas .cards-container::-webkit-scrollbar {
    width: 4px !important;
  }
  .widget-estadisticas-capas .cards-container::-webkit-scrollbar-track {
    background: var(--calcite-ui-background) !important;
  }
  .widget-estadisticas-capas .cards-container::-webkit-scrollbar-thumb {
    background: var(--calcite-ui-border-2) !important;
    border-radius: 2px !important;
  }

  /* TARJETA DE ESTADÍSTICA CALCITE DARK */
  .widget-estadisticas-capas .stat-card {
    flex-shrink: 0 !important;
    width: 100% !important;
    background: #151f2b !important;
    border: 1px solid #1e293b !important;
    border-radius: 3px !important;
    padding: 10px 12px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
    position: relative !important;
    transition: border-color 0.15s ease !important;
  }

  .widget-estadisticas-capas .stat-card:hover {
    border-color: #243447 !important;
  }

  /* FILA SUPERIOR: TÍTULO + BOTÓN DE INFORMACIÓN */
  .widget-estadisticas-capas .stat-card-top {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 2px !important;
    gap: 8px !important;
  }

  .widget-estadisticas-capas .stat-card-title {
    font-size: 10.5px !important;
    font-weight: 700 !important;
    color: #94a3b8 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex: 1 !important;
  }

  /* BOTÓN DE INFORMACIÓN DISCRETO */
  .widget-estadisticas-capas .stat-card-info-btn {
    width: 20px !important;
    height: 20px !important;
    border-radius: 2px !important;
    background: rgba(0, 180, 216, 0.08) !important;
    border: 1px solid rgba(0, 180, 216, 0.25) !important;
    color: #00b4d8 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    padding: 0 !important;
    flex-shrink: 0 !important;
    transition: all 0.15s ease !important;
    outline: none !important;
  }

  .widget-estadisticas-capas .stat-card-info-btn:hover {
    background: #0284c7 !important;
    border-color: #0284c7 !important;
    color: #ffffff !important;
  }

  /* VALOR PRINCIPAL + UNIDAD */
  .widget-estadisticas-capas .stat-card-metric-row {
    display: flex !important;
    align-items: baseline !important;
    gap: 6px !important;
    margin: 1px 0 3px 0 !important;
    flex-wrap: wrap !important;
  }

  .widget-estadisticas-capas .stat-card-value {
    font-size: 26px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    line-height: 1.1 !important;
    letter-spacing: -0.01em !important;
  }

  .widget-estadisticas-capas .stat-card-unit {
    font-size: 12.5px !important;
    font-weight: 600 !important;
    color: #00b4d8 !important;
    line-height: 1.2 !important;
  }

  /* DESCRIPCIÓN CONTEXTUAL INFERIOR (VERDE MENTA DISCRETO) */
  .widget-estadisticas-capas .stat-card-desc {
    font-size: 11px !important;
    font-weight: 500 !important;
    color: #34d399 !important;
    line-height: 1.35 !important;
    margin-top: 2px !important;
  }

  /* ESTADO VACÍO */
  .widget-estadisticas-capas .empty-state {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 24px 16px !important;
    text-align: center !important;
    color: #64748b !important;
    gap: 8px !important;
  }

  .widget-estadisticas-capas .empty-icon-circle {
    width: 34px !important;
    height: 34px !important;
    border-radius: 3px !important;
    background: #151f2b !important;
    border: 1px solid #1e293b !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #00b4d8 !important;
  }

  .widget-estadisticas-capas .empty-text {
    font-size: 11.5px !important;
    line-height: 1.45 !important;
    color: #94a3b8 !important;
    max-width: 230px !important;
  }

  /* ==========================================================================
     VENTANA EMERGENTE (CALCITE DIALOG - PORTAL ROOT)
     Diseño limpio Calcite Dark Slate
     ========================================================================== */

  .stat-modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    background: rgba(4, 10, 18, 0.75) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 16px !important;
    box-sizing: border-box !important;
    font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif !important;
  }

  .stat-modal-window {
    width: 100% !important;
    max-width: 600px !important;
    max-height: 88vh !important;
    overflow-y: auto !important;
    background: #0d1e33 !important;
    border: 1px solid #1a3654 !important;
    border-radius: 4px !important;
    padding: 18px 22px !important;
    color: #ffffff !important;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6) !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    position: relative !important;
    box-sizing: border-box !important;
  }

  .stat-modal-window::-webkit-scrollbar {
    width: 4px !important;
  }
  .stat-modal-window::-webkit-scrollbar-track {
    background: #0d1e33 !important;
  }
  .stat-modal-window::-webkit-scrollbar-thumb {
    background: #1a3654 !important;
    border-radius: 2px !important;
  }

  /* CABECERA DEL DIÁLOGO CALCITE */
  .stat-modal-header-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 12px !important;
    width: 100% !important;
    border-bottom: 1px solid #142a42 !important;
    padding-bottom: 10px !important;
  }

  .stat-modal-main-title {
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    line-height: 1.3 !important;
    letter-spacing: -0.01em !important;
    flex: 1 !important;
  }

  .stat-modal-close-btn {
    width: 24px !important;
    height: 24px !important;
    border-radius: 2px !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    color: #94a3b8 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    padding: 0 !important;
    flex-shrink: 0 !important;
    outline: none !important;
  }

  .stat-modal-close-btn:hover {
    background: #1e293b !important;
    border-color: #334155 !important;
    color: #ffffff !important;
  }

  /* CUADRÍCULA DE MÉTRICAS */
  .stat-modal-metrics-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .stat-modal-subcard {
    background: #112030 !important;
    border: 1px solid #1c3248 !important;
    border-radius: 2px !important;
    padding: 8px 10px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    gap: 4px !important;
    min-height: 66px !important;
  }

  .stat-modal-subcard.is-primary {
    border-left: 3px solid #00b4d8 !important;
    background: #13253b !important;
  }

  .stat-modal-subcard-label {
    font-size: 9.5px !important;
    font-weight: 600 !important;
    color: #94a3b8 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
    line-height: 1.25 !important;
  }

  .stat-modal-subcard-val-row {
    display: flex !important;
    align-items: baseline !important;
    gap: 4px !important;
    flex-wrap: wrap !important;
  }

  .stat-modal-subcard-val {
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    line-height: 1.15 !important;
  }

  .stat-modal-subcard.is-primary .stat-modal-subcard-val {
    color: #00e5ff !important;
  }

  .stat-modal-subcard-unit {
    font-size: 11px !important;
    font-weight: 500 !important;
    color: #94a3b8 !important;
  }

  .stat-modal-subcard.is-primary .stat-modal-subcard-unit {
    color: #00b4d8 !important;
  }

  /* PÁRRAFO DESCRIPTIVO */
  .stat-modal-description {
    font-size: 12.5px !important;
    color: #e2e8f0 !important;
    line-height: 1.6 !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    font-weight: 400 !important;
  }

  /* LISTA DE METADATOS */
  .stat-modal-meta-box {
    background: #081422 !important;
    border: 1px solid #14293f !important;
    border-radius: 2px !important;
    padding: 6px 10px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    width: 100% !important;
  }

  .stat-modal-meta-row {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 2px 0 !important;
  }

  .stat-modal-meta-row:not(:last-child) {
    border-bottom: 1px solid #14293f !important;
    padding-bottom: 4px !important;
  }

  .stat-modal-meta-label {
    font-size: 10px !important;
    font-weight: 500 !important;
    color: #64748b !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
  }

  .stat-modal-meta-value {
    font-size: 10.5px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    text-align: right !important;
  }

  /* BOTÓN DE ACCIÓN CALCITE */
  .stat-modal-actions-row {
    display: flex !important;
    justify-content: flex-end !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 2px !important;
  }

  .stat-modal-link-btn {
    background: #0284c7 !important;
    color: #ffffff !important;
    border: 1px solid #0284c7 !important;
    border-radius: 2px !important;
    padding: 6px 14px !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    text-decoration: none !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease !important;
  }

  .stat-modal-link-btn:hover {
    background: #0369a1 !important;
    border-color: #0369a1 !important;
    color: #ffffff !important;
    text-decoration: none !important;
  }
`
