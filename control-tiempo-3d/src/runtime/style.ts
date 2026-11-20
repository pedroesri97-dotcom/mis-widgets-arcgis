export const styleText = `
  /* ==========================================================================
     SISTEMA DE DISEÑO CALCITE - ARCGIS EXPERIENCE BUILDER DARK SLATE
     Widget: Control de Tiempo y Sombras 3D
     Línea gráfica institucional integrada con Capas Temáticas y Estadísticas
     ========================================================================== */

  .widget-control-tiempo-3d.calcite-mode-dark,
  .widget-control-tiempo-3d {
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
    font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif !important;
    font-style: normal !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    user-select: none !important;
  }

  .widget-control-tiempo-3d * {
    box-sizing: border-box !important;
    font-family: inherit !important;
    font-style: normal !important;
  }

  /* CABECERA INSTITUCIONAL */
  .widget-control-tiempo-3d .time-header {
    padding: 10px 14px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    flex-shrink: 0 !important;
    background: #0d141d !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .widget-control-tiempo-3d .time-header-title {
    font-size: 11px !important;
    font-weight: 600 !important;
    color: #94a3b8 !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }

  .widget-control-tiempo-3d .time-badge-3d {
    font-size: 9.5px !important;
    font-weight: 600 !important;
    padding: 2px 6px !important;
    border-radius: 2px !important;
    background: #1e293b !important;
    color: #94a3b8 !important;
    border: 1px solid #334155 !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
  }

  /* CONTENIDO PRINCIPAL */
  .widget-control-tiempo-3d .time-content {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 12px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  .widget-control-tiempo-3d .time-content::-webkit-scrollbar {
    width: 4px !important;
  }
  .widget-control-tiempo-3d .time-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.15) !important;
  }
  .widget-control-tiempo-3d .time-content::-webkit-scrollbar-thumb {
    background: #1e293b !important;
    border-radius: 2px !important;
  }

  /* PANEL DE HORA Y REPRODUCTOR */
  .widget-control-tiempo-3d .clock-panel {
    background: #151f2b !important;
    border: 1px solid #1e293b !important;
    border-radius: 4px !important;
    padding: 12px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
  }

  .widget-control-tiempo-3d .clock-top-row {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .widget-control-tiempo-3d .clock-display-group {
    display: flex !important;
    flex-direction: column !important;
  }

  .widget-control-tiempo-3d .clock-label {
    font-size: 10px !important;
    font-weight: 600 !important;
    color: #94a3b8 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    margin-bottom: 2px !important;
  }

  .widget-control-tiempo-3d .clock-time-text {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    letter-spacing: -0.01em !important;
    line-height: 1 !important;
    font-variant-numeric: tabular-nums !important;
  }

  .widget-control-tiempo-3d .clock-period-badge {
    font-size: 10px !important;
    font-weight: 600 !important;
    color: #007ac2 !important;
    margin-left: 5px !important;
    text-transform: uppercase !important;
  }

  /* BOTÓN PLAY / PAUSE (COMPACTO CALCITE 28PX) */
  .widget-control-tiempo-3d .play-button {
    width: 28px !important;
    height: 28px !important;
    border-radius: 2px !important;
    background: #007ac2 !important;
    border: 1px solid #007ac2 !important;
    color: #ffffff !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: background-color 0.12s ease !important;
    flex-shrink: 0 !important;
  }

  .widget-control-tiempo-3d .play-button:hover {
    background: #0369a1 !important;
    border-color: #0284c7 !important;
  }

  .widget-control-tiempo-3d .play-button.is-playing {
    background: #00b4d8 !important;
    border-color: #38bdf8 !important;
    color: #081018 !important;
  }

  /* SELECTOR DE VELOCIDAD */
  .widget-control-tiempo-3d .speed-chips {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    margin-left: auto !important;
    margin-right: 8px !important;
  }

  .widget-control-tiempo-3d .speed-chip {
    font-size: 9px !important;
    font-weight: 700 !important;
    padding: 3px 6px !important;
    border-radius: 3px !important;
    background: #1e293b !important;
    color: #94a3b8 !important;
    border: 1px solid #243447 !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
  }

  .widget-control-tiempo-3d .speed-chip.active {
    background: rgba(0, 180, 216, 0.18) !important;
    color: #00b4d8 !important;
    border-color: #00b4d8 !important;
  }

  /* SLIDER DE HORA */
  .widget-control-tiempo-3d .slider-container {
    position: relative !important;
    width: 100% !important;
    padding-top: 6px !important;
    padding-bottom: 2px !important;
  }

  .widget-control-tiempo-3d .time-slider {
    -webkit-appearance: none !important;
    appearance: none !important;
    width: 100% !important;
    height: 6px !important;
    border-radius: 3px !important;
    background: #1e293b !important;
    outline: none !important;
    cursor: pointer !important;
    margin: 0 !important;
  }

  .widget-control-tiempo-3d .time-slider::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    appearance: none !important;
    width: 16px !important;
    height: 16px !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    border: 2px solid #00b4d8 !important;
    cursor: pointer !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
    transition: transform 0.1s ease !important;
  }

  .widget-control-tiempo-3d .time-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15) !important;
  }

  .widget-control-tiempo-3d .time-slider::-moz-range-thumb {
    width: 16px !important;
    height: 16px !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    border: 2px solid #00b4d8 !important;
    cursor: pointer !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
  }

  /* MARCAS Y ETIQUETAS DEL SLIDER (2 a.m., 6 a.m., 12 p.m., 6 p.m., 12 a.m.) */
  .widget-control-tiempo-3d .slider-ticks {
    display: flex !important;
    justify-content: space-between !important;
    position: relative !important;
    width: 100% !important;
    margin-top: 8px !important;
    padding: 0 2px !important;
  }

  .widget-control-tiempo-3d .slider-tick-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }

  .widget-control-tiempo-3d .tick-line {
    width: 1px !important;
    height: 5px !important;
    background: #334155 !important;
    margin-bottom: 3px !important;
  }

  .widget-control-tiempo-3d .tick-label {
    font-size: 9px !important;
    color: #64748b !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
  }

  .widget-control-tiempo-3d .tick-label.active {
    color: #00b4d8 !important;
  }

  /* FILAS DE CONTROL Y CONMUTADORES */
  .widget-control-tiempo-3d .control-card {
    background: #151f2b !important;
    border: 1px solid #1e293b !important;
    border-radius: 4px !important;
    padding: 10px 12px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .widget-control-tiempo-3d .control-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
  }

  .widget-control-tiempo-3d .control-info {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }

  .widget-control-tiempo-3d .control-icon {
    width: 16px !important;
    height: 16px !important;
    color: #00b4d8 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
  }

  .widget-control-tiempo-3d .control-label {
    font-size: 11px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    letter-spacing: 0.02em !important;
  }

  /* CONMUTADOR CALCITE (SWITCH) */
  .widget-control-tiempo-3d .calcite-switch {
    position: relative !important;
    display: inline-block !important;
    width: 34px !important;
    height: 18px !important;
    flex-shrink: 0 !important;
  }

  .widget-control-tiempo-3d .calcite-switch input {
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
  }

  .widget-control-tiempo-3d .calcite-switch-slider {
    position: absolute !important;
    cursor: pointer !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: #1e293b !important;
    border: 1px solid #334155 !important;
    transition: 0.2s !important;
    border-radius: 18px !important;
  }

  .widget-control-tiempo-3d .calcite-switch-slider:before {
    position: absolute !important;
    content: "" !important;
    height: 12px !important;
    width: 12px !important;
    left: 2px !important;
    bottom: 2px !important;
    background-color: #94a3b8 !important;
    transition: 0.2s !important;
    border-radius: 50% !important;
  }

  .widget-control-tiempo-3d .calcite-switch input:checked + .calcite-switch-slider {
    background-color: #007ac2 !important;
    border-color: #007ac2 !important;
  }

  .widget-control-tiempo-3d .calcite-switch input:checked + .calcite-switch-slider:before {
    transform: translateX(16px) !important;
    background-color: #ffffff !important;
  }

  /* AVISO DE VISTA NO 3D COMPACTO CALCITE */
  .widget-control-tiempo-3d .notice-container {
    padding: 16px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 6px !important;
    background: #131d2a !important;
    border: 1px solid #1e293b !important;
    border-radius: 2px !important;
    margin: auto 0 !important;
  }

  .widget-control-tiempo-3d .notice-title {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
  }

  .widget-control-tiempo-3d .notice-desc {
    font-size: 11px !important;
    color: #94a3b8 !important;
    line-height: 1.4 !important;
    margin: 0 !important;
  }
`
