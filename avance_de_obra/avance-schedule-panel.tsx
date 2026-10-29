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
  font-size: 12px;
  h4 { font-size: 12px; font-weight: 600; margin: 10px 0 4px; }
  .date { display: flex; align-items: center; gap: 6px; }
  .date input[type=date] { flex: 1; min-width: 0; }
  button { font-size: 12px; padding: 2px 8px; border-radius: 4px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
  button[aria-pressed=true] { background: rgba(78, 168, 255, 0.25); }
  input[type=range] { width: 100%; margin: 6px 0 2px; }
  .ends { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.7; }
  .row { display: flex; align-items: center; gap: 6px; margin: 6px 0; }
  .row select { flex: 1; min-width: 0; }
  label { display: flex; align-items: center; gap: 6px; margin: 3px 0; cursor: pointer; }
  .kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .kpi { border: 1px solid rgba(127, 140, 153, 0.35); border-radius: 5px; padding: 4px 6px; }
  .kpi small { display: block; font-size: 10px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.03em; }
  .kpi b { font-size: 17px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .kpi.bad b { color: #ef6464; }
  .kpi.good b { color: #44c58a; }
  .bar { display: flex; height: 8px; border-radius: 3px; overflow: hidden; margin: 4px 0 6px; background: rgba(127, 140, 153, 0.2); }
  .classes div { display: flex; align-items: center; gap: 6px; margin: 2px 0; }
  .classes span { flex: 1; }
  .classes b { font-weight: normal; opacity: 0.75; font-variant-numeric: tabular-nums; }
  .swatch { width: 10px; height: 10px; border-radius: 2px; flex: none; display: inline-block; }
  svg { width: 100%; height: 90px; display: block; }
  .hint { opacity: 0.75; margin: 6px 0 0; line-height: 1.35; }
`

export interface SchedulePanelProps {
  elements: Array<{ [field: string]: any }>
  cutoff: number
  onCutoffChange: (cutoff: number) => void
  buildUp: boolean
  onBuildUpChange: (on: boolean) => void
  hideUnscheduled: boolean
  onHideUnscheduledChange: (on: boolean) => void
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
  return (
    <div css={style} className="avance-schedule-panel">
      <div className="date">
        <input type="date" value={isoDay(cutoff)} min={isoDay(first)} max={isoDay(last)} aria-label="Fecha de corte" onChange={e => { const ms = Date.parse(e.target.value); if (!Number.isNaN(ms)) pick(ms) }} />
        <button type="button" onClick={() => { pick(today()) }}>Hoy</button>
      </div>
      <input type="range" min={first} max={last} step={DAY} value={Math.min(Math.max(cutoff, first), last)} aria-label="Fecha de corte" onChange={e => { pick(Number(e.target.value)) }} />
      <div className="ends"><span>{isoDay(first)}</span><span>{isoDay(last)}</span></div>
      <div className="row">
        <button type="button" onClick={play} aria-pressed={playing}>{playing ? '❚❚ Pausa' : '▶ Reproducir'}</button>
        <select value={step} aria-label="Paso de la reproducción" onChange={e => { setStep(Number(e.target.value)) }}>
          {STEPS.map(([days, label]) => <option key={days} value={days}>{label} por paso</option>)}
        </select>
      </div>
      <label><input type="checkbox" checked={props.buildUp} onChange={e => { props.onBuildUpChange(e.target.checked) }} />Mostrar la obra a la fecha (oculta lo que aún no inicia)</label>
      <label><input type="checkbox" checked={props.hideUnscheduled} onChange={e => { props.onHideUnscheduledChange(e.target.checked) }} />Ocultar elementos sin programación</label>

      <h4>Al {isoDay(cutoff)}</h4>
      <div className="kpis">
        <div className="kpi"><small>Programado</small><b>{number(kpis.planned, 1)} %</b></div>
        <div className="kpi good"><small>Real (último reporte)</small><b>{number(kpis.reported, 1)} %</b></div>
        <div className={`kpi ${gap > 0.05 ? 'bad' : 'good'}`}><small>{gap > 0.05 ? 'Atraso' : 'Adelanto'}</small><b>{number(Math.abs(gap), 1)} pts</b></div>
        <div className={`kpi ${kpis.counts.Atrasado ? 'bad' : 'good'}`}><small>Atrasados</small><b>{number(kpis.counts.Atrasado ?? 0)}</b></div>
      </div>

      <h4>Curva programada</h4>
      <svg viewBox="-2 -4 104 108" preserveAspectRatio="none" role="img" aria-label={`Curva de avance programado; al corte ${number(kpis.planned, 1)} %, real ${number(kpis.reported, 1)} %`}>
        <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        {curve && <polyline points={curve} fill="none" stroke="#4ea8ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
        <line x1={xOf(cutoff)} y1="0" x2={xOf(cutoff)} y2="100" stroke="#f2c94c" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <circle cx={xOf(today())} cy={100 - kpis.reported} r="2" fill="#44c58a" />
      </svg>
      <div className="ends"><span>Azul: programado · Verde: real hoy</span><span>Amarillo: corte</span></div>

      <h4>Cronograma · {number(kpis.scheduled)} de {number(total)} elementos con fechas</h4>
      <div className="bar" aria-hidden="true">
        {SCHEDULE.map(s => <i key={s.value} style={{ width: `${100 * (kpis.counts[s.value] ?? 0) / Math.max(total, 1)}%`, background: s.css }} />)}
      </div>
      <div className="classes">
        {SCHEDULE.map(s => (
          <div key={s.value} title={s.note}><i className="swatch" style={{ background: s.css }} /><span>{s.value}</span><b>{number(kpis.counts[s.value] ?? 0)}</b></div>
        ))}
      </div>
      <p className="hint">El programado sale de las fechas de actividad; el real es el último % reportado, así que antes de hoy compara el plan con lo que hay hoy.</p>
    </div>
  )
}
