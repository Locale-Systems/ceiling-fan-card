export const CARD_VERSION = "0.2.0";
export const CARD_TYPE = "ceiling-fan-card";
export const EDITOR_TYPE = "ceiling-fan-card-editor";

/** Mirrors homeassistant.components.fan.FanEntityFeature */
export const FanEntityFeature = {
  SET_SPEED: 1,
  OSCILLATE: 2,
  DIRECTION: 4,
  PRESET_MODE: 8,
  TURN_OFF: 16,
  TURN_ON: 32,
} as const;

export const MAX_LIGHTS = 2;

/** How long local slider values override incoming state after release. */
export const OPTIMISTIC_HOLD_MS = 1500;

export const UNAVAILABLE_STATES = ["unavailable", "unknown"];
