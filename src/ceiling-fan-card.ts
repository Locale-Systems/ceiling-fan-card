import { LitElement, html, nothing, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import "./big-slider";
import "./editor";
import { cardStyles } from "./styles";
import {
  CARD_TYPE,
  CARD_VERSION,
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
      ...config,
      lights: config.lights ?? [],
    };
  }

  public getCardSize(): number {
    const lights = this._config?.lights ?? [];
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
    const fan = this._fanState();
    if (!fan) return;
    const percentage = snapPercentage(ev.detail.value, fanPercentageStep(fan));
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
      <ha-card>
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

  private _renderFan(): TemplateResult {
    const config = this._config!;
    const fan = this._fanState();
    if (!fan) return this._renderWarning(config.fan);

    const unavailable = isUnavailable(fan);
    const isOn = fan.state === "on";
    const step = fanPercentageStep(fan);
    const speeds = fanSpeedCount(step);
    const canSetSpeed = supportsFeature(fan, FanEntityFeature.SET_SPEED) && speeds > 1;
    const canDirection =
      config.show_direction && supportsFeature(fan, FanEntityFeature.DIRECTION);
    const canOscillate =
      config.show_oscillation && supportsFeature(fan, FanEntityFeature.OSCILLATE);
    const oscillating = isOscillating(fan);

    const statePct: number = isOn ? fan.attributes.percentage ?? 0 : 0;
    const displayPct =
      this._optimisticValue(fan.entity_id) ??
      (statePct > 0 ? statePct : this._lastValue[fan.entity_id] ?? percentageForSpeed(1, step));
    const speed = speedForPercentage(displayPct, step);
    const speedLabel = step >= 5 ? `Speed ${speed} of ${speeds}` : `${Math.round(displayPct)}%`;

    let stateText: string;
    if (unavailable) stateText = "Unavailable";
    else if (!isOn) stateText = "Off";
    else stateText = canSetSpeed ? `On · ${speedLabel}` : "On";

    // 100% → 0.4s per revolution, lowest speed → ~2s.
    const spinDuration = `${(2.2 - 1.8 * (displayPct / 100)).toFixed(2)}s`;
    const direction: string | undefined = fan.attributes.direction;

    return html`
      <div class="section fan">
        <div class="header">
          <div
            class="icon ${isOn ? "on" : ""}"
            style=${styleMap({ "--_spin-duration": spinDuration })}
            @click=${() => this._moreInfo(fan.entity_id)}
          >
            <ha-icon
              icon=${config.icon ?? fan.attributes.icon ?? "mdi:ceiling-fan"}
              style=${direction === "reverse" ? "animation-direction: reverse" : ""}
            ></ha-icon>
          </div>
          <div class="info">
            <div class="name">${config.name ?? friendlyName(fan, config.fan)}</div>
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

  private _renderLight(light: LightConfig): TemplateResult {
    const stateObj = this.hass!.states[light.entity];
    if (!stateObj) return this._renderWarning(light.entity);

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
    const colorStyle = styleMap({
      "--_light-color": isOn && rgb ? `rgb(${rgb.join(",")})` : undefined,
    });

    return html`
      <div class="section light" style=${colorStyle}>
        <div class="header">
          <div
            class="icon ${isOn ? "on" : ""}"
            @click=${() => this._moreInfo(light.entity)}
          >
            <ha-icon
              icon=${light.icon ?? stateObj.attributes.icon ?? (isOn ? "mdi:lightbulb" : "mdi:lightbulb-outline")}
            ></ha-icon>
          </div>
          <div class="info">
            <div class="name">${light.name ?? friendlyName(stateObj, light.entity)}</div>
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
        ${dimmable && !unavailable
          ? html`<cfc-big-slider
              label="Brightness"
              .valueText=${`${Math.round(displayPct)}%`}
              .min=${1}
              .max=${100}
              .step=${1}
              .value=${displayPct}
              .inactive=${!isOn}
              @value-changing=${(ev: CustomEvent<{ value: number }>) =>
                this._lightSliderChanging(light.entity, ev)}
              @value-changed=${(ev: CustomEvent<{ value: number }>) =>
                this._lightSliderChanged(light.entity, ev)}
            ></cfc-big-slider>`
          : nothing}
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
