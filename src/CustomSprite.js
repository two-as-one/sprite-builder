import { html, css, LitElement } from "lit"
import spriteConfig from "raw/Sprite-0001.json"
import CONFIG from "raw/config.json"
import image from "raw/Sprite-0001.png"

export class CustomSprite extends LitElement {
  static styles = css``

  static properties = {
    height: { type: Number },
    width: { type: Number },
    spriteConfig: { type: Object },
    image: { type: String },
    layers: { type: Array },
  }

  render() {
    return html`<canvas></canvas>`
  }

  constructor() {
    super()
    this.spriteConfig = spriteConfig
    this.height = 128
    this.width = 128
    this.image = image
    this.img = new Image()
    this.img.src = this.image
    this.layers = ["head", "boobs:2", "arms:2", "legs:2", "torso", "pelvis"]
  }

  updated() {
    const canvas = this.canvas
    canvas.width = this.width
    canvas.height = this.height
    this.drawLayers(...this.unwrapLayers(...this.layers))
  }

  unwrapLayers(...layers) {
    const out = []
    layers.forEach((layer) => {
      if (CONFIG["part-combinations"][layer]) {
        out.push(...this.unwrapLayers(...CONFIG["part-combinations"][layer]))
      } else {
        out.push(layer)
      }
    })
    return out
  }

  drawLayers(...layers) {
    layers
      .map((layer) => CustomSprite.cleanLayer(layer))
      .sort(CustomSprite.sortLayers)
      .forEach((layer) => this.drawLayer(layer.name, layer.x, layer.y))
  }

  drawLayer(name, x = 0, y = 0) {
    const ctx = this.context
    const layer = this.spriteConfig.frames[name]
    ctx.drawImage(
      this.img,
      layer.frame.x,
      layer.frame.y,
      layer.frame.w,
      layer.frame.h,
      x,
      y,
      layer.frame.w,
      layer.frame.h
    )
  }

  get canvas() {
    return this.shadowRoot.querySelector("canvas")
  }

  get context() {
    return this.canvas.getContext("2d")
  }

  static sortLayers(a, b) {
    return a.i - b.i
  }

  static cleanLayer(layer) {
    if (typeof layer === "string") {
      layer = { name: layer }
    }
    return Object.assign({}, CONFIG["part-defaults"][layer.name], layer)
  }
}
