import { html, css, LitElement } from "lit"

export class PartDropdown extends LitElement {
  static styles = css``

  static properties = {
    selected: { type: String },
    choices: { type: Array },
  }

  render() {
    return html`<select @change=${this.onChanged}>
      ${this.choices.map(
        (option) =>
          html`<option value=${option} ?selected=${this.selected === option}>
            ${option}
          </option>`
      )}
    </select>`
  }

  onChanged() {
    this.dispatchEvent(
      new CustomEvent("on-change", {
        detail: { selected: this.shadowRoot.querySelector("select").value },
      })
    )
  }

  constructor() {
    super()
  }
}
