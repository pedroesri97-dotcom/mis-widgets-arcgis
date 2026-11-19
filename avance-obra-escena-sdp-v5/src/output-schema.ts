// Schema of the widget's output data source: one record per Revit element, columns of avance-elements.json.
// Shared by the setting (which registers the data source in the app config) and the runtime (which fills it).
import { DataSourceTypes, EsriFieldType, JimuFieldType, type DataSourceJson, type FieldSchema } from 'jimu-core'

export const ID_FIELD = 'OBJECTID'

// [name, alias, kind]; names match the scene layer fields so the 3D view and the table describe the same element.
const COLUMNS: Array<[string, string, 'oid' | 'number' | 'string' | 'date']> = [
  [ID_FIELD, 'OBJECTID', 'oid'],
  ['OID', 'ObjectID en la capa de escena', 'number'],
  ['Seccion', 'Sección', 'string'],
  ['EstadoAvance', 'Estado de avance', 'string'],
  ['Avance', 'Avance (%)', 'number'],
  ['Actividad', 'Actividad', 'string'],
  ['ActividadNombre', 'Nombre de actividad', 'string'],
  ['Contratista', 'Contratista', 'string'],
  ['Categoria', 'Categoría Revit', 'string'],
  ['Nivel', 'Nivel', 'string'],
  ['Disciplina', 'Disciplina', 'string'],
  ['Modelo', 'Modelo Revit', 'string'],
  ['UE', 'Unidad de ejecución', 'string'],
  ['Family', 'Familia', 'string'],
  ['Type', 'Tipo', 'string'],
  ['IfcGUID', 'IfcGUID', 'string'],
  ['ExtId', 'ID de Revit', 'string'],
  ['FechaInicio', 'Inicio (texto)', 'string'],
  ['FechaFin', 'Fin (texto)', 'string'],
  ['FechaInicioDate', 'Inicio', 'date'],
  ['FechaFinDate', 'Fin', 'date'],
  ['z', 'Cota base (m)', 'number']
]

const TYPES = {
  oid: [JimuFieldType.Number, EsriFieldType.OID],
  number: [JimuFieldType.Number, EsriFieldType.Double],
  string: [JimuFieldType.String, EsriFieldType.String],
  date: [JimuFieldType.Date, EsriFieldType.Date]
} as const

export const FIELD_NAMES = COLUMNS.map(([name]) => name)

export function outputDataSourceJson (widgetId: string, label: string): DataSourceJson {
  const fields: { [jimuName: string]: FieldSchema } = {}
  for (const [name, alias, kind] of COLUMNS) {
    const [type, esriType] = TYPES[kind]
    fields[name] = { jimuName: name, name, alias, type, esriType }
  }
  return {
    id: `${widgetId}_output`,
    type: DataSourceTypes.FeatureLayer,
    label,
    isOutputFromWidget: true,
    isDataInDataSourceInstance: true, // the records live in the browser; no service, no portal item
    schema: { label, idField: ID_FIELD, fields }
  } as DataSourceJson
}
