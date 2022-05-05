import Phaser from "phaser"

export class HealthBar extends Phaser.GameObjects.Container {
  constructor(scene, entity, bar) {
    super(scene)

    this.entity = entity
    this.bar = bar

    this.width = this.bar.max * 2
    this.height = 6
    this.x = -this.width / 2

    this.capRight = this.scene.add.image(this.width, 0, "bar-shadow-right")
    this.capLeft = this.scene.add.image(-2, 0, "bar-shadow-left")
    this.middle = this.scene.add.image(0, 0, "bar-shadow-middle")
    this.fill = this.scene.add.image(
      -1,
      0,
      this.bar.name === "lust" ? "bar-fill-lust" : "bar-fill-hp"
    )

    this.middle.scaleX = this.width
    this.fill.scaleX = this.width + 2

    this.capRight.setOrigin(0, 0.5)
    this.capLeft.setOrigin(0, 0.5)
    this.middle.setOrigin(0, 0.5)
    this.fill.setOrigin(0, 0.5)

    this.add(this.capLeft)
    this.add(this.capRight)
    this.add(this.middle)
    this.add(this.fill)
  }

  get fillValue() {
    return this.bar.percent * (this.width + 2)
  }

  preUpdate() {
    this.width = this.bar.max * 2
    this.x = -this.width / 2
    this.capRight.x = this.width
    this.middle.scaleX = this.width
    this.fill.scaleX = this.width + 2

    this.fill.scaleX = this.fillValue
  }
}
