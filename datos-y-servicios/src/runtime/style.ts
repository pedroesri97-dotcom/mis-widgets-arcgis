export const styleText = `
  /* SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE COMPACT */
  .widget-datos-y-servicios.calcite-mode-dark,
  .widget-datos-y-servicios {
    --calcite-ui-brand: #007ac2;
    --calcite-ui-brand-hover: #00619b;
    --calcite-ui-brand-press: #004875;
    --calcite-ui-background: #0d141d;
    --calcite-ui-foreground-1: #131d2a;
    --calcite-ui-foreground-2: #192635;
    --calcite-ui-border: #1e293b;
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

  .widget-datos-y-servicios * {
    box-sizing: border-box !important;
    font-family: var(--calcite-font-family) !important;
    font-style: normal !important;
  }

  /* CABECERA COMPACTA NATIVA ARCGIS */
  .widget-datos-y-servicios .header-container {
    padding: 10px 14px 8px 14px !important;
    background: #0f1824 !important;
    border-bottom: 1px solid #1e293b !important;
    flex-shrink: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
  }

  .widget-datos-y-servicios .header-subtitle {
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    color: #94a3b8 !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-datos-y-servicios .header-title-row {
    display: flex !important;
    align-items: center !important;
  }

  .widget-datos-y-servicios .header-title {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    line-height: 1.2 !important;
    font-style: normal !important;
  }

  .widget-datos-y-servicios .header-desc {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.35 !important;
    margin: 0 !important;
    max-width: 900px !important;
    font-style: normal !important;
  }

  /* FILA DE CONTROLES: BUSCADOR ALINEADO A LA IZQUIERDA */
  .widget-datos-y-servicios .banner-controls-row {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    margin-top: 4px !important;
  }

  .widget-datos-y-servicios .search-box-wrapper {
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

  .widget-datos-y-servicios .search-box-wrapper:focus-within {
    border-color: #007ac2 !important;
  }

  .widget-datos-y-servicios .search-input {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    color: #ffffff !important;
    font-size: 11px !important;
    font-weight: 400 !important;
    font-style: normal !important;
    width: 100% !important;
  }

  .widget-datos-y-servicios .search-input::placeholder {
    color: #64748b !important;
    font-size: 11px !important;
  }

  .widget-datos-y-servicios .search-clear-btn {
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

  .widget-datos-y-servicios .search-clear-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  /* REJILLA RESPONSIVA CON SCROLL */
  .widget-datos-y-servicios .cards-scroll-container {
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 12px 14px 16px 14px !important;
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    gap: 10px !important;
    align-content: start !important;
  }

  .widget-datos-y-servicios .cards-scroll-container::-webkit-scrollbar {
    width: 4px !important;
  }
  .widget-datos-y-servicios .cards-scroll-container::-webkit-scrollbar-track {
    background: #0d141d !important;
  }
  .widget-datos-y-servicios .cards-scroll-container::-webkit-scrollbar-thumb {
    background: #1e293b !important;
    border-radius: 2px !important;
  }
  .widget-datos-y-servicios .cards-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #334155 !important;
  }

  /* TARJETA INDIVIDUAL (CALCITE CARD: BORDE UNIFORME 1PX) */
  .widget-datos-y-servicios .data-card {
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

  .widget-datos-y-servicios .data-card:hover {
    border-color: #007ac2 !important;
  }

  .widget-datos-y-servicios .card-top-content {
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    flex: 1 1 auto !important;
  }

  /* 1. TÍTULO DEL DATO / SERVICIO (ARRIBA) */
  .widget-datos-y-servicios .card-title {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    font-style: normal !important;
  }

  /* 2. DEBAJO: FUENTE, TIPO Y ACTUALIZACIÓN (TEXTO FLUIDO) */
  .widget-datos-y-servicios .card-meta-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
  }

  .widget-datos-y-servicios .card-meta-item {
    font-size: 10.5px !important;
    line-height: 1.35 !important;
    color: #cbd5e1 !important;
    font-style: normal !important;
  }

  .widget-datos-y-servicios .meta-label {
    font-weight: 600 !important;
    color: #94a3b8 !important;
    font-style: normal !important;
  }

  .widget-datos-y-servicios .meta-value {
    font-weight: 400 !important;
    color: #e2e8f0 !important;
    font-style: normal !important;
  }

  /* 3. DESCRIPCIÓN TÉCNICA */
  .widget-datos-y-servicios .card-description {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 2px 0 0 0 !important;
    text-align: left !important;
    font-style: normal !important;
  }

  /* FILA INFERIOR DE ACCIÓN / AVISO */
  .widget-datos-y-servicios .card-action-row {
    padding-top: 8px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    margin-top: 8px !important;
    flex-shrink: 0 !important;
    min-height: 30px !important;
  }

  /* AVISO: NO ES DATO ABIERTO */
  .widget-datos-y-servicios .non-open-data-notice {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    font-size: 10.5px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.3 !important;
    font-style: normal !important;
  }

  .widget-datos-y-servicios .notice-bullet {
    color: #64748b !important;
    font-size: 7px !important;
  }

  /* BOTÓN OFICIAL CALCITE (2PX BORDER RADIUS, 26PX HEIGHT, AZUL #007AC2) */
  .widget-datos-y-servicios .calcite-app-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
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

  .widget-datos-y-servicios .calcite-app-btn:hover {
    background-color: #00619b !important;
    color: #ffffff !important;
  }

  .widget-datos-y-servicios .calcite-app-btn:active {
    background-color: #004875 !important;
  }

  .widget-datos-y-servicios .empty-state {
    grid-column: 1 / -1 !important;
    padding: 24px 16px !important;
    text-align: center !important;
    color: #94a3b8 !important;
    font-size: 11.5px !important;
    font-style: normal !important;
  }
`
