import { html, css, LitElement } from "lit"

import { CustomSprite } from "components/CustomSprite"
import { PartDropdown } from "components/PartDropdown"
import { HueSlider } from "./HueSlider"
import CONFIG from "raw/config.json"

customElements.define("custom-sprite", CustomSprite)
customElements.define("part-dropdown", PartDropdown)
customElements.define("hue-slider", HueSlider)

export class MyApp extends LitElement {
  static styles = css`
    .app {
      background-color: #999;
      padding: 16px;
    }

    .controls {
      display: flex;
      flex-direction: column;
    }
  `

  static properties = {
    parts: { type: Array },
    random: { type: Boolean },
  }

  render() {
    return html`
      <section class="app">
        <custom-sprite
          .layers=${this.parts.map((part) => part.selected)}
        ></custom-sprite>
        <div class="controls">
          <label>
            <input
              type="checkbox"
              ?checked=${this.random}
              @change=${(e) => {
                this.random = e.path[0].checked
                this.randomizeParts()
              }}
            />
            Random
          </label>

          ${this.parts.map(
            (part) =>
              html`<part-dropdown
                .choices=${part.options}
                .selected=${part.selected}
                @on-change=${(e) => this.updateParts(part, e)}
              ></part-dropdown>`
          )}
          ${this.sliders.map(
            (slider) =>
              html`<hue-slider
                for=${slider.for}
                @on-change=${(e) => this.updateSlider(slider, e)}
              ></hue-slider>`
          )}
        </div>
      </section>
    `
  }

  constructor() {
    super()

    this.random = false
    this.parts = [
      { selected: "body", options: ["body"] },
      { selected: "heads:1", options: ["heads:1"] },
      { selected: "arms:2", options: ["arms:2"] },
      { selected: "legs:2", options: ["legs:2"] },
      {
        selected: "boobs:2",
        options: ["boobs:0", "boobs:2", "boobs:3", "boobs:4"],
      },
      {
        selected: "pussy:1",
        options: [
          "pussy:1",
          "pussy:2",
          "cocks:small:1",
          "cocks:small:2",
          "cocks:medium:1",
          "cocks:medium:2",
        ],
      },
    ]
    this.sliders = [{ for: "hair" }, { for: "eyes" }]
  }

  randomizeParts() {
    if (!this.random) {
      return
    }

    this.parts.forEach(
      (part) =>
        (part.selected =
          part.options[Math.floor(Math.random() * part.options.length)])
    )

    this.requestUpdate()

    setTimeout(() => {
      this.randomizeParts()
    }, 1000)
  }

  updateParts(part, e) {
    part.selected = e.detail.selected
    this.requestUpdate()
  }

  updateSlider(slider, e) {
    CONFIG["hue-groups"].find((group) => group.name === slider.for).hue =
      e.detail.value
    this.requestUpdate()
  }
}
