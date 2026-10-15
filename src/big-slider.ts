import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { clamp, fireEvent } from "./helpers";

/**
 * Large, finger-friendly horizontal slider.
 *
 * Events (detail: { value: number }):
 *  - value-changing:  fired continuously while dragging
 *  - value-changed:   fired once when the user releases (or on keyboard input)
 *  - value-cancelled: the gesture was taken over by the browser (e.g. a scroll);
 *                     the value reverts and no change should be sent
 *
 * `compact` renders a slim track with a round thumb and lets vertical
 * scrolling pass through, for use inside dense rows.
 */
@customElement("cfc-big-slider")
export class BigSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Rendered with a muted fill, e.g. when the entity is off. Still interactive. */
  @property({ type: Boolean, reflect: true }) inactive = false;
  @property({ type: Boolean }) ticks = false;
  @property({ type: Boolean, reflect: true }) compact = false;
  @property() label = "";
  @property({ attribute: "value-text" }) valueText = "";

  @state() private _dragValue?: number;

  @query(".slider") private _slider!: HTMLDivElement;

  private get _current(): number {
    return this._dragValue ?? this.value;
  }

  private get _stepCount(): number {
    return Math.round((this.max - this.min) / this.step);
  }

  private _snap(raw: number): number {
    const index = clamp(Math.round((raw - this.min) / this.step), 0, this._stepCount);
    // Pin the last step to max so fractional steps (33.33…) still reach 100.
    if (index === this._stepCount) return this.max;
    return Math.round((this.min + index * this.step) * 100) / 100;
  }

  private _fraction(value: number): number {
    const range = this.max - this.min;
    return range <= 0 ? 1 : clamp((value - this.min) / range, 0, 1);
  }

  private _valueFromPointer(ev: PointerEvent): number {
    const rect = this._slider.getBoundingClientRect();
    const thumb = this._thumbWidth();
    const usable = Math.max(1, rect.width - thumb);
    const fraction = clamp((ev.clientX - rect.left - thumb / 2) / usable, 0, 1);
    return this._snap(this.min + fraction * (this.max - this.min));
  }

  private _thumbWidth(): number {
    const raw = getComputedStyle(this).getPropertyValue("--_thumb");
    return parseFloat(raw) || (this.compact ? 18 : 56);
  }

  private _onPointerDown(ev: PointerEvent): void {
    if (this.disabled || (ev.pointerType === "mouse" && ev.button !== 0)) return;
    ev.preventDefault();
    this._slider.setPointerCapture(ev.pointerId);
    this._slider.focus({ preventScroll: true });
    this._setDrag(this._valueFromPointer(ev));
  }

  private _onPointerMove(ev: PointerEvent): void {
    if (this._dragValue === undefined) return;
    this._setDrag(this._valueFromPointer(ev));
  }

  private _onPointerUp(ev: PointerEvent): void {
    if (this._dragValue === undefined) return;
    const value = this._dragValue;
    // Clear first: releasing capture fires lostpointercapture, which re-enters here.
    this._dragValue = undefined;
    if (this._slider.hasPointerCapture(ev.pointerId)) {
      this._slider.releasePointerCapture(ev.pointerId);
    }
    this.value = value;
    fireEvent(this, "value-changed", { value });
  }

  private _onPointerCancel(): void {
    if (this._dragValue === undefined) return;
    this._dragValue = undefined;
    fireEvent(this, "value-cancelled");
  }

  private _setDrag(value: number): void {
    if (value === this._dragValue) return;
    this._dragValue = value;
    fireEvent(this, "value-changing", { value });
  }

  private _onKeyDown(ev: KeyboardEvent): void {
    if (this.disabled) return;
    const bigStep = Math.max(this.step, (this.max - this.min) / 10);
    let next: number | undefined;
    switch (ev.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = this._current + this.step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = this._current - this.step;
        break;
      case "PageUp":
        next = this._current + bigStep;
        break;
      case "PageDown":
        next = this._current - bigStep;
        break;
      case "Home":
        next = this.min;
        break;
      case "End":
        next = this.max;
        break;
      default:
        return;
    }
    ev.preventDefault();
    const value = this._snap(next);
    if (value === this.value && !this.inactive) return;
    this.value = value;
    fireEvent(this, "value-changed", { value });
  }

  protected willUpdate(changed: PropertyValues): void {
    // Abort a drag if the slider is disabled mid-gesture.
    if (changed.has("disabled") && this.disabled) this._dragValue = undefined;
  }

  protected render() {
    const fraction = this._fraction(this._current);
    const showTicks = this.ticks && !this.compact && this._stepCount > 0 && this._stepCount <= 10;
    return html`
      <div
        class="slider ${this._dragValue !== undefined ? "dragging" : ""}"
        role="slider"
        tabindex=${this.disabled ? -1 : 0}
        aria-label=${this.label || nothing}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this._current}
        aria-valuetext=${this.valueText || nothing}
        aria-disabled=${this.disabled ? "true" : "false"}
        style="--fraction: ${fraction}"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @lostpointercapture=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="track"></div>
        ${showTicks
          ? html`<div class="ticks">
              ${Array.from({ length: this._stepCount + 1 }, (_, i) => {
                const f = i / this._stepCount;
                return html`<span
                  class="tick ${f <= fraction ? "covered" : ""}"
                  style="--pos: ${f}"
                ></span>`;
              })}
            </div>`
          : nothing}
        <div class="fill"><div class="handle"></div></div>
      </div>
    `;
  }

  static styles = css`
    :host {
      --_height: var(--cfc-slider-height, 72px);
      --_thumb: var(--cfc-slider-thumb-width, 56px);
      --_radius: var(--cfc-slider-radius, 18px);
      --_color: var(--cfc-slider-color, var(--primary-color, #03a9f4));
      display: block;
      -webkit-tap-highlight-color: transparent;
    }
    :host([inactive]) {
      --_color: var(--cfc-slider-inactive-color, var(--disabled-color, #9e9e9e));
    }
    :host([disabled]) {
      opacity: 0.45;
      pointer-events: none;
    }
    .slider {
      position: relative;
      height: var(--_height);
      border-radius: var(--_radius);
      overflow: hidden;
      cursor: pointer;
      touch-action: none;
      user-select: none;
      outline: none;
      isolation: isolate;
    }
    .slider:focus-visible {
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--_color) 50%, transparent);
    }
    .track {
      position: absolute;
      inset: 0;
      background: var(--_color);
      opacity: 0.18;
    }
    .fill {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: calc(
        var(--_thumb) +
          (100% - var(--_thumb)) * var(--fraction)
      );
      background: var(--_color);
      border-radius: var(--_radius);
      transition: width 180ms ease-out, background-color 180ms;
    }
    .dragging .fill {
      transition: background-color 180ms;
    }
    .handle {
      position: absolute;
      top: 50%;
      right: calc(var(--_thumb) / 2 - 3px);
      width: 6px;
      height: 44%;
      transform: translateY(-50%);
      border-radius: 3px;
      background: var(--cfc-slider-handle-color, #fff);
      opacity: 0.9;
    }
    .ticks {
      position: absolute;
      inset: 0 calc(var(--_thumb) / 2);
      pointer-events: none;
      z-index: 1;
    }
    .tick {
      position: absolute;
      top: 50%;
      left: calc(100% * var(--pos));
      width: 6px;
      height: 6px;
      margin: -3px 0 0 -3px;
      border-radius: 50%;
      background: var(--_color);
      opacity: 0.7;
    }
    :host([compact]) {
      --_height: 32px;
      --_thumb: var(--cfc-compact-slider-thumb-width, 18px);
    }
    :host([compact]) .slider {
      overflow: visible;
      border-radius: 0;
      /* Let vertical swipes scroll the dashboard; horizontal drags still work. */
      touch-action: pan-y;
    }
    :host([compact]) .slider:focus-visible {
      box-shadow: none;
    }
    :host([compact]) .track,
    :host([compact]) .fill {
      top: calc(50% - 3px);
      bottom: auto;
      height: 6px;
      border-radius: 3px;
    }
    :host([compact]) .track {
      opacity: 0.25;
    }
    :host([compact]) .fill {
      width: calc(var(--_thumb) / 2 + (100% - var(--_thumb)) * var(--fraction));
    }
    :host([compact]) .handle {
      right: calc(var(--_thumb) / -2);
      width: var(--_thumb);
      height: var(--_thumb);
      border-radius: 50%;
      background: var(--_color);
      opacity: 1;
    }
    :host([compact]) .slider:focus-visible .handle {
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--_color) 35%, transparent);
    }
    .tick.covered {
      background: var(--cfc-slider-handle-color, #fff);
      opacity: 0.55;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "cfc-big-slider": BigSlider;
  }
}
