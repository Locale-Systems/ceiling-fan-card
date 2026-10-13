import { HassEntity, Dimmable } from "./types";
import { UNAVAILABLE_STATES } from "./const";

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const supportsFeature = (
  stateObj: HassEntity | undefined,
  feature: number,
): boolean => ((stateObj?.attributes.supported_features ?? 0) & feature) !== 0;

/** Whether a fan reports that it is oscillating (`oscillating` attribute). */
export const isOscillating = (stateObj: HassEntity | undefined): boolean =>
  stateObj?.attributes.oscillating === true;

export const isUnavailable = (stateObj: HassEntity | undefined): boolean =>
  !stateObj || UNAVAILABLE_STATES.includes(stateObj.state);

/**
 * The fan's percentage step. HA reports e.g. 33.333… for a 3-speed fan.
 * Falls back to 1 (continuous) when missing or invalid.
 */
export const fanPercentageStep = (stateObj: HassEntity | undefined): number => {
  const step = Number(stateObj?.attributes.percentage_step);
  return Number.isFinite(step) && step > 0 && step <= 100 ? step : 1;
};

/** Number of discrete speeds (excluding off). */
export const fanSpeedCount = (step: number): number =>
  Math.max(1, Math.round(100 / step));

/** Snap an arbitrary percentage to the nearest non-zero speed step. */
export const snapPercentage = (percentage: number, step: number): number => {
  const count = fanSpeedCount(step);
  const index = clamp(Math.round(percentage / step), 1, count);
  return percentageForSpeed(index, step);
};

/** 1-based speed index for a percentage (0 when off / 0%). */
export const speedForPercentage = (percentage: number, step: number): number => {
  if (percentage <= 0) return 0;
  return clamp(Math.round(percentage / step), 1, fanSpeedCount(step));
};

/** Percentage for a 1-based speed index; the top speed is always exactly 100. */
export const percentageForSpeed = (index: number, step: number): number => {
  const count = fanSpeedCount(step);
  if (index >= count) return 100;
  return Math.round(index * step * 100) / 100;
};

/** Brightness 0–255 → percent 1–100 (0 when off/missing). */
export const brightnessToPct = (brightness: number | undefined): number =>
  brightness ? clamp(Math.round((brightness / 255) * 100), 1, 100) : 0;

export const isDimmable = (
  stateObj: HassEntity | undefined,
  setting: Dimmable = "auto",
): boolean => {
  if (setting !== "auto") return setting;
  if (!stateObj) return false;
  const modes: string[] | undefined = stateObj.attributes.supported_color_modes;
  if (Array.isArray(modes) && modes.length) {
    return modes.some((m) => m !== "onoff");
  }
  // Legacy lights: brightness attribute present implies dimmable.
  return stateObj.attributes.brightness !== undefined;
};

export const friendlyName = (
  stateObj: HassEntity | undefined,
  fallback: string,
): string => stateObj?.attributes.friendly_name ?? fallback;

export const fireEvent = (
  node: HTMLElement,
  type: string,
  detail?: unknown,
): void => {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
};
