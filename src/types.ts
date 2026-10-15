export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
  themes?: { darkMode?: boolean };
  locale?: { language: string };
}

export type Dimmable = "auto" | boolean;

export interface LightConfig {
  entity: string;
  name?: string;
  icon?: string;
  dimmable?: Dimmable;
}

export interface CeilingFanCardConfig {
  type: string;
  fan: string;
  name?: string;
  icon?: string;
  show_direction?: boolean;
  show_oscillation?: boolean;
  slider_turns_on?: boolean;
  compact?: boolean;
  lights?: LightConfig[];
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
