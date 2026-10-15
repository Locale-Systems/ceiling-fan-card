import { describe, expect, it } from "vitest";
import { fromFormData, toFormData } from "../src/editor-data";
import type { CeilingFanCardConfig } from "../src/types";

describe("editor config mapping", () => {
  it("round-trips a full config", () => {
    const config: CeilingFanCardConfig = {
      type: "custom:ceiling-fan-card",
      fan: "fan.bedroom",
      name: "Bedroom",
      show_direction: false,
      show_oscillation: false,
      lights: [
        { entity: "light.down", name: "Down", dimmable: true },
        { entity: "light.up", dimmable: false },
      ],
    };
    expect(fromFormData(toFormData(config))).toEqual(config);
  });

  it("keeps compact only when enabled", () => {
    const base = { type: "t", fan: "fan.a" };
    expect(toFormData(base).compact).toBe(false);
    expect(fromFormData(toFormData({ ...base, compact: true }))).toEqual({ ...base, compact: true });
    expect(fromFormData(toFormData(base))).toEqual(base);
  });

  it("splits lights into form groups with string dimmable values", () => {
    const data = toFormData({ type: "t", fan: "fan.a", lights: [{ entity: "light.a" }] });
    expect(data.light1).toEqual({ entity: "light.a", dimmable: "auto" });
    expect(data.light2).toEqual({ dimmable: "auto" });
    expect(data.show_direction).toBe(true);
    expect(data.show_oscillation).toBe(true);
  });

  it("drops empty lights, blank strings and default options", () => {
    const config = fromFormData({
      type: "t",
      fan: "fan.a",
      name: "",
      show_direction: true,
      show_oscillation: true,
      slider_turns_on: true,
      compact: false,
      light1: { dimmable: "auto" },
      light2: { entity: "light.b", name: "", dimmable: "auto" },
    });
    expect(config).toEqual({ type: "t", fan: "fan.a", lights: [{ entity: "light.b" }] });
  });
});
