export const styleText = `
  /* ==========================================================================
     SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE COMPACT
     Widget: Ecosistema y Colaboración · Gemelo Digital de Bogotá
     Cabecera única, tarjetas contiguas (side-by-side), guiones y botones al pie.
     ========================================================================== */
  .widget-ecosistema-colaboracion.calcite-mode-dark,
  .widget-ecosistema-colaboracion {
    --calcite-ui-brand: #007ac2;
    --calcite-ui-brand-hover: #00619b;
    --calcite-ui-brand-press: #004875;
    --calcite-font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif;

    width: 100% !important;
    height: 100% !important;
    background-color: var(--widget-bg, #070c14) !important;
    color: #ffffff !important;
    font-family: var(--calcite-font-family) !important;
    font-style: normal !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    user-select: none !important;
    padding: 0 0 10px 0 !important;
  }

  .widget-ecosistema-colaboracion * {
    box-sizing: border-box !important;
    font-family: var(--calcite-font-family) !important;
    font-style: normal !important;
  }

  /* BARRA SEPARADORA INSTITUCIONAL CON SEGMENTO AZUL (COHERENTE CON EL PORTAL) */
  .widget-ecosistema-colaboracion .portal-divider-bar {
    width: calc(100% - 32px) !important;
    height: 1px !important;
    background: rgba(255, 255, 255, 0.08) !important;
    position: relative !important;
    margin: 8px 16px 10px 16px !important;
    flex-shrink: 0 !important;
  }

  .widget-ecosistema-colaboracion .portal-divider-bar::before {
    content: "" !important;
    position: absolute !important;
    left: 0 !important;
    top: -1px !important;
    width: 140px !important;
    height: 2px !important;
    background: var(--accent-color, #007ac2) !important;
  }

  /* CABECERA ÚNICA DEL WIDGET (UN SOLO TÍTULO Y DESCRIPCIÓN) */
  .widget-ecosistema-colaboracion .widget-header {
    padding: 2px 16px 10px 16px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 3px !important;
    flex-shrink: 0 !important;
  }

  .widget-ecosistema-colaboracion .main-title {
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    line-height: 1.25 !important;
  }

  .widget-ecosistema-colaboracion .main-desc {
    font-size: 11.5px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    max-width: 900px !important;
  }

  /* CUADRÍCULA DE TARJETAS CONTIGUAS (UNA AL LADO DE LA OTRA) */
  .widget-ecosistema-colaboracion .channels-grid {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 14px !important;
    padding: 2px 16px 8px 16px !important;
    width: 100% !important;
  }

  /* TARJETA DE COLABORACIÓN (BORDE 6PX, DISEÑO VERTICAL CON BOTÓN AL PIE) */
  .widget-ecosistema-colaboracion .collab-card {
    background-color: var(--card-bg, #0e1622) !important;
    border: 1px solid var(--card-border, #1a2533) !important;
    border-radius: 6px !important;
    padding: 16px 18px 16px 18px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    transition: border-color 0.15s ease !important;
    height: 100% !important;
  }

  .widget-ecosistema-colaboracion .collab-card:hover {
    border-color: var(--accent-color, #007ac2) !important;
  }

  .widget-ecosistema-colaboracion .collab-card-body {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 1 auto !important;
  }

  .widget-ecosistema-colaboracion .collab-card-title {
    font-size: 14.5px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 0 6px 0 !important;
    line-height: 1.3 !important;
    letter-spacing: -0.01em !important;
  }

  .widget-ecosistema-colaboracion .collab-card-desc {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 0 0 12px 0 !important;
  }

  /* ZONA DE ACCIÓN AL PIE DE TODO (BOTÓN DEBAJO) */
  .widget-ecosistema-colaboracion .collab-card-action {
    margin-top: auto !important;
    padding-top: 12px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
    display: flex !important;
    width: 100% !important;
  }

  /* BOTÓN PRIMARIO CALCITE */
  .widget-ecosistema-colaboracion .calcite-btn-primary {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 32px !important;
    padding: 0 16px !important;
    border-radius: 3px !important;
    background-color: var(--accent-color, #007ac2) !important;
    color: #ffffff !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    text-decoration: none !important;
    border: none !important;
    cursor: pointer !important;
    transition: filter 0.15s ease, background-color 0.15s ease !important;
    outline: none !important;
    white-space: nowrap !important;
    font-style: normal !important;
  }

  .widget-ecosistema-colaboracion .calcite-btn-primary:hover {
    filter: brightness(1.12) !important;
  }

  /* BOTÓN SECUNDARIO CALCITE (OUTLINE) */
  .widget-ecosistema-colaboracion .calcite-btn-secondary {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 32px !important;
    padding: 0 16px !important;
    border-radius: 3px !important;
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: #cbd5e1 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    text-decoration: none !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    outline: none !important;
    white-space: nowrap !important;
    font-style: normal !important;
  }

  .widget-ecosistema-colaboracion .calcite-btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.06) !important;
    border-color: var(--accent-color, #007ac2) !important;
    color: #ffffff !important;
  }

  /* RESPONSIVE: EN PANTALLAS ESTRECHAS SE APILAN VERTICALMENTE */
  @media (max-width: 680px) {
    .widget-ecosistema-colaboracion .channels-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
  }
`
