// Minimal stand-ins for Home Assistant so the card can be exercised in a plain browser.

// <ha-card>: a themed container.
customElements.define(
  "ha-card",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).innerHTML = `
        <style>:host{display:block;background:var(--ha-card-background,var(--card-background-color));
        border-radius:var(--ha-card-border-radius,12px);border:1px solid var(--divider-color);
        color:var(--primary-text-color)}</style><slot></slot>`;
    }
  },
);

// <ha-icon>: fetches Material Design Icons SVGs from the CDN.
const iconCache = new Map();
customElements.define(
  "ha-icon",
  class extends HTMLElement {
    static observedAttributes = ["icon"];
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    set icon(v) { this.setAttribute("icon", v); }
    get icon() { return this.getAttribute("icon"); }
    async attributeChangedCallback() {
      const name = (this.icon || "").replace(/^mdi:/, "");
      if (!name) return;
      if (!iconCache.has(name)) {
        iconCache.set(
          name,
          fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/svg/${name}.svg`).then((r) => r.text()),
        );
      }
      const svg = await iconCache.get(name);
      if (this.icon.replace(/^mdi:/, "") !== name) return;
      this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);
        height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%;fill:currentColor}</style>${svg}`;
    }
  },
);

const LATENCY_MS = 400;

export function createMockHass(initialStates, onChange, log) {
  let states = structuredClone(initialStates);

  const update = (entityId, patch, attrs = {}) => {
    const prev = states[entityId];
    states = {
      ...states,
      [entityId]: { ...prev, ...patch, attributes: { ...prev.attributes, ...attrs } },
    };
    onChange(build());
  };

  const handlers = {
    "fan.turn_on": (id, d) => {
      const fan = states[id];
      const pct = d.percentage ?? fan.attributes.last_percentage ?? fan.attributes.percentage_step;
      update(id, { state: "on" }, { percentage: pct });
    },
    "fan.turn_off": (id) =>
      update(id, { state: "off" }, { percentage: 0, last_percentage: states[id].attributes.percentage }),
    "fan.set_percentage": (id, d) =>
      d.percentage === 0
        ? handlers["fan.turn_off"](id)
        : update(id, { state: "on" }, { percentage: d.percentage }),
    "fan.set_direction": (id, d) => update(id, {}, { direction: d.direction }),
    "fan.oscillate": (id, d) => update(id, {}, { oscillating: d.oscillating }),
    "light.turn_on": (id, d) => {
      const attrs = {};
      if (d.brightness_pct !== undefined) attrs.brightness = Math.round((d.brightness_pct / 100) * 255);
      else if (states[id].attributes.supported_color_modes?.includes("brightness"))
        attrs.brightness = states[id].attributes.brightness ?? states[id].attributes.last_brightness ?? 255;
      update(id, { state: "on" }, attrs);
    },
    "light.turn_off": (id) =>
      update(id, { state: "off" }, { brightness: null, last_brightness: states[id].attributes.brightness }),
  };

  function build() {
    return {
      states,
      themes: { darkMode: document.documentElement.dataset.theme === "dark" },
      callService(domain, service, data) {
        log(`${domain}.${service} ${JSON.stringify(data)}`);
        const handler = handlers[`${domain}.${service}`];
        return new Promise((resolve) =>
          setTimeout(() => {
            handler?.(data.entity_id, data);
            resolve();
          }, LATENCY_MS),
        );
      },
    };
  }

  return build();
}
