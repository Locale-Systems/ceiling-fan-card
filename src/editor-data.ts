import { MAX_LIGHTS } from "./const";
import type { CeilingFanCardConfig, LightConfig } from "./types";

export type DimmableOption = "auto" | "true" | "false";

export interface LightFormData {
  entity?: string;
  name?: string;
  icon?: string;
  dimmable?: DimmableOption;
}

/** Flat shape handed to <ha-form>; lights are split into light1/light2 groups. */
export interface FormData extends Omit<CeilingFanCardConfig, "lights"> {
  [key: `light${number}`]: LightFormData;
}

export const toFormData = (config: CeilingFanCardConfig): FormData => {
  const { lights = [], ...rest } = config;
  const data: FormData = {
    show_direction: true,
    show_oscillation: true,
    slider_turns_on: true,
    ...rest,
  };
  for (let i = 0; i < MAX_LIGHTS; i++) {
    const light = lights[i];
    data[`light${i + 1}`] = light
      ? {
          ...light,
          dimmable: String(light.dimmable ?? "auto") as DimmableOption,
        }
      : { dimmable: "auto" };
  }
  return data;
};

export const fromFormData = (data: FormData): CeilingFanCardConfig => {
  const config: Record<string, unknown> = {};
  const lights: LightConfig[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (/^light\d+$/.test(key)) continue;
    if (value !== "" && value !== undefined) config[key] = value;
  }
  for (let i = 1; i <= MAX_LIGHTS; i++) {
    const form = data[`light${i}`];
    if (!form?.entity) continue;
    const light: LightConfig = { entity: form.entity };
    if (form.name) light.name = form.name;
    if (form.icon) light.icon = form.icon;
    if (form.dimmable === "true") light.dimmable = true;
    else if (form.dimmable === "false") light.dimmable = false;
    lights.push(light);
  }
  if (lights.length) config.lights = lights;
  // Keep YAML tidy: drop options that match their defaults.
  if (config.show_direction === true) delete config.show_direction;
  if (config.show_oscillation === true) delete config.show_oscillation;
  if (config.slider_turns_on === true) delete config.slider_turns_on;
  return config as unknown as CeilingFanCardConfig;
};
