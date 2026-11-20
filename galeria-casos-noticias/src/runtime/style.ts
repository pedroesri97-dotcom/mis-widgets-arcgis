export const styleText = `
  /* ==========================================================================
     SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE COMPACT
     Gemelo Digital de Bogotá - Galería de Casos y Noticias Oficiales
     Sin etiquetas flotantes ni tags (diseño limpio y ordenado)
     ========================================================================== */
  .widget-galeria-casos-noticias.calcite-mode-dark,
  .widget-galeria-casos-noticias {
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
    padding: 0 0 12px 0 !important;
  }

  .widget-galeria-casos-noticias * {
    box-sizing: border-box !important;
    font-family: var(--calcite-font-family) !important;
    font-style: normal !important;
  }

  /* BARRA SEPARADORA INSTITUCIONAL CON SEGMENTO AZUL (COHERENTE CON EL PORTAL) */
  .widget-galeria-casos-noticias .portal-divider-bar {
    width: calc(100% - 32px) !important;
    height: 1px !important;
    background: rgba(255, 255, 255, 0.08) !important;
    position: relative !important;
    margin: 8px 16px 10px 16px !important;
    flex-shrink: 0 !important;
  }

  .widget-galeria-casos-noticias .portal-divider-bar::before {
    content: "" !important;
    position: absolute !important;
    left: 0 !important;
    top: -1px !important;
    width: 140px !important;
    height: 2px !important;
    background: var(--accent-color, #007ac2) !important;
  }

  /* CABECERA INSTITUCIONAL */
  .widget-galeria-casos-noticias .header-section {
    padding: 4px 16px 8px 16px !important;
    flex-shrink: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 3px !important;
  }

  .widget-galeria-casos-noticias .header-subtitle {
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.07em !important;
    text-transform: uppercase !important;
    color: #94a3b8 !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  .widget-galeria-casos-noticias .header-title-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 12px !important;
  }

  .widget-galeria-casos-noticias .header-title {
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
    line-height: 1.25 !important;
  }

  .widget-galeria-casos-noticias .title-highlight {
    color: var(--accent-color, #007ac2) !important;
  }

  .widget-galeria-casos-noticias .header-desc {
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    max-width: 900px !important;
  }

  /* CONTROLES DE NAVEGACIÓN DEL CARRUSEL EN CABECERA */
  .widget-galeria-casos-noticias .carousel-nav-buttons {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
  }

  .widget-galeria-casos-noticias .carousel-arrow-btn {
    width: 26px !important;
    height: 26px !important;
    border-radius: 3px !important;
    background: var(--card-bg, #0e1622) !important;
    border: 1px solid var(--card-border, #1a2533) !important;
    color: #cbd5e1 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.12s ease !important;
    padding: 0 !important;
  }

  .widget-galeria-casos-noticias .carousel-arrow-btn:hover {
    background: #192535 !important;
    color: #ffffff !important;
    border-color: var(--accent-color, #007ac2) !important;
  }

  /* SECCIÓN DEL CARRUSEL */
  .widget-galeria-casos-noticias .carousel-section {
    padding: 2px 16px 6px 16px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    flex-shrink: 0 !important;
  }

  .widget-galeria-casos-noticias .carousel-viewport {
    width: 100% !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-behavior: smooth !important;
    position: relative !important;
  }

  .widget-galeria-casos-noticias .carousel-viewport::-webkit-scrollbar {
    height: 4px !important;
  }
  .widget-galeria-casos-noticias .carousel-viewport::-webkit-scrollbar-track {
    background: transparent !important;
  }
  .widget-galeria-casos-noticias .carousel-viewport::-webkit-scrollbar-thumb {
    background: var(--card-border, #1a2533) !important;
    border-radius: 2px !important;
  }

  .widget-galeria-casos-noticias .carousel-track {
    display: flex !important;
    gap: 12px !important;
    align-items: stretch !important;
    width: max-content !important;
    padding: 2px 2px 6px 2px !important;
  }

  /* TARJETA DE NOTICIA (BORDE 6PX, SIN ETIQUETAS, ALINEADA CON PORTAL) */
  .widget-galeria-casos-noticias .news-card {
    width: 275px !important;
    min-width: 275px !important;
    background-color: var(--card-bg, #0e1622) !important;
    border: 1px solid var(--card-border, #1a2533) !important;
    border-radius: 6px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    cursor: pointer !important;
    transition: border-color 0.15s ease, transform 0.15s ease !important;
    text-decoration: none !important;
  }

  .widget-galeria-casos-noticias .news-card:hover {
    border-color: var(--accent-color, #007ac2) !important;
    transform: translateY(-2px) !important;
  }

  /* ZONA DE IMAGEN SUPERIOR (LIMPIA, SIN NINGUNA ETIQUETA NI ELEMENTOS FLOTANTES) */
  .widget-galeria-casos-noticias .card-image-box {
    height: 130px !important;
    width: 100% !important;
    background-color: #121c29 !important;
    background-size: cover !important;
    background-position: center !important;
    display: block !important;
  }

  /* ZONA DE CONTENIDO INFERIOR */
  .widget-galeria-casos-noticias .card-body-content {
    padding: 12px 14px 14px 14px !important;
    background: var(--card-bg, #0e1622) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    flex: 1 1 auto !important;
    gap: 8px !important;
  }

  .widget-galeria-casos-noticias .card-news-title {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.35 !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
  }

  /* PROCEDENCIA OFICIAL */
  .widget-galeria-casos-noticias .card-meta-provenance {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 6px !important;
    padding-top: 8px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
    margin-top: auto !important;
  }

  .widget-galeria-casos-noticias .card-provenance-source {
    font-size: 10px !important;
    font-weight: 500 !important;
    color: #94a3b8 !important;
    line-height: 1.25 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex: 1 1 auto !important;
  }

  .widget-galeria-casos-noticias .card-provenance-date {
    font-size: 10px !important;
    color: #64748b !important;
    flex-shrink: 0 !important;
  }
`
