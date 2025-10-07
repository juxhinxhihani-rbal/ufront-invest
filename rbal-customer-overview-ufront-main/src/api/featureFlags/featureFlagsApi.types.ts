export interface Flag {
  feature: Feature;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  enabled: boolean;
  value: string | undefined;
}

export interface Feature {
  id: number;
  name: string | undefined;
}
