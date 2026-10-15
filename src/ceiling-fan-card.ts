import { LitElement, html, nothing, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import "./big-slider";
import "./editor";
import { cardStyles } from "./styles";
import {
  CARD_TYPE,
  CARD_VERSION,
  COMPACT_MAX_SPEED_BUTTONS,
  EDITOR_TYPE,
  FanEntityFeature,
  MAX_LIGHTS,
  OPTIMISTIC_HOLD_MS,
} from "./const";
import {
  brightnessToPct,
  fanPercentageStep,
  fanSpeedCount,
  fireEvent,
  friendlyName,
  isDimmable,
  isOscillating,
  isUnavailable,
  percentageForSpeed,
  snapPercentage,
  speedForPercentage,
  supportsFeature,
} from "./helpers";
import type { CeilingFanCardConfig, HassEntity, HomeAssistant, LightConfig } from "./types";

/** Everything the fan renderers need, computed once from state + config. */
interface FanView {
  fan: HassEntity;
  name: string;
  icon: string;
  unavailable: boolean;
  isOn: boolean;
  /** A speed change was just sent and the fan hasn't reported back yet. */
  pending: boolean;
  step: number;
  speeds: number;
  speed: number;
  displayPct: number;
  speedLabel: string;
  stateText: string;
  spinDuration: string;
  direction: string | undefined;
  canSetSpeed: boolean;
  canDirection: boolean;
  canOscillate: boolean;
  oscillating: boolean;
}

interface LightView {
  config: LightConfig;
  stateObj: HassEntity;
  name: string;
  icon: string;
  unavailable: boolean;
  isOn: boolean;
  dimmable: boolean;
  displayPct: number;
  stateText: string;
  colorStyle: ReturnType<typeof styleMap>;
}

interface Optimistic {
  value: number;
  /** Timestamp after which the real state wins again; Infinity while dragging. */
  until: number;
}

console.info(
  `%c CEILING-FAN-CARD %c v${CARD_VERSION} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);

@customElement(CARD_TYPE)
export class CeilingFanCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: CeilingFanCardConfig;

  /** Local slider values keyed by entity_id, shown instead of state while fresh. */
  @state() private _optimistic: Record<string, Optimistic> = {};
  /** Last non-zero value seen per entity, so an "off" slider keeps a sensible position. */
  private _lastValue: Record<string, number> = {};
  private _holdTimers: Record<string, number> = {};

  static styles = cardStyles;

  // ---- Lovelace API --------------------------------------------------------

  public setConfig(config: CeilingFanCardConfig): void {
    if (!config?.fan) {
      throw new Error("You must define a fan entity (fan: fan.xyz)");
    }
    if (config.fan.split(".")[0] !== "fan") {
      throw new Error(`"${config.fan}" is not a fan entity`);
    }
    if (config.lights !== undefined && !Array.isArray(config.lights)) {
      throw new Error("lights must be a list");
    }
    if ((config.lights?.length ?? 0) > MAX_LIGHTS) {
      throw new Error(`At most ${MAX_LIGHTS} lights are supported`);
    }
    config.lights?.forEach((light, i) => {
      if (!light?.entity) throw new Error(`lights[${i}] is missing an entity`);
    });
    this._config = {
      show_direction: true,
      show_oscillation: true,
      slider_turns_on: true,
      compact: false,
      ...config,
      lights: config.lights ?? [],
    };
  }

  public getCardSize(): number {
    const lights = this._config?.lights ?? [];
    // Card size units are ~50px; compact rows are 40px.
    if (this._config?.compact) return 2 + Math.ceil(lights.length * 0.8);
    let size = 3; // header + slider
    if (this._config?.show_direction || this._config?.show_oscillation) size += 1;
    for (const light of lights) {
      size += isDimmable(this.hass?.states[light.entity], light.dimmable) ? 2 : 1;
    }
    return size;
  }

  public getGridOptions() {
    // No `rows`: the card sizes to its content in sections dashboards.
    return { columns: 12, min_columns: 6 };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TYPE);
  }

  public static getStubConfig(hass: HomeAssistant): Partial<CeilingFanCardConfig> {
    const ids = Object.keys(hass.states);
    const fan = ids.find((id) => id.startsWith("fan.")) ?? "fan.ceiling_fan";
    const light = ids.find((id) => id.startsWith("light."));
    return { fan, lights: light ? [{ entity: light }] : [] };
  }

  // ---- Lifecycle -----------------------------------------------------------

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has("hass") || !this._config) return true;
    const oldHass = changed.get("hass") as HomeAssistant | undefined;
    if (!oldHass || !this.hass) return true;
    return this._entityIds().some((id) => oldHass.states[id] !== this.hass!.states[id]);
  }

  protected willUpdate(): void {
    if (!this.hass || !this._config) return;
    // Remember last "on" values so the slider doesn't jump to the start when off.
    const fan = this.hass.states[this._config.fan];
    if (fan?.state === "on" && fan.attributes.percentage > 0) {
      this._lastValue[this._config.fan] = fan.attributes.percentage;
    }
    for (const light of this._config.lights ?? []) {
      const pct = brightnessToPct(this.hass.states[light.entity]?.attributes.brightness);
      if (pct > 0) this._lastValue[light.entity] = pct;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    Object.values(this._holdTimers).forEach((t) => clearTimeout(t));
    this._holdTimers = {};
  }

  private _entityIds(): string[] {
    if (!this._config) return [];
    return [this._config.fan, ...(this._config.lights ?? []).map((l) => l.entity)];
  }

  // ---- Optimistic slider state --------------------------------------------

  private _optimisticValue(entityId: string): number | undefined {
    const entry = this._optimistic[entityId];
    return entry && entry.until > Date.now() ? entry.value : undefined;
  }

  private _setOptimistic(entityId: string, value: number, dragging: boolean): void {
    clearTimeout(this._holdTimers[entityId]);
    const until = dragging ? Infinity : Date.now() + OPTIMISTIC_HOLD_MS;
    this._optimistic = { ...this._optimistic, [entityId]: { value, until } };
    if (!dragging) {
      this._holdTimers[entityId] = window.setTimeout(() => {
        const { [entityId]: _, ...rest } = this._optimistic;
        this._optimistic = rest;
      }, OPTIMISTIC_HOLD_MS);
    }
  }

  // ---- Service calls -------------------------------------------------------

  private _call(domain: string, service: string, data: Record<string, unknown>): void {
    this.hass?.callService(domain, service, data).catch((err: unknown) => {
      console.error(`ceiling-fan-card: ${domain}.${service} failed`, err);
    });
  }

  private _toggleFan(): void {
    const fan = this._fanState();
    if (!fan || isUnavailable(fan)) return;
    this._call("fan", fan.state === "on" ? "turn_off" : "turn_on", {
      entity_id: fan.entity_id,
    });
  }

  private _fanSliderChanging(ev: CustomEvent<{ value: number }>): void {
    this._setOptimistic(this._config!.fan, ev.detail.value, true);
  }

  private _fanSliderChanged(ev: CustomEvent<{ value: number }>): void {
    this._setFanPercentage(ev.detail.value);
  }

  private _sliderCancelled(entityId: string): void {
    clearTimeout(this._holdTimers[entityId]);
    const { [entityId]: _, ...rest } = this._optimistic;
    this._optimistic = rest;
  }

  private _setFanPercentage(value: number): void {
    const fan = this._fanState();
    if (!fan) return;
    const percentage = snapPercentage(value, fanPercentageStep(fan));
    this._setOptimistic(fan.entity_id, percentage, false);
    if (fan.state === "on") {
      this._call("fan", "set_percentage", { entity_id: fan.entity_id, percentage });
    } else {
      // turn_on with a percentage powers up directly at the chosen speed.
      this._call("fan", "turn_on", { entity_id: fan.entity_id, percentage });
    }
  }

  private _setDirection(direction: "forward" | "reverse"): void {
    const fan = this._fanState();
    if (!fan || fan.attributes.direction === direction) return;
    this._call("fan", "set_direction", { entity_id: fan.entity_id, direction });
  }

  private _toggleDirection(): void {
    const fan = this._fanState();
    if (!fan || isUnavailable(fan)) return;
    this._setDirection(fan.attributes.direction === "reverse" ? "forward" : "reverse");
  }

  private _toggleOscillation(): void {
    const fan = this._fanState();
    // RF fans may ignore an oscillate command while off, but HA would still
    // flip the assumed state - so only allow it while the fan runs.
    if (!fan || isUnavailable(fan) || fan.state !== "on") return;
    this._call("fan", "oscillate", {
      entity_id: fan.entity_id,
      oscillating: !isOscillating(fan),
    });
  }

  private _toggleLight(entityId: string): void {
    const light = this.hass?.states[entityId];
    if (!light || isUnavailable(light)) return;
    this._call("light", light.state === "on" ? "turn_off" : "turn_on", {
      entity_id: entityId,
    });
  }

  private _lightSliderChanging(entityId: string, ev: CustomEvent<{ value: number }>): void {
    this._setOptimistic(entityId, ev.detail.value, true);
  }

  private _lightSliderChanged(entityId: string, ev: CustomEvent<{ value: number }>): void {
    const brightness_pct = Math.round(ev.detail.value);
    this._setOptimistic(entityId, brightness_pct, false);
    this._call("light", "turn_on", { entity_id: entityId, brightness_pct });
  }

  private _moreInfo(entityId: string): void {
    fireEvent(this, "hass-more-info", { entityId });
  }

  // ---- Rendering -----------------------------------------------------------

  private _fanState(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.fan] : undefined;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    return html`
      <ha-card class=${this._config.compact ? "compact" : ""}>
        ${this._renderFan()}
        ${(this._config.lights ?? []).map((light) => this._renderLight(light))}
      </ha-card>
    `;
  }

  private _renderWarning(entityId: string): TemplateResult {
    return html`<div class="section">
      <div class="warning">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        Entity not found: ${entityId}
      </div>
    </div>`;
  }

  private _fanView(fan: HassEntity): FanView {
    const config = this._config!;
    const unavailable = isUnavailable(fan);
    const isOn = fan.state === "on";
    const step = fanPercentageStep(fan);
    const speeds = fanSpeedCount(step);
    const canSetSpeed = supportsFeature(fan, FanEntityFeature.SET_SPEED) && speeds > 1;

    const optimistic = this._optimisticValue(fan.entity_id);
    const statePct: number = isOn ? fan.attributes.percentage ?? 0 : 0;
    const displayPct =
      optimistic ??
      (statePct > 0 ? statePct : this._lastValue[fan.entity_id] ?? percentageForSpeed(1, step));
    const speed = speedForPercentage(displayPct, step);
    const speedLabel = step >= 5 ? `Speed ${speed} of ${speeds}` : `${Math.round(displayPct)}%`;

    let stateText: string;
    if (unavailable) stateText = "Unavailable";
    else if (!isOn) stateText = "Off";
    else stateText = canSetSpeed ? `On · ${speedLabel}` : "On";

    return {
      fan,
      name: config.name ?? friendlyName(fan, config.fan),
      icon: config.icon ?? fan.attributes.icon ?? "mdi:ceiling-fan",
      unavailable,
      isOn,
      pending: optimistic !== undefined,
      step,
      speeds,
      speed,
      displayPct,
      speedLabel,
      stateText,
      // 100% → 0.4s per revolution, lowest speed → ~2s.
      spinDuration: `${(2.2 - 1.8 * (displayPct / 100)).toFixed(2)}s`,
      direction: fan.attributes.direction,
      canSetSpeed,
      canDirection: !!config.show_direction && supportsFeature(fan, FanEntityFeature.DIRECTION),
      canOscillate:
        !!config.show_oscillation && supportsFeature(fan, FanEntityFeature.OSCILLATE),
      oscillating: isOscillating(fan),
    };
  }

  private _renderFan(): TemplateResult {
    const config = this._config!;
    const fan = this._fanState();
    if (!fan) return this._renderWarning(config.fan);
    const v = this._fanView(fan);
    return config.compact ? this._renderFanCompact(v) : this._renderFanFull(v);
  }

  private _renderFanIcon(v: FanView): TemplateResult {
    return html`<div
      class="icon ${v.isOn ? "on" : ""}"
      style=${styleMap({ "--_spin-duration": v.spinDuration })}
      @click=${() => this._moreInfo(v.fan.entity_id)}
    >
      <ha-icon
        icon=${v.icon}
        style=${v.direction === "reverse" ? "animation-direction: reverse" : ""}
      ></ha-icon>
    </div>`;
  }

  private _renderFanFull(v: FanView): TemplateResult {
    const config = this._config!;
    const { fan, unavailable, isOn, step, displayPct, speedLabel, stateText, direction } = v;
    const { canSetSpeed, canDirection, canOscillate, oscillating } = v;

    return html`
      <div class="section fan">
        <div class="header">
          ${this._renderFanIcon(v)}
          <div class="info">
            <div class="name">${v.name}</div>
            <div class="state">${stateText}</div>
          </div>
          <button
            class="power ${isOn ? "on" : ""}"
            ?disabled=${unavailable}
            aria-label=${isOn ? "Turn fan off" : "Turn fan on"}
            aria-pressed=${isOn ? "true" : "false"}
            @click=${this._toggleFan}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>

        ${canSetSpeed && !unavailable
          ? html`<cfc-big-slider
              label="Fan speed"
              .valueText=${speedLabel}
              .min=${percentageForSpeed(1, step)}
              .max=${100}
              .step=${step}
              .value=${displayPct}
              .ticks=${step >= 5}
              .inactive=${!isOn}
              .disabled=${!isOn && !config.slider_turns_on}
              @value-changing=${this._fanSliderChanging}
              @value-changed=${this._fanSliderChanged}
              @value-cancelled=${() => this._sliderCancelled(fan.entity_id)}
            ></cfc-big-slider>`
          : nothing}
        ${(canDirection || canOscillate) && !unavailable
          ? html`<div class="controls">
              ${canDirection
                ? html`<div class="direction" role="group" aria-label="Fan direction">
                    ${this._renderDirectionButton("forward", "Forward", "mdi:rotate-right", direction)}
                    ${this._renderDirectionButton("reverse", "Reverse", "mdi:rotate-left", direction)}
                  </div>`
                : nothing}
              ${canOscillate
                ? html`<button
                    class="oscillate ${oscillating ? "active" : ""}"
                    aria-pressed=${oscillating ? "true" : "false"}
                    ?disabled=${!isOn}
                    title=${isOn ? "" : "Turn the fan on to change oscillation"}
                    @click=${this._toggleOscillation}
                  >
                    <ha-icon icon="mdi:arrow-oscillating"></ha-icon>Oscillate
                  </button>`
                : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderFanCompact(v: FanView): TemplateResult {
    const config = this._config!;
    const { fan, unavailable, isOn, step, speeds, speed, displayPct } = v;
    const reverse = v.direction === "reverse";
    const speedLocked = !isOn && !config.slider_turns_on;

    let speedControl: TemplateResult | typeof nothing = nothing;
    if (v.canSetSpeed && !unavailable) {
      speedControl =
        speeds <= COMPACT_MAX_SPEED_BUTTONS
          ? html`<div class="speeds" role="radiogroup" aria-label="Fan speed">
              ${Array.from({ length: speeds }, (_, i) => {
                const n = i + 1;
                const active = (isOn || v.pending) && n === speed;
                return html`<button
                  role="radio"
                  class=${active ? "active" : ""}
                  aria-checked=${active ? "true" : "false"}
                  aria-label=${`Speed ${n}`}
                  ?disabled=${speedLocked}
                  @click=${() => this._setFanPercentage(percentageForSpeed(n, step))}
                >
                  ${n}
                </button>`;
              })}
            </div>`
          : html`<cfc-big-slider
              class="speed-slider"
              compact
              label="Fan speed"
              .valueText=${v.speedLabel}
              .min=${percentageForSpeed(1, step)}
              .max=${100}
              .step=${step}
              .value=${displayPct}
              .inactive=${!isOn}
              .disabled=${speedLocked}
              @value-changing=${this._fanSliderChanging}
              @value-changed=${this._fanSliderChanged}
              @value-cancelled=${() => this._sliderCancelled(fan.entity_id)}
            ></cfc-big-slider>`;
    }

    return html`
      <div class="section fan">
        <div class="row">
          ${this._renderFanIcon(v)}
          <div class="info">
            <div class="name">${v.name}</div>
            <div class="state">${v.stateText}</div>
          </div>
          ${v.canDirection && !unavailable
            ? html`<button
                class="icon-button"
                aria-label=${reverse ? "Direction: reverse" : "Direction: forward"}
                title=${reverse ? "Reverse (tap for forward)" : "Forward (tap for reverse)"}
                @click=${this._toggleDirection}
              >
                <ha-icon icon=${reverse ? "mdi:rotate-left" : "mdi:rotate-right"}></ha-icon>
              </button>`
            : nothing}
          ${v.canOscillate && !unavailable
            ? html`<button
                class="icon-button ${v.oscillating ? "active" : ""}"
                aria-label="Oscillate"
                aria-pressed=${v.oscillating ? "true" : "false"}
                title=${isOn ? "Oscillate" : "Turn the fan on to change oscillation"}
                ?disabled=${!isOn}
                @click=${this._toggleOscillation}
              >
                <ha-icon icon="mdi:arrow-oscillating"></ha-icon>
              </button>`
            : nothing}
          ${this._renderSwitch(isOn, unavailable, "fan", this._toggleFan)}
        </div>
        ${speedControl}
      </div>
    `;
  }

  private _renderSwitch(
    isOn: boolean,
    unavailable: boolean,
    what: string,
    onClick: () => void,
  ): TemplateResult {
    return html`<button
      class="switch ${isOn ? "on" : ""}"
      role="switch"
      aria-checked=${isOn ? "true" : "false"}
      aria-label=${`${what} power`}
      ?disabled=${unavailable}
      @click=${onClick}
    ></button>`;
  }

  private _renderDirectionButton(
    value: "forward" | "reverse",
    label: string,
    icon: string,
    current: string | undefined,
  ): TemplateResult {
    const active = current === value;
    return html`<button
      class=${active ? "active" : ""}
      aria-pressed=${active ? "true" : "false"}
      @click=${() => this._setDirection(value)}
    >
      <ha-icon icon=${icon}></ha-icon>${label}
    </button>`;
  }

  private _lightView(light: LightConfig, stateObj: HassEntity): LightView {
    const unavailable = isUnavailable(stateObj);
    const isOn = stateObj.state === "on";
    const dimmable = isDimmable(stateObj, light.dimmable ?? "auto");
    const statePct = isOn ? brightnessToPct(stateObj.attributes.brightness) : 0;
    const displayPct =
      this._optimisticValue(light.entity) ??
      (statePct > 0 ? statePct : this._lastValue[light.entity] ?? 100);

    let stateText: string;
    if (unavailable) stateText = "Unavailable";
    else if (!isOn) stateText = "Off";
    else stateText = dimmable ? `On · ${Math.round(displayPct)}%` : "On";

    const rgb: number[] | undefined = stateObj.attributes.rgb_color;
    return {
      config: light,
      stateObj,
      name: light.name ?? friendlyName(stateObj, light.entity),
      icon:
        light.icon ??
        stateObj.attributes.icon ??
        (isOn ? "mdi:lightbulb" : "mdi:lightbulb-outline"),
      unavailable,
      isOn,
      dimmable,
      displayPct,
      stateText,
      colorStyle: styleMap({
        "--_light-color": isOn && rgb ? `rgb(${rgb.join(",")})` : undefined,
      }),
    };
  }

  private _renderLight(light: LightConfig): TemplateResult {
    const stateObj = this.hass!.states[light.entity];
    if (!stateObj) return this._renderWarning(light.entity);
    const v = this._lightView(light, stateObj);
    return this._config!.compact ? this._renderLightCompact(v) : this._renderLightFull(v);
  }

  private _renderBrightnessSlider(v: LightView, compact: boolean): TemplateResult {
    const entityId = v.config.entity;
    return html`<cfc-big-slider
      ?compact=${compact}
      label="Brightness"
      .valueText=${`${Math.round(v.displayPct)}%`}
      .min=${1}
      .max=${100}
      .step=${1}
      .value=${v.displayPct}
      .inactive=${!v.isOn}
      @value-changing=${(ev: CustomEvent<{ value: number }>) =>
        this._lightSliderChanging(entityId, ev)}
      @value-changed=${(ev: CustomEvent<{ value: number }>) =>
        this._lightSliderChanged(entityId, ev)}
      @value-cancelled=${() => this._sliderCancelled(entityId)}
    ></cfc-big-slider>`;
  }

  private _renderLightCompact(v: LightView): TemplateResult {
    const entityId = v.config.entity;
    return html`
      <div class="section light" style=${v.colorStyle}>
        <div class="row">
          <div class="icon ${v.isOn ? "on" : ""}" @click=${() => this._moreInfo(entityId)}>
            <ha-icon icon=${v.icon}></ha-icon>
          </div>
          <div class="info">
            <div class="name">${v.name}</div>
            <div class="state">${v.stateText}</div>
          </div>
          ${v.dimmable && !v.unavailable ? this._renderBrightnessSlider(v, true) : nothing}
          ${this._renderSwitch(v.isOn, v.unavailable, "light", () => this._toggleLight(entityId))}
        </div>
      </div>
    `;
  }

  private _renderLightFull(v: LightView): TemplateResult {
    const { config: light, unavailable, isOn, dimmable, stateText, colorStyle } = v;
    return html`
      <div class="section light" style=${colorStyle}>
        <div class="header">
          <div
            class="icon ${isOn ? "on" : ""}"
            @click=${() => this._moreInfo(light.entity)}
          >
            <ha-icon icon=${v.icon}></ha-icon>
          </div>
          <div class="info">
            <div class="name">${v.name}</div>
            <div class="state">${stateText}</div>
          </div>
          <button
            class="power ${isOn ? "on" : ""}"
            ?disabled=${unavailable}
            aria-label=${isOn ? "Turn light off" : "Turn light on"}
            aria-pressed=${isOn ? "true" : "false"}
            @click=${() => this._toggleLight(light.entity)}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>
        ${dimmable && !unavailable ? this._renderBrightnessSlider(v, false) : nothing}
      </div>
    `;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TYPE,
  name: "Ceiling Fan Card",
  description: "Control a ceiling fan's speed, direction and oscillation plus up to two lights.",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "ceiling-fan-card": CeilingFanCard;
  }
}
