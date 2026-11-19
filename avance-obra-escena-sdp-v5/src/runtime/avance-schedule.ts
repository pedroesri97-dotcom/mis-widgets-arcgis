// Schedule (4D) rules of the progress widget. The cut-off date lives in the app state under CUTOFF_STATE_KEY,
// so another widget of the experience can read or set it. Kept inside the widget so it installs as one folder.
export const CUTOFF_STATE_KEY = 'avance-4d'
export const DAY = 86400000

// Dates in avance-elements.json are UTC midnights (epoch ms), so cut-offs are handled as UTC days too.
export const toDay = (ms: number) => Math.floor(ms / DAY) * DAY
export const today = () => toDay(Date.now())
export const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10)

export const SCHEDULE = [
  { value: 'Construido', color: [68, 197, 138], css: '#44c58a', note: 'Terminado y con fin programado a la fecha' },
  { value: 'Atrasado', color: [239, 100, 100], css: '#ef6464', note: 'Fin programado vencido y avance menor a 100 %' },
  { value: 'En ejecución', color: [242, 201, 76], css: '#f2c94c', note: 'Entre el inicio y el fin programados' },
  { value: 'Inicia en 30 días', color: [78, 168, 255], css: '#4ea8ff', note: 'Inicio programado en los próximos 30 días' },
  { value: 'Más adelante', color: [96, 112, 128], css: '#607080', note: 'Inicio programado a más de 30 días' },
  { value: 'Sin programación', color: [154, 165, 177], css: '#9aa5b1', note: 'Sin fechas de actividad' }
]

interface Scheduled { FechaInicioDate?: number, FechaFinDate?: number, Avance?: number }

const span = (a: Scheduled): [number, number] | null => {
  const start = a.FechaInicioDate ?? a.FechaFinDate
  const end = a.FechaFinDate ?? a.FechaInicioDate
  return start == null ? null : [start, Math.max(start, end)]
}

// Class of an element at the cut-off date. Avance is the latest report, so an element finished ahead of its planned
// end only counts as built from the report date (today) on. Without an end date an unfinished element is never late.
export function scheduleClass (a: Scheduled, cutoff: number): string {
  const dates = span(a)
  if (!dates) return 'Sin programación'
  const [start, end] = dates
  const done = (a.Avance ?? 0) >= 100
  if (done && (end <= cutoff || cutoff >= today())) return 'Construido'
  if (end <= cutoff && a.FechaFinDate != null) return 'Atrasado'
  if (start <= cutoff) return 'En ejecución'
  return start - cutoff <= 30 * DAY ? 'Inicia en 30 días' : 'Más adelante'
}

// Share of the element's planned duration elapsed at the cut-off (0..1), or null without dates.
export function plannedFraction (a: Scheduled, cutoff: number): number | null {
  const dates = span(a)
  if (!dates) return null
  const [start, end] = dates
  if (cutoff >= end) return 1
  if (cutoff < start) return 0
  return (cutoff - start + DAY) / (end - start + DAY) // dates are inclusive days
}

// Where clause for «Mostrar la obra a la fecha» (hide what has not started) and «Ocultar sin programación»; null = all.
export function timelapseWhere (cutoff: number, buildUp: boolean, hideUnscheduled: boolean): string | null {
  const day = `timestamp '${isoDay(cutoff)} 00:00:00'`
  const started = `(FechaInicioDate <= ${day} OR (FechaInicioDate IS NULL AND FechaFinDate <= ${day}))`
  const unscheduled = '(FechaInicioDate IS NULL AND FechaFinDate IS NULL)'
  if (buildUp) return hideUnscheduled ? started : `(${started} OR ${unscheduled})`
  return hideUnscheduled ? `NOT ${unscheduled}` : null
}

// First and last scheduled day, for the cut-off slider.
export function scheduleRange (rows: Scheduled[]): [number, number] | null {
  let min = Infinity
  let max = -Infinity
  for (const a of rows) {
    const dates = span(a)
    if (!dates) continue
    min = Math.min(min, dates[0])
    max = Math.max(max, dates[1])
  }
  return min === Infinity ? null : [min, max]
}
