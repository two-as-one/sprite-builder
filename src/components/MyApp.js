import { html, css, LitElement } from "lit"
import { game } from "globals/game"
import { SkillButton } from "./SkillButton"

customElements.define("skill-button", SkillButton)

export class MyApp extends LitElement {
  static styles = css`
    .app {
      background-color: rgb(15, 16, 16);
      box-sizing: border-box;
      padding: 16px;
      min-width: 1024px;
    }

    .controls {
      display: flex;
      height: 130px;
      justify-content: center;
      padding: 4px;
    }

    .game {
      display: flex;
      justify-content: center;
      background-color: rgb(15, 16, 16);
    }
  `

  static properties = {
    _playerMoves: { state: true },
  }

  render() {
    return html`
      <section class="app">
        <div class="game"></div>
        <div class="controls">
          ${this._playerMoves.map(
            (move) => html`<skill-button .move=${move}></skill-button>`
          )}
        </div>
      </section>
    `
  }

  constructor() {
    super()

    this._playerMoves = []

    game.events.on(
      "combat:start",
      (scene) => (this._playerMoves = scene.player.moves)
    )

    game.events.on("combat:end", () => (this._playerMoves = []))
  }

  updated() {
    const el = this.shadowRoot.querySelector(".game")
    el.appendChild(game.canvas)
  }
}
