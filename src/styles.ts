import { css } from "lit";

export const cardStyles = css`
  :host {
    --cfc-gap: 16px;
    --cfc-button-size: 56px;
    --cfc-light-on-color: var(--state-light-on-color, #ffb300);
    --cfc-fan-on-color: var(--state-fan-on-color, var(--primary-color, #03a9f4));
  }
  ha-card {
    padding: var(--cfc-gap);
    display: flex;
    flex-direction: column;
    gap: var(--cfc-gap);
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .section + .section {
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    padding-top: var(--cfc-gap);
  }
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: var(--cfc-button-size);
  }
  .icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--_icon-color) 18%, transparent);
    color: var(--_icon-color);
    cursor: pointer;
    --_icon-color: var(--state-icon-color, var(--secondary-text-color, #888));
    --mdc-icon-size: 26px;
    transition: color 180ms, background-color 180ms;
  }
  .fan .icon.on {
    --_icon-color: var(--cfc-fan-on-color);
  }
  .light .icon.on {
    --_icon-color: var(--_light-color, var(--cfc-light-on-color));
  }
  .icon ha-icon {
    display: flex;
  }
  .fan .icon.on ha-icon {
    animation: spin var(--_spin-duration, 2s) linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fan .icon.on ha-icon {
      animation: none;
    }
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fan .name {
    font-size: 18px;
  }
  .state {
    font-size: 14px;
    line-height: 20px;
    color: var(--secondary-text-color);
  }
  .power {
    flex: none;
    display: grid;
    place-items: center;
    width: var(--cfc-button-size);
    height: var(--cfc-button-size);
    border: none;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    --mdc-icon-size: 28px;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms, transform 80ms;
  }
  .power:active {
    transform: scale(0.94);
  }
  .power:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--primary-color) 50%, transparent);
    outline-offset: 2px;
  }
  .fan .power.on {
    background: var(--cfc-fan-on-color);
    color: var(--text-primary-color, #fff);
  }
  .light .power.on {
    background: var(--_light-color, var(--cfc-light-on-color));
    color: #000;
  }
  .power[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .light cfc-big-slider {
    --cfc-slider-color: var(--_light-color, var(--cfc-light-on-color));
    --cfc-slider-handle-color: rgba(0, 0, 0, 0.55);
  }
  .fan cfc-big-slider {
    --cfc-slider-color: var(--cfc-fan-on-color);
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .direction {
    flex: 2 1 220px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 4px;
    border-radius: 16px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
  }
  .direction button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms;
  }
  .direction button.active {
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  }
  .direction button:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--primary-color) 50%, transparent);
  }
  .direction button[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .oscillate {
    flex: 1 1 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 56px;
    border: none;
    border-radius: 16px;
    padding: 0 16px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms, transform 80ms;
  }
  .oscillate:active {
    transform: scale(0.97);
  }
  .oscillate.active {
    background: color-mix(in srgb, var(--cfc-fan-on-color) 20%, transparent);
    color: var(--cfc-fan-on-color);
  }
  .oscillate[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .oscillate[disabled]:active {
    transform: none;
  }
  .oscillate:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--primary-color) 50%, transparent);
    outline-offset: 2px;
  }
  /* ---- Compact layout: Entities-card-sized rows ------------------------ */
  ha-card.compact {
    padding: 8px 16px;
    gap: 0;
    --_switch-color: var(--switch-checked-color, var(--primary-color, #03a9f4));
  }
  .compact .section {
    gap: 0;
  }
  .compact .section + .section {
    border-top: none;
    padding-top: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
  }
  .compact .icon {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    background: none;
    --mdc-icon-size: 24px;
  }
  .compact .name,
  .compact .fan .name {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  .compact .state {
    font-size: 12px;
    line-height: 16px;
  }
  .compact .info {
    flex: 1.2 1 0;
  }
  .compact .light cfc-big-slider {
    flex: 1 1 0;
    min-width: 72px;
    max-width: 240px;
  }
  /* Second row (speed buttons / slider) lines up with the name. */
  .speeds,
  .compact .speed-slider {
    margin: 0 0 6px 56px;
  }
  .speeds {
    display: flex;
    gap: 2px;
    padding: 2px;
    border-radius: 10px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
  }
  .speeds button {
    flex: 1;
    min-height: 32px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms;
  }
  .speeds button.active {
    background: var(--cfc-fan-on-color);
    color: var(--text-primary-color, #fff);
  }
  .speeds button[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .speeds button:focus-visible,
  .icon-button:focus-visible,
  .switch:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 60%, transparent);
    outline-offset: 1px;
  }
  .icon-button {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    padding: 0;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    --mdc-icon-size: 22px;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 180ms, color 180ms;
  }
  @media (hover: hover) {
    .icon-button:hover {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
  }
  .icon-button.active {
    color: var(--cfc-fan-on-color);
    background: color-mix(in srgb, var(--cfc-fan-on-color) 15%, transparent);
  }
  .icon-button[disabled] {
    opacity: 0.4;
    cursor: default;
    background: transparent;
  }
  /* Toggle styled after HA's ha-switch, honouring the same theme variables. */
  .switch {
    position: relative;
    flex: none;
    width: 48px;
    height: 40px;
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .switch::before {
    content: "";
    position: absolute;
    left: 7px;
    right: 7px;
    top: 13px;
    height: 14px;
    border-radius: 7px;
    background: var(--switch-unchecked-track-color, #9e9e9e);
    opacity: 0.4;
    transition: background-color 150ms, opacity 150ms;
  }
  .switch::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--switch-unchecked-button-color, #fafafa);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    transition: transform 150ms ease-out, background-color 150ms;
  }
  .switch.on::before {
    background: var(--switch-checked-track-color, var(--_switch-color));
    opacity: 0.5;
  }
  .switch.on::after {
    transform: translateX(20px);
    background: var(--_switch-color);
  }
  .switch[disabled] {
    opacity: 0.45;
    cursor: default;
  }
  .compact .warning {
    margin: 4px 0;
    padding: 8px 12px;
  }
  .warning {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--warning-color, #ffa600) 20%, transparent);
    font-size: 14px;
  }
`;
