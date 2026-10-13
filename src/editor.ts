import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { EDITOR_TYPE, MAX_LIGHTS } from "./const";
import { fireEvent } from "./helpers";
import { toFormData, fromFormData, type FormData } from "./editor-data";
import type { CeilingFanCardConfig, HomeAssistant } from "./types";

const lightSchema = (index: number) => ({
  name: `light${index}`,
  type: "expandable",
  title: `Light ${index}`,
  icon: "mdi:lightbulb-outline",
  schema: [
    { name: "entity", selector: { entity: { filter: { domain: "light" } } } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
      ],
    },
    {
      name: "dimmable",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "auto", label: "Auto-detect" },
            { value: "true", label: "Yes (show brightness slider)" },
            { value: "false", label: "No (on/off only)" },
          ],
        },
      },
    },
  ],
});

const SCHEMA = [
  { name: "fan", required: true, selector: { entity: { filter: { domain: "fan" } } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
    ],
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_direction", selector: { boolean: {} } },
      { name: "show_oscillation", selector: { boolean: {} } },
      { name: "slider_turns_on", selector: { boolean: {} } },
    ],
  },
  ...Array.from({ length: MAX_LIGHTS }, (_, i) => lightSchema(i + 1)),
];

const LABELS: Record<string, string> = {
  fan: "Fan entity",
  entity: "Light entity",
  name: "Name (optional)",
  icon: "Icon (optional)",
  show_direction: "Show direction control",
  show_oscillation: "Show oscillation control",
  slider_turns_on: "Speed slider turns fan on",
  dimmable: "Dimmable",
};

const HELPERS: Record<string, string> = {
  show_oscillation: "Only shown if the fan supports oscillation",
  slider_turns_on: "When off, moving the slider powers the fan on at that speed",
};

@customElement(EDITOR_TYPE)
export class CeilingFanCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: CeilingFanCardConfig;

  public setConfig(config: CeilingFanCardConfig): void {
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // ha-form and its selectors are lazy-loaded by HA; loading a built-in
    // card's editor guarantees they're registered before we render.
    if (!customElements.get("ha-form")) {
      (customElements.get("hui-entities-card") as any)?.getConfigElement?.();
    }
  }

  private _computeLabel = (schema: { name: string }) => LABELS[schema.name] ?? schema.name;
  private _computeHelper = (schema: { name: string }) => HELPERS[schema.name];

  private _valueChanged(ev: CustomEvent<{ value: FormData }>): void {
    ev.stopPropagation();
    const config = { ...fromFormData(ev.detail.value), type: this._config!.type };
    fireEvent(this, "config-changed", { config });
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${toFormData(this._config)}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ceiling-fan-card-editor": CeilingFanCardEditor;
  }
}
