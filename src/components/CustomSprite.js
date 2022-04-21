import { html, css, LitElement } from "lit"
import spriteConfig from "raw/Sprite-0001.json"
import CONFIG from "raw/config.json"
import image from "raw/Sprite-0001.png"

const CACHE = document.createElement("canvas")

export class CustomSprite extends LitElement {
  static styles = css``

  static properties = {
    height: { type: Number },
    width: { type: Number },
    scale: { type: Number },
    spriteConfig: { type: Object },
    image: { type: String },
    layers: { type: Array },
    hue: { type: Number },
  }

  render() {
    return html`<canvas></canvas>`
  }

  constructor() {
    super()
    this.spriteConfig = spriteConfig
    this.height = 128
    this.width = 128
    this.scale = 2
    this.image = image
    this.img = new Image()
    this.img.src = this.image
    this.layers = []
  }

  updated() {
    const canvas = this.canvas
    canvas.width = this.width * this.scale
    canvas.height = this.height * this.scale
    this.context.imageSmoothingEnabled = false
    this.drawLayers(...CustomSprite.unwrapLayers(...this.layers))
  }

  drawLayers(...layers) {
    layers
      .map((layer) => this.configLayer(layer))
      .filter((layer) => layer)
      .sort(CustomSprite.sortLayers)
      .forEach((layer) => this.drawLayer(layer))
  }

  configLayer(name) {
    const layer = this.spriteConfig.frames[name]

    if (!layer) {
      return
    }

    CONFIG["hue-groups"].forEach((group) => {
      if (group.layers.includes(name)) {
        console.log(name, group.hue)
        layer.hue = group.hue
      }
    })

    layer.i = this.spriteConfig.meta.layers.findIndex(
      (layer) => layer.name === name
    )
    return layer
  }

  hueLayer(layer) {
    CACHE.width = this.img.width
    CACHE.height = this.img.height

    const ctx = CACHE.getContext("2d")
    ctx.drawImage(this.img, 0, 0)

    // apply hue
    ctx.globalCompositeOperation = "hue"
    ctx.fillStyle = `hsl(${layer.hue}, 1%, 50%)`
    ctx.fillRect(0, 0, CACHE.width, CACHE.height)

    // clip
    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(this.img, 0, 0)

    return CACHE
  }

  drawLayer(layer) {
    const ctx = this.context
    const img = layer.hue ? this.hueLayer(layer) : this.img

    try {
      ctx.drawImage(
        img,
        layer.frame.x,
        layer.frame.y,
        layer.frame.w,
        layer.frame.h,
        0,
        0,
        layer.frame.w * this.scale,
        layer.frame.h * this.scale
      )
    } catch (e) {
      console.error(e)
    }
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

  static unwrapLayers(...layers) {
    const out = []

    layers.forEach((layer) => {
      if (CONFIG["part-combinations"][layer]) {
        out.push(...CONFIG["part-combinations"][layer])
      } else {
        out.push(layer)
      }
    })

    return out
  }
}
