import { ImmutableObject } from 'jimu-core';

export interface Config {
  title?: string;
  subtitle?: string;
  showLiveBadge?: boolean;
  showStats?: boolean;
}

export type IMConfig = ImmutableObject<Config>;
