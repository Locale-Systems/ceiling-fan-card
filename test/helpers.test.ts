import { describe, expect, it } from "vitest";
import {
  brightnessToPct,
  fanPercentageStep,
  fanSpeedCount,
  isDimmable,
  isOscillating,
  isUnavailable,
  percentageForSpeed,
  snapPercentage,
  speedForPercentage,
  supportsFeature,
} from "../src/helpers";
import { FanEntityFeature } from "../src/const";
import type { HassEntity } from "../src/types";

const entity = (state: string, attributes: Record<string, unknown> = {}): HassEntity => ({
  entity_id: "x.y",
  state,
  attributes,
});

const THREE_SPEED = 100 / 3;

describe("fan speed math", () => {
  it("reads percentage_step with a continuous fallback", () => {
    expect(fanPercentageStep(entity("on", { percentage_step: THREE_SPEED }))).toBeCloseTo(33.33, 2);
    expect(fanPercentageStep(entity("on"))).toBe(1);
    expect(fanPercentageStep(entity("on", { percentage_step: 0 }))).toBe(1);
  });

  it("counts speeds", () => {
    expect(fanSpeedCount(THREE_SPEED)).toBe(3);
    expect(fanSpeedCount(100 / 6)).toBe(6);
    expect(fanSpeedCount(1)).toBe(100);
  });

  it("snaps to non-zero steps and pins the top speed to 100", () => {
    expect(snapPercentage(0, THREE_SPEED)).toBeCloseTo(33.33, 2);
    expect(snapPercentage(50, THREE_SPEED)).toBeCloseTo(66.67, 2);
    expect(snapPercentage(95, THREE_SPEED)).toBe(100);
    expect(snapPercentage(42.4, 1)).toBe(42);
  });

  it("maps between speed index and percentage", () => {
    expect(speedForPercentage(0, THREE_SPEED)).toBe(0);
    expect(speedForPercentage(33, THREE_SPEED)).toBe(1);
    expect(speedForPercentage(67, THREE_SPEED)).toBe(2);
    expect(speedForPercentage(100, THREE_SPEED)).toBe(3);
    expect(percentageForSpeed(3, THREE_SPEED)).toBe(100);
    expect(percentageForSpeed(1, 25)).toBe(25);
  });
});

describe("feature and availability checks", () => {
  it("tests supported_features bits", () => {
    const fan = entity("on", { supported_features: FanEntityFeature.SET_SPEED | FanEntityFeature.DIRECTION });
    expect(supportsFeature(fan, FanEntityFeature.SET_SPEED)).toBe(true);
    expect(supportsFeature(fan, FanEntityFeature.DIRECTION)).toBe(true);
    expect(supportsFeature(fan, FanEntityFeature.OSCILLATE)).toBe(false);
    expect(supportsFeature(undefined, FanEntityFeature.SET_SPEED)).toBe(false);
  });

  it("detects oscillation support and state", () => {
    const fan = entity("on", { supported_features: FanEntityFeature.SET_SPEED | FanEntityFeature.OSCILLATE, oscillating: true });
    expect(supportsFeature(fan, FanEntityFeature.OSCILLATE)).toBe(true);
    expect(supportsFeature(fan, FanEntityFeature.DIRECTION)).toBe(false);
    expect(isOscillating(fan)).toBe(true);
    expect(isOscillating(entity("on", { oscillating: false }))).toBe(false);
    expect(isOscillating(entity("on"))).toBe(false);
    expect(isOscillating(undefined)).toBe(false);
  });

  it("treats missing, unavailable and unknown as unavailable", () => {
    expect(isUnavailable(undefined)).toBe(true);
    expect(isUnavailable(entity("unavailable"))).toBe(true);
    expect(isUnavailable(entity("unknown"))).toBe(true);
    expect(isUnavailable(entity("off"))).toBe(false);
  });
});

describe("lights", () => {
  it("auto-detects dimmable lights from color modes", () => {
    expect(isDimmable(entity("on", { supported_color_modes: ["brightness"] }))).toBe(true);
    expect(isDimmable(entity("on", { supported_color_modes: ["color_temp", "hs"] }))).toBe(true);
    expect(isDimmable(entity("on", { supported_color_modes: ["onoff"] }))).toBe(false);
    expect(isDimmable(entity("on", { brightness: 128 }))).toBe(true);
    expect(isDimmable(entity("on"))).toBe(false);
    expect(isDimmable(undefined)).toBe(false);
  });

  it("honours explicit dimmable overrides", () => {
    const onoff = entity("on", { supported_color_modes: ["onoff"] });
    expect(isDimmable(onoff, true)).toBe(true);
    expect(isDimmable(entity("on", { supported_color_modes: ["brightness"] }), false)).toBe(false);
  });

  it("converts brightness to percent", () => {
    expect(brightnessToPct(255)).toBe(100);
    expect(brightnessToPct(128)).toBe(50);
    expect(brightnessToPct(1)).toBe(1);
    expect(brightnessToPct(0)).toBe(0);
    expect(brightnessToPct(undefined)).toBe(0);
  });
});
