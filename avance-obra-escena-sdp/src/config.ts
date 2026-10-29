import type { ImmutableObject } from 'jimu-core'

export interface Config {
  /** Base URL of /data/avance-elements.json and /predial-station-footprints.json: the published site
   *  (dureyes97.github.io/avance-plmb) or the local arcgis-poc/serve.mjs. */
  serverUrl: string
}

export type IMConfig = ImmutableObject<Config>
