import { html, css, LitElement } from "lit"
import { classMap } from "lit/directives/class-map.js"

export class SkillButton extends LitElement {
  static styles = css`
    .card {
      align-items: stretch;
      border: 2px solid #000;
      border-radius: 2px;
      background: #fff;
      color: #fff;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      font-family: monospace;
      height: 130px;
      margin: 0;
      padding: 0;
      width: 130px;
    }

    .card:hover {
      border-color: #fff;
    }

    .card.disabled {
      opacity: 0.5;
    }

    .name {
      background-color: #333;
      padding: 4px;
      margin: 0;
      text-transform: uppercase;
      font-size: 16px;
      font-weight: bold;
    }

    .body {
      align-items: stretch;
      background-color: #333;
      color: #fff;
      display: flex;
      flex-basis: 0;
      flex-direction: column;
      flex-grow: 1;
      padding: 0;
      margin: 0;
    }

    .label {
      font-style: italic;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .effect {
      text-align: start;
      font-size: 14px;
      margin: 2px 8px;
    }
  `

  static properties = {
    move: { type: Object },
    _disabled: { state: true },
  }

  render() {
    return html` <button
      class="card ${classMap({ disabled: this._disabled })}"
      @click=${() => this.onClick()}
    >
      <span class="name">${this.move.name}</span>
      <span class="body">
        <span class="label">
          ${this.move.config.melee
            ? "───┤ melee ├────"
            : this.move.config.ranged
            ? "───┤ ranged ├───"
            : "────────────────"}</span
        >
        ${this.move.config.effects.map((effect) => {
          if (effect.damage) {
            return html`<span class="effect">${effect.damage} DMG</span>`
          }
          if (effect.lust) {
            return html`<span class="effect">${effect.lust} LUST</span>`
          }
          if (effect.forward) {
            return html`<span class="effect">MOVE 🡆</span>`
          }
          if (effect.backward) {
            return html`<span class="effect">MOVE 🡄</span>`
          }
        })}
      </span>
    </button>`
  }

  constructor() {
    super()
  }

  firstUpdated() {
    this.onSlotChange()
    this.move.player.scene.game.events.on("change:slot", () =>
      this.onSlotChange()
    )
  }

  onSlotChange() {
    this._disabled = this.move.disabled
  }

  onClick() {
    if (this.move.disabled) {
      return
    }
    this.move.player.scene.resolveCombatTurn(this.move)
  }
}
