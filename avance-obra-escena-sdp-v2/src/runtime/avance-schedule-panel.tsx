/** @jsxRuntime classic */
/** @jsx jsx */
// Schedule (4D) controls of the progress panel: cut-off date with playback, planned vs. reported progress,
// planned S-curve and breakdown by schedule class. The host owns the cut-off and the timelapse options and decides
// how to apply them.
import { React, jsx, css } from 'jimu-core'
import { DAY, SCHEDULE, isoDay, plannedFraction, scheduleClass, scheduleRange, today, toDay } from './avance-schedule'

const STEPS = [[1, '1 día'], [7, '1 semana'], [30, '1 mes']] as const
const FRAME_MS = 700
const CURVE_POINTS = 80
const number = (value: number, digits = 0) => Number(value).toLocaleString('es-CO', { maximumFractionDigits: digits, minimumFractionDigits: digits })

const style = css`
  font-size: 11px;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    font-size: 10px;
    font-weight: 700;
    color: var(--calcite-accent, #00b4d8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 6px 0 2px;
  }

  .date {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .date input[type=date] {
    flex: 1;
    min-width: 0;
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 2px;
    color: #ffffff;
    font-family: inherit;
    font-size: 11px;
    padding: 5px 8px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
  }
  .date input[type=date]:focus {
    border-color: var(--calcite-primary, #0284c7);
  }

  button {
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 2px;
    border: 1px solid #243447;
    background: #1e293b;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  button:hover {
    background: #243447;
    border-color: #3b4d63;
  }
  button[aria-pressed=true] {
    background: var(--calcite-primary, #0284c7);
    border-color: var(--calcite-primary, #0284c7);
    color: #ffffff;
  }

  .btn-play {
    background: var(--calcite-primary, #0284c7);
    border-color: var(--calcite-primary, #0284c7);
    color: #ffffff;
  }
  .btn-play:hover {
    filter: brightness(1.1);
  }

  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: #1e293b;
    outline: none;
    cursor: pointer;
    margin: 4px 0 2px;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid var(--calcite-primary, #0284c7);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.1s ease;
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type=range]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid var(--calcite-primary, #0284c7);
    cursor: pointer;
  }

  .ends {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    font-weight: 500;
    color: #64748b;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 2px 0;
  }
  .row select {
    flex: 1;
    min-width: 0;
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 2px;
    color: #ffffff;
    font-family: inherit;
    font-size: 11px;
    padding: 5px 8px;
    outline: none;
    cursor: pointer;
  }
  .row select:focus {
    border-color: var(--calcite-primary, #0284c7);
  }

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 2px 0;
    cursor: pointer;
    font-size: 11px;
    color: #cbd5e1;
    user-select: none;
  }
  label input[type=checkbox] {
    accent-color: var(--calcite-primary, #0284c7);
    width: 13px;
    height: 13px;
    cursor: pointer;
  }

  .kpis {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .kpi {
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 3px;
    padding: 6px 8px;
    box-sizing: border-box;
  }
  .kpi small {
    display: block;
    font-size: 9px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }
  .kpi b {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  }
  .kpi.bad b {
    color: #f43f5e;
  }
  .kpi.good b {
    color: #34d399;
  }

  .chart-container {
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 3px;
    padding: 6px;
    box-sizing: border-box;
  }
  svg {
    width: 100%;
    height: 80px;
    display: block;
  }

  .bar {
    display: flex;
    height: 5px;
    border-radius: 2px;
    overflow: hidden;
    margin: 4px 0 6px;
    background: #1e293b;
  }

  .classes {
    background: #111822;
    border: 1px solid #1e293b;
    border-radius: 3px;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .classes div {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #94a3b8;
  }
  .classes span {
    flex: 1;
  }
  .classes b {
    font-weight: 600;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
  }

  .swatch {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    flex: none;
    display: inline-block;
  }
`

export interface SchedulePanelProps {
  elements: Array<{ [field: string]: any }>
  cutoff: number
  onCutoffChange: (cutoff: number) => void
  buildUp: boolean
  onBuildUpChange: (on: boolean) => void
  hideUnscheduled: boolean
  onHideUnscheduledChange: (on: boolean) => void
  accentColor?: string
  primaryColor?: string
  colorCurvaProgramada?: string
  colorFechaCorte?: string
  colorRealHoy?: string
}

export function SchedulePanel (props: SchedulePanelProps) {
  const { elements, cutoff, onCutoffChange } = props
  const [step, setStep] = React.useState<number>(7)
  const [playing, setPlaying] = React.useState(false)

  // Slider from the first scheduled day to the later of the last scheduled day and today.
  const [first, last] = React.useMemo(() => {
    const range = scheduleRange(elements)
    return range ? [range[0], Math.max(range[1], today())] : [today() - 365 * DAY, today()]
  }, [elements])

  // Timelapse: one step per frame until the last day.
  const latest = React.useRef(cutoff)
  latest.current = cutoff
  React.useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => {
      const next = Math.min(latest.current + step * DAY, last)
      onCutoffChange(next)
      if (next >= last) setPlaying(false)
    }, FRAME_MS)
    return () => { clearInterval(timer) }
  }, [playing, step, last, onCutoffChange])

  const play = () => {
    if (!playing && cutoff >= last) onCutoffChange(first)
    setPlaying(!playing)
  }
  const pick = (ms: number) => { setPlaying(false); onCutoffChange(toDay(ms)) }

  const kpis = React.useMemo(() => {
    const counts: { [value: string]: number } = {}
    let scheduled = 0
    let planned = 0
    let reported = 0
    for (const a of elements) {
      const value = scheduleClass(a, cutoff)
      counts[value] = (counts[value] ?? 0) + 1
      const fraction = plannedFraction(a, cutoff)
      if (fraction == null) continue
      scheduled++
      planned += fraction
      reported += Math.min(Math.max(a.Avance ?? 0, 0), 100) / 100
    }
    return { counts, scheduled, planned: scheduled ? 100 * planned / scheduled : 0, reported: scheduled ? 100 * reported / scheduled : 0 }
  }, [elements, cutoff])

  // Planned S-curve over the slider range; the reported value is a single point at today (the report date).
  const curve = React.useMemo(() => {
    const scheduled = elements.filter(a => a.FechaInicioDate != null || a.FechaFinDate != null)
    if (!scheduled.length) return ''
    const points: string[] = []
    for (let i = 0; i <= CURVE_POINTS; i++) {
      const day = first + (last - first) * i / CURVE_POINTS
      const mean = scheduled.reduce((sum, a) => sum + plannedFraction(a, day), 0) / scheduled.length
      points.push(`${(100 * i / CURVE_POINTS).toFixed(2)},${(100 - 100 * mean).toFixed(2)}`)
    }
    return points.join(' ')
  }, [elements, first, last])
  const xOf = (day: number) => last > first ? 100 * (day - first) / (last - first) : 0

  const gap = kpis.planned - kpis.reported
  const total = elements.length

  const accent = props.accentColor || '#00b4d8'
  const primary = props.primaryColor || '#0284c7'
  const curvaColor = props.colorCurvaProgramada || '#00b4d8'
  const corteColor = props.colorFechaCorte || '#fbbf24'
  const realColor = props.colorRealHoy || '#34d399'

  return (
    <div
      css={style}
      className="avance-schedule-panel"
      style={{
        '--calcite-accent': accent,
        '--calcite-primary': primary
      } as React.CSSProperties}
    >
      <div className="date">
        <input
          type="date"
          value={isoDay(cutoff)}
          min={isoDay(first)}
          max={isoDay(last)}
          aria-label="Fecha de corte"
          onChange={e => { const ms = Date.parse(e.target.value); if (!Number.isNaN(ms)) pick(ms) }}
        />
        <button type="button" onClick={() => { pick(today()) }}>Hoy</button>
      </div>

      <input
        type="range"
        min={first}
        max={last}
        step={DAY}
        value={Math.min(Math.max(cutoff, first), last)}
        aria-label="Fecha de corte"
        onChange={e => { pick(Number(e.target.value)) }}
      />
      <div className="ends"><span>{isoDay(first)}</span><span>{isoDay(last)}</span></div>

      <div className="row">
        <button type="button" className="btn-play" onClick={play} aria-pressed={playing}>
          {playing ? '❚❚ Pausa' : '▶ Reproducir'}
        </button>
        <select value={step} aria-label="Paso de la reproducción" onChange={e => { setStep(Number(e.target.value)) }}>
          {STEPS.map(([days, label]) => <option key={days} value={days}>{label} por paso</option>)}
        </select>
      </div>

      <label>
        <input type="checkbox" checked={props.buildUp} onChange={e => { props.onBuildUpChange(e.target.checked) }} />
        <span>Mostrar la obra a la fecha (oculta lo que aún no inicia)</span>
      </label>
      <label>
        <input type="checkbox" checked={props.hideUnscheduled} onChange={e => { props.onHideUnscheduledChange(e.target.checked) }} />
        <span>Ocultar elementos sin programación</span>
      </label>

      <h4>Al {isoDay(cutoff)}</h4>
      <div className="kpis">
        <div className="kpi"><small>Programado</small><b style={{ color: curvaColor }}>{number(kpis.planned, 1)} %</b></div>
        <div className="kpi good"><small>Real (reporte)</small><b style={{ color: realColor }}>{number(kpis.reported, 1)} %</b></div>
        <div className={`kpi ${gap > 0.05 ? 'bad' : 'good'}`}><small>{gap > 0.05 ? 'Atraso' : 'Adelanto'}</small><b>{number(Math.abs(gap), 1)} pts</b></div>
        <div className={`kpi ${kpis.counts.Atrasado ? 'bad' : 'good'}`}><small>Atrasados</small><b>{number(kpis.counts.Atrasado ?? 0)}</b></div>
      </div>

      <h4>Curva programada</h4>
      <div className="chart-container">
        <svg viewBox="-2 -4 104 108" preserveAspectRatio="none" role="img" aria-label={`Curva de avance programado; al corte ${number(kpis.planned, 1)} %, real ${number(kpis.reported, 1)} %`}>
          <line x1="0" y1="100" x2="100" y2="100" stroke="#1e293b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="0" x2="100" y2="0" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          {curve && <polyline points={curve} fill="none" stroke={curvaColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />}
          <line x1={xOf(cutoff)} y1="0" x2={xOf(cutoff)} y2="100" stroke={corteColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx={xOf(today())} cy={100 - kpis.reported} r="2.5" fill={realColor} />
        </svg>
      </div>

      <h4>Cronograma · {number(kpis.scheduled)} de {number(total)} elementos</h4>
      <div className="bar" aria-hidden="true">
        {SCHEDULE.map(s => <i key={s.value} style={{ width: `${100 * (kpis.counts[s.value] ?? 0) / Math.max(total, 1)}%`, background: s.css }} />)}
      </div>
      <div className="classes">
        {SCHEDULE.map(s => (
          <div key={s.value} title={s.note}><i className="swatch" style={{ background: s.css }} /><span>{s.value}</span><b>{number(kpis.counts[s.value] ?? 0)}</b></div>
        ))}
      </div>
    </div>
  )
}
