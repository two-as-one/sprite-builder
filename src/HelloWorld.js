import config from "config.yaml"
import { html, css, LitElement } from "lit"

export class HelloWorld extends LitElement {
  static styles = css`
    .app {
      background-color: #000;
      color: #fff;
    }
  `
  render() {
    return html`<div class="app">${config.text}</div>`
  }
}
