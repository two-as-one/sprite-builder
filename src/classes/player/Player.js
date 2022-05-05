import { Chance } from "chance"
import Phaser from "phaser"
import { state } from "../../globals/state"
import { Bar } from "../stat/Bar"
import { HealthBar } from "../ui/HealthBar"
import { PlayerMove } from "./PlayerMove"
import { PlayerSpriteBuilder } from "./PlayerSpriteBuilder"

const chance = new Chance()

const PRESETS = {
  guy: [
    { group: "head", sprite: "heads:1" },
    { group: "body", sprite: "body" },
    { group: "arms", sprite: "arms:2" },
    { group: "legs", sprite: "legs:2" },
    { group: "chest", sprite: "boobs:0" },
    { group: "genitalia", sprite: "cocks:small:1" },
  ],
  gal: [
    { group: "head", sprite: "heads:1" },
    { group: "body", sprite: "body" },
    { group: "arms", sprite: "arms:2" },
    { group: "legs", sprite: "legs:2" },
    { group: "chest", sprite: "boobs:2" },
    { group: "genitalia", sprite: "pussy:1" },
  ],
  random: [
    { group: "head", sprite: "heads:1" },
    { group: "body", sprite: "body" },
    { group: "arms", sprite: "arms:2" },
    { group: "legs", sprite: "legs:2" },
    {
      group: "chest",
      sprite: chance.pickone(["boobs:0", "boobs:2", "boobs:3", "boobs:4"]),
    },
    {
      group: "genitalia",
      sprite: chance.pickone([
        "pussy:1",
        "pussy:2",
        "cocks:medium:1",
        "cocks:medium:2",
        "cocks:small:1",
        "cocks:small:2",
      ]),
    },
  ],
}

export class Player extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)

    this.name = "player"

    this.customSprite = new PlayerSpriteBuilder(this)
    scene.game.textures.addCanvas("player", this.customSprite.canvas)
    this.customSprite.load()

    this.moves = [
      new PlayerMove(this, "tease"),
      new PlayerMove(this, "retreat"),
      new PlayerMove(this, "lunge"),
      new PlayerMove(this, "sword"),
    ]
    this.locked = false

    this.hp = new Bar(this, "hp", 10)
    this.__slot = 0
    this.__transformations = []

    PRESETS.random.forEach((t) => this.transform(t.group, t.sprite))

    this.image = this.scene.add.image(0, 0, "player")
    this.image.setOrigin(0.5, 1)
    this.add(this.image)

    this.healthBar = new HealthBar(scene, this, this.hp)
    this.add(this.healthBar)

    this.healthBar.y = -128
  }

  preUpdate() {
    this.healthBar.preUpdate()
  }

  lock() {
    this.locked = true
  }

  unlock() {
    this.locked = false
  }

  set slot(val) {
    this.__slot = Number(val)

    this.scene.moveToSlot(this, this.slot)
  }

  get slot() {
    return this.__slot
  }

  get hairColor() {
    return state.player.hairColor
  }

  set hairColor(val) {
    state.player.hairColor = Number(val)
    this.customSprite.render()
  }

  get eyeColor() {
    return state.player.eyeColor
  }

  set eyeColor(val) {
    state.player.eyeColor = Number(val)
    this.customSprite.render()
  }

  get skinColor() {
    return state.player.skinColor
  }

  set skinColor(val) {
    state.player.skinColor = Number(val)
    this.customSprite.render()
  }

  get skinSaturation() {
    return state.player.skinSaturation
  }

  set skinSaturation(val) {
    state.player.skinSaturation = Number(val)
    this.customSprite.render()
  }

  get parts() {
    return this.__transformations.map((t) => t.sprite)
  }

  transform(group, to) {
    this.__transformations = this.__transformations.filter(
      (t) => t.type != group
    )
    this.__transformations.push({ type: group, sprite: to })
    this.customSprite.layers = this.parts
    this.customSprite.render()
  }
}
