import spriteConfig from "raw/player.json"
import image from "raw/player.png"
import { CONFIG } from "globals/config"

const CACHE = document.createElement("canvas")

export class PlayerSpriteBuilder {
  constructor(player) {
    this.player = player

    this.height = 128
    this.width = 128

    this.canvas = document.createElement("canvas")
    this.canvas.width = this.width
    this.canvas.height = this.height

    this.spriteConfig = spriteConfig
    this.img = new Image()
    this.loaded = false

    this.layers = []
  }

  async load() {
    await new Promise((r) => {
      this.img.onload = r
      this.img.src = image
    })
    this.loaded = true
    this.render()
  }

  render() {
    if (!this.loaded) {
      return
    }

    const canvas = this.canvas
    canvas.width = this.width
    canvas.height = this.height
    this.context.imageSmoothingEnabled = false
    this.drawLayers(...PlayerSpriteBuilder.unwrapLayers(...this.layers))
    this.player.scene.game.textures.list.player?.refresh()
  }

  drawLayers(...layers) {
    layers
      .map((layer) => this.configLayer(layer))
      .filter((layer) => layer)
      .sort(PlayerSpriteBuilder.sortLayers)
      .forEach((layer) => this.drawLayer(layer))
  }

  configLayer(name) {
    const layer = this.spriteConfig.frames[name]

    if (!layer) {
      return
    }

    if (CONFIG.player["hue-groups"].hair.includes(name)) {
      layer.hue = this.player.hairColor
    }

    if (CONFIG.player["hue-groups"].eyes.includes(name)) {
      layer.hue = this.player.eyeColor
    }

    if (CONFIG.player["hue-groups"].skin.includes(name)) {
      layer.hue = this.player.skinColor
      layer.saturation = this.player.skinSaturation
    }

    layer.i = this.spriteConfig.meta.layers.findIndex(
      (layer) => layer.name === name
    )
    return layer
  }

  filterLayer(layer) {
    CACHE.width = this.img.width
    CACHE.height = this.img.height

    const ctx = CACHE.getContext("2d")
    ctx.drawImage(this.img, 0, 0)

    if (layer.saturation) {
      ctx.globalCompositeOperation = "saturation"
      ctx.fillStyle = "hsl(0," + layer.saturation + "%, 50%)"
      ctx.fillRect(0, 0, CACHE.width, CACHE.height)
    }

    if (layer.hue) {
      ctx.globalCompositeOperation = "hue"
      ctx.fillStyle = `hsl(${layer.hue}, 1%, 50%)`
      ctx.fillRect(0, 0, CACHE.width, CACHE.height)
    }

    // ctx.globalCompositeOperation = "overlay"
    // ctx.fillStyle = "#000"
    // ctx.fillRect(0, 0, CACHE.width, CACHE.height)

    // clip
    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(this.img, 0, 0)

    return CACHE
  }

  drawLayer(layer) {
    const ctx = this.context
    const img = this.filterLayer(layer)

    try {
      ctx.drawImage(
        img,
        layer.frame.x,
        layer.frame.y,
        layer.frame.w,
        layer.frame.h,
        0,
        0,
        layer.frame.w,
        layer.frame.h
      )
    } catch (e) {
      console.error(e)
    }
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
      if (CONFIG.player["part-combinations"][layer]) {
        out.push(...CONFIG.player["part-combinations"][layer])
      } else {
        out.push(layer)
      }
    })

    return out
  }
}
