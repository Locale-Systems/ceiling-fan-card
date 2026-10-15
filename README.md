# Ceiling Fan Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)
[![GitHub release](https://img.shields.io/github/v/release/Locale-Systems/ceiling-fan-card)](https://github.com/Locale-Systems/ceiling-fan-card/releases)
[![CI](https://github.com/Locale-Systems/ceiling-fan-card/actions/workflows/ci.yml/badge.svg)](https://github.com/Locale-Systems/ceiling-fan-card/actions/workflows/ci.yml)

A Home Assistant Lovelace card for ceiling fans: power, a large touch-friendly speed slider, direction, and up to two lights with optional dimming. Fan and lights are separate entities.

- **Power is separate from speed.** The slider only covers real speeds (no "0 = off" position).
- **Snaps to the fan's speeds.** A 3-speed fan gets 3 detents; continuous fans get 1–100 %.
- **Built for tablets.** A 72 px tall slider you can tap anywhere or drag; the service call is sent on release.
- **Direction toggle** (Forward / Reverse) when the fan supports it.
- **Oscillation toggle** when the fan supports it.
- **Up to two lights**, each with on/off and an optional brightness slider (auto-detected from `supported_color_modes`).
- **Compact layout** that matches the Entities card's row size.
- **Visual editor** in the dashboard UI.

<!-- Screenshots: add docs/images/full.png and docs/images/compact.png, then uncomment.
| Standard | Compact |
| --- | --- |
| ![Standard layout](docs/images/full.png) | ![Compact layout](docs/images/compact.png) |
-->

## Installation

### HACS (recommended)

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Locale-Systems&repository=ceiling-fan-card&category=plugin)

Or add it by hand:
1. In HACS, open ⋮ → *Custom repositories*.
2. Add `https://github.com/Locale-Systems/ceiling-fan-card` with type **Dashboard**.
3. Search for **Ceiling Fan Card**, download it, and reload your browser.

HACS registers the dashboard resource for you and notifies you of new releases.

### Manual
1. Download `ceiling-fan-card.js` from the [latest release](https://github.com/Locale-Systems/ceiling-fan-card/releases/latest) and copy it to `/config/www/ceiling-fan-card.js`.
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
compact: false               # optional, default false
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
| `slider_turns_on` | `true` | When the fan is off, moving the slider (or tapping a speed button) turns it on at that speed. If `false`, speed controls are disabled while the fan is off. |
| `compact` | `false` | Use Entities-card sized rows instead of large touch controls. See [Compact layout](#compact-layout). |
| `lights[].entity` | **required** | A `light.*` entity. |
| `lights[].dimmable` | `auto` | `auto` uses the light's `supported_color_modes`; `true` or `false` forces the brightness slider on or off. |

### Compact layout

`compact: true` trades the large touch controls for 40px rows that sit comfortably next to an Entities card (about a third of the height):

- Power becomes a toggle switch styled like HA's own, using the `--switch-*` theme variables.
- Fan speed becomes segmented buttons (1, 2, 3…) for fans with up to 6 speeds, and a slim slider for fans with more speeds or continuous percentage.
- Direction and oscillation become icon buttons in the fan row. The direction button shows the current direction; tap it to switch.
- Dimmable lights get a slim brightness slider inline with the name. Vertical swipes that start on a slim slider scroll the page instead of changing the value.

### Theming
The card uses standard HA theme variables. You can override these (e.g. with card-mod):
`--cfc-fan-on-color`, `--cfc-light-on-color`, `--cfc-slider-height` (72px), `--cfc-button-size` (56px), `--cfc-compact-slider-thumb-width` (18px).

## Development

```bash
npm install
npm run build      # → dist/ceiling-fan-card.js
npm run watch      # rebuild on change (unminified)
npm test           # unit tests (vitest)
npm run dev        # build + serve; open http://localhost:5055/dev/
```

`dev/index.html` renders several cards against an in-memory mock of `hass`. The mock adds a 400 ms "device" latency, and service calls are logged at the bottom of the page.

## Releasing

Releases are built by GitHub Actions; `dist/` is not committed. The tag sets the version, so there's nothing to bump in `package.json` first.

1. Push your changes to `master`.
2. On GitHub, open **Releases → Draft a new release**, create a new tag such as `v0.3.1` on `master`, and click **Publish release**.
   (Or from a terminal: `git tag v0.3.1 && git push origin v0.3.1`.)
3. The [Release workflow](.github/workflows/release.yml) runs the tests, builds with the tag's version, and attaches `ceiling-fan-card.js` and `LICENSE` to the release, creating the release first if you only pushed a tag. HACS then offers the update to users within a few hours.

Tags must look like `v1.2.3`. A suffix such as `v0.4.0-beta.1` marks a pre-release when the workflow creates it; if you publish from the GitHub page, tick **Set as a pre-release** yourself. HACS only offers pre-releases to users who opt in.

The JS file starts with an MIT license banner and keeps the license notices of bundled dependencies (Lit, BSD-3-Clause).

## License

[MIT](LICENSE)
