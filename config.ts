import { ImmutableObject } from 'jimu-core';

export interface Config {
  title?: string;
  titleHighlight?: string;
  defaultExpandedGroup?: string;
}

export type IMConfig = ImmutableObject<Config>;
