import { Chance } from "chance"
import Phaser from "phaser"
import { Bar } from "../stat/Bar"
import { HealthBar } from "../ui/HealthBar"

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, name, height = 128) {
    super(scene)
    this.name = name

    this.hp = new Bar(this, "hp", 10)
    this.lust = new Bar(this, "lust", 10)

    this.height = height

    this.image = scene.add.image(0, 0, this.name)
    this.image.setOrigin(0.5, 1)
    this.add(this.image)

    this.healthBar = new HealthBar(scene, this, this.hp)
    this.healthBar.y = -this.height - 16
    this.add(this.healthBar)

    this.lustBar = new HealthBar(scene, this, this.lust)
    this.lustBar.y = -this.height - 16 + 5
    this.add(this.lustBar)

    this.chance = new Chance()
  }

  preUpdate() {
    this.healthBar.preUpdate()
    this.lustBar.preUpdate()
  }

  act() {
    const intent = this.intent
    console.log(this.name, "acts", intent.name)
    intent.execute()
  }
}
