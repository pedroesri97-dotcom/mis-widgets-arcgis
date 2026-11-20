/**
 * ============================================================================
 * WIDGET RUNTIME: ECOSISTEMA Y COLABORACIÓN (ARCGIS EXPERIENCE BUILDER)
 * ============================================================================
 * 
 * Diseñado en coherencia visual exacta con el portal del Gemelo Digital de Bogotá.
 * Incluye cabecera única institucional, cuadrícula de tarjetas contiguas (side-by-side),
 * viñetas con guiones y botones de acción ubicados al pie de cada tarjeta.
 */

import { React, type AllWidgetProps, getAppStore, appActions, LinkType, jimuHistory } from 'jimu-core'
import { Link } from 'jimu-ui'
import type { IMConfig, ChannelItem, ThemeColors } from '../config'
import { styleText } from './style'

const { useMemo, useCallback } = React

const DEFAULT_ENTITY_CHANNEL: ChannelItem = {
  id: 'entity',
  title: '¿Tu entidad quiere sumarse al ecosistema?',
  subtitle: 'Conoce los acuerdos de intercambio de datos espaciales, geoservicios federados (REST, WFS/WMS) y niveles de servicio disponibles.',
  buttonText: 'Solicitar acceso',
  buttonType: 'primary',
  targetType: 'window',
  dialogId: '',
  url: ''
}

const DEFAULT_FEEDBACK_CHANNEL: ChannelItem = {
  id: 'feedback',
  title: 'Aportar datos o dejar una sugerencia',
  subtitle: 'Contribuye con observaciones técnicas, capas de información territorial sobre el área de influencia del Metro o sugerencias para optimizar las decisiones.',
  buttonText: 'Dejar opinión',
  buttonType: 'secondary',
  targetType: 'window',
  dialogId: '',
  url: ''
}

const DEFAULT_THEME_COLORS: ThemeColors = {
  widgetBg: '#070c14',
  cardBg: '#0e1622',
  accentColor: '#007ac2',
  cardBorder: '#1a2533'
}

export default function Widget(props: AllWidgetProps<IMConfig>) {
  const { config } = props

  const showDividerBar = config?.showDividerBar ?? true
  const headerTitle = config?.headerTitle ?? 'Colabora con el Gemelo Digital'
  const headerDescription = config?.headerDescription ?? 'Espacio de articulación interinstitucional y participación técnica para fortalecer el modelo territorial de Bogotá.'
  const feedbackEnabled = config?.feedbackEnabled ?? true

  const themeColors: ThemeColors = useMemo(() => {
    const raw = config?.themeColors
    if (!raw) return DEFAULT_THEME_COLORS
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...DEFAULT_THEME_COLORS, ...raw }
  }, [config?.themeColors])

  const entityChannel: ChannelItem = useMemo(() => {
    const raw = config?.entityChannel
    if (!raw) return DEFAULT_ENTITY_CHANNEL
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...DEFAULT_ENTITY_CHANNEL, ...raw }
  }, [config?.entityChannel])

  const feedbackChannel: ChannelItem = useMemo(() => {
    const raw = config?.feedbackChannel
    if (!raw) return DEFAULT_FEEDBACK_CHANNEL
    return (raw as any).asMutable ? (raw as any).asMutable({ deep: true }) : { ...DEFAULT_FEEDBACK_CHANNEL, ...raw }
  }, [config?.feedbackChannel])

  /**
   * Sanitización de URLs para neutralizar ataques XSS basados en protocolos maliciosos (javascript:, data:)
   */
  const sanitizeUrl = useCallback((url?: string): string => {
    if (!url) return ''
    const trimmed = url.trim()
    if (/^(javascript|vbscript|data):/i.test(trimmed)) {
      return '#'
    }
    return trimmed
  }, [])

  /**
   * Apertura nativa de ventanas emergentes (dialogs) de ArcGIS Experience Builder
   */
  const handleOpenDialog = useCallback((dialogId: string, evt?: React.MouseEvent) => {
    if (!dialogId) return
    const cleanId = dialogId.trim()
    if (!cleanId) return

    try {
      const appStore = getAppStore()
      if (appStore) {
        const state = appStore.getState()
        const dialogConfigs = state?.appConfig?.dialogs || {}

        if (dialogConfigs[cleanId]) {
          appStore.dispatch(appActions.openDialog(cleanId))
        }

        const isClosedState = state?.widgetsRuntimeInfo?.[cleanId]?.isClosed
        if (isClosedState === true || isClosedState === undefined) {
          appStore.dispatch(appActions.closeDialog(cleanId))
          setTimeout(() => {
            appStore.dispatch(appActions.openDialog(cleanId))
          }, 40)
        }

        appStore.dispatch(appActions.activePagePartChanged(null))
      }

      if (jimuHistory && typeof (jimuHistory as any).changeDialog === 'function') {
        (jimuHistory as any).changeDialog(cleanId)
      }
    } catch (e) {
      console.warn('Error al activar la ventana:', e)
    }
  }, [])

  const renderCard = (channel: ChannelItem, isPrimary: boolean) => {
    const hasDialog = channel.targetType === 'window' && !!channel.dialogId && channel.dialogId.trim() !== ''
    const hasUrl = channel.targetType !== 'window' && !!channel.url && channel.url.trim() !== ''
    const btnClass = isPrimary ? 'calcite-btn-primary' : 'calcite-btn-secondary'

    return (
      <div key={channel.id} className="collab-card">
        {/* Cuerpo superior: título y descripción */}
        <div className="collab-card-body">
          <h4 className="collab-card-title">{channel.title}</h4>
          <p className="collab-card-desc">{channel.subtitle}</p>
        </div>

        {/* Botón ubicado debajo de todo */}
        <div className="collab-card-action">
          {hasDialog ? (
            <Link
              to={{
                linkType: LinkType.Dialog,
                value: channel.dialogId.trim()
              }}
              className={btnClass}
              onClick={(e) => handleOpenDialog(channel.dialogId, e)}
              title={channel.buttonText}
            >
              {channel.buttonText || (isPrimary ? 'Solicitar acceso' : 'Dejar opinión')}
            </Link>
          ) : hasUrl ? (
            <a
              href={sanitizeUrl(channel.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={btnClass}
              title={channel.buttonText}
            >
              {channel.buttonText || (isPrimary ? 'Solicitar acceso' : 'Dejar opinión')}
            </a>
          ) : (
            <button
              type="button"
              className={btnClass}
              onClick={() => {
                if (channel.dialogId) handleOpenDialog(channel.dialogId)
              }}
            >
              {channel.buttonText || (isPrimary ? 'Solicitar acceso' : 'Dejar opinión')}
            </button>
          )}
        </div>
      </div>
    )
  }

  const dynamicStyles = {
    '--widget-bg': themeColors.widgetBg || '#070c14',
    '--card-bg': themeColors.cardBg || '#0e1622',
    '--accent-color': themeColors.accentColor || '#007ac2',
    '--card-border': themeColors.cardBorder || '#1a2533'
  } as React.CSSProperties

  return (
    <div className="widget-ecosistema-colaboracion calcite-mode-dark" style={dynamicStyles}>
      <style dangerouslySetInnerHTML={{ __html: styleText }} />

      {/* LÍNEA SEPARADORA INSTITUCIONAL CON SEGMENTO AZUL */}
      {showDividerBar && <div className="portal-divider-bar" />}

      {/* CABECERA ÚNICA: UN SOLO TÍTULO Y DESCRIPCIÓN */}
      {(headerTitle || headerDescription) && (
        <div className="widget-header">
          {headerTitle && <h3 className="main-title">{headerTitle}</h3>}
          {headerDescription && <p className="main-desc">{headerDescription}</p>}
        </div>
      )}

      {/* CUADRÍCULA DE TARJETAS CONTIGUAS (UNA AL LADO DE LA OTRA) */}
      <div className="channels-grid">
        {renderCard(entityChannel, true)}
        {feedbackEnabled && renderCard(feedbackChannel, false)}
      </div>
    </div>
  )
}
