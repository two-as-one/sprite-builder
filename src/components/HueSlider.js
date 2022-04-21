import { html, css, LitElement } from "lit"

export class HueSlider extends LitElement {
  static styles = css``

  static properties = {
    for: { type: String },
    step: { type: Number },
    value: { type: Number },
  }

  render() {
    return html`<label
      >${this.for}:
      <input
        @input=${this.onChanged}
        value=${this.value}
        type="range"
        min="1"
        max="360"
        step=${this.step}
      />${this.value}</label
    >`
  }

  onChanged() {
    this.value = this.shadowRoot.querySelector("input").value
    this.dispatchEvent(
      new CustomEvent("on-change", {
        detail: { value: this.shadowRoot.querySelector("input").value },
      })
    )
  }

  constructor() {
    super()
    this.step = 0
    this.value = 0
  }
}
