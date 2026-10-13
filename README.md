# Ceiling Fan Card

A Home Assistant Lovelace card for ceiling fans: power, a large touch-friendly speed slider, direction, and up to two lights with optional dimming. Fan and lights are separate entities.

- **Power is separate from speed.** The slider only covers real speeds (no "0 = off" position).
- **Snaps to the fan's speeds.** A 3-speed fan gets 3 detents; continuous fans get 1–100 %.
- **Built for tablets.** A 72 px tall slider you can tap anywhere or drag; the service call is sent on release.
- **Direction toggle** (Forward / Reverse) when the fan supports it.
- **Oscillation toggle** when the fan supports it.
- **Up to two lights**, each with on/off and an optional brightness slider (auto-detected from `supported_color_modes`).
- **Visual editor** in the dashboard UI.

## Installation

### HACS (custom repository)
1. HACS → ⋮ → *Custom repositories* → add this repo URL, category **Dashboard**.
2. Install **Ceiling Fan Card**, then reload the browser.

### Manual
1. Copy `dist/ceiling-fan-card.js` to `/config/www/ceiling-fan-card.js`.
2. *Settings → Dashboards → ⋮ → Resources → Add resource*: URL `/local/ceiling-fan-card.js`, type **JavaScript module**.
3. Reload the browser.

## Configuration

```yaml
type: custom:ceiling-fan-card
fan: fan.living_room
name: Living Room Fan        # optional, defaults to the fan's friendly name
icon: mdi:ceiling-fan        # optional
show_direction: true         # optional, default true
show_oscillation: true       # optional, default true
slider_turns_on: true        # optional, default true
lights:                      # optional, up to 2
  - entity: light.living_room_fan_down
    name: Downlight          # optional
    icon: mdi:ceiling-light  # optional
    dimmable: auto           # auto | true | false (default auto)
  - entity: light.living_room_fan_up
```

| Option | Default | Description |
| --- | --- | --- |
| `fan` | **required** | A `fan.*` entity. |
| `name` | friendly name | Card title. |
| `icon` | `mdi:ceiling-fan` | Fan icon. It spins while the fan is on, faster at higher speeds. |
| `show_direction` | `true` | Show the Forward/Reverse control. It only appears if the fan supports direction. |
| `show_oscillation` | `true` | Show the Oscillate toggle. It only appears if the fan supports oscillation (`supported_features` includes `OSCILLATE`); tapping it calls `fan.oscillate` with the opposite of the fan's `oscillating` attribute. Disabled while the fan is off, since many RF fans ignore oscillate commands then. |
| `slider_turns_on` | `true` | When the fan is off, moving the slider turns it on at that speed. If `false`, the slider is disabled while the fan is off. |
| `lights[].entity` | **required** | A `light.*` entity. |
| `lights[].dimmable` | `auto` | `auto` uses the light's `supported_color_modes`; `true` or `false` forces the brightness slider on or off. |

### Theming
The card uses standard HA theme variables. You can override these (e.g. with card-mod):
`--cfc-fan-on-color`, `--cfc-light-on-color`, `--cfc-slider-height` (72px), `--cfc-button-size` (56px).

## Development

```bash
npm install
npm run build      # → dist/ceiling-fan-card.js
npm run watch      # rebuild on change (unminified)
npm test           # unit tests (vitest)
npm run dev        # build + serve; open http://localhost:5055/dev/
```

`dev/index.html` renders several cards against an in-memory mock of `hass`. The mock adds a 400 ms "device" latency, and service calls are logged at the bottom of the page.
