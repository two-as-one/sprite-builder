import Phaser from "phaser"
import StateMachine from "javascript-state-machine"

import backgroundImage from "raw/background.png"
import foregroundImage from "raw/foreground.png"
import slimeImage from "raw/slime.png"
import slimeData from "raw/slime.json"
import barShadowLeft from "raw/bar-shadow-left.png"
import barShadowRight from "raw/bar-shadow-right.png"
import barShadowMiddle from "raw/bar-shadow-middle.png"
import barFillHpImage from "raw/bar-fill-hp.png"
import barFillLustImage from "raw/bar-fill-lust.png"

import { Player } from "../player/Player"
import { EnemySlime } from "../enemies/slime/EnemySlime"

const FLOOR = 224

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" })

    this.state = new StateMachine({
      init: "explore",
      transitions: [
        { name: "enterCombat", from: "explore", to: "combat" },
        { name: "takeTurn", from: "combat", to: "takingTurn" },
        { name: "endTurn", from: "takingTurn", to: "combat" },
        { name: "endCombat", from: "takingTurn", to: "explore" },
      ],
    })
  }

  preload() {
    this.load.aseprite("slime", slimeImage, slimeData)
    this.load.image("bar-fill-lust", barFillLustImage)
    this.load.image("bar-fill-hp", barFillHpImage)
    this.load.image("bar-shadow-left", barShadowLeft)
    this.load.image("bar-shadow-right", barShadowRight)
    this.load.image("bar-shadow-middle", barShadowMiddle)
    this.load.image("background", backgroundImage)
    this.load.image("foreground", foregroundImage)
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      this.game.config.width,
      this.game.config.height,
      "background"
    )
    this.background.setOrigin(0, 0)

    this.foreground = this.add.tileSprite(
      0,
      0,
      this.game.config.width,
      this.game.config.height,
      "foreground"
    )
    this.foreground.setOrigin(0, 0)
    this.foreground.setDepth(100)

    // change tilePositionX to scroll backgrounds

    this.player = new Player(this)
    this.player.y = FLOOR
    this.player.x = 256
    this.add.existing(this.player)
    this.player.customSprite.render()

    setTimeout(() => this.startCombat(), 1000)

    window.scene = this
  }

  startCombat(name = "slime") {
    if (!this.state.can("enterCombat")) {
      return
    }

    switch (name) {
      case "slime":
        this.enemy = new EnemySlime(this)
        break
    }

    this.enemy.y = FLOOR
    this.enemy.x = 320
    this.add.existing(this.enemy)

    this.player.slot = 1

    this.state.enterCombat()
    this.game.events.emit("combat:start", this)
  }

  async endCombat() {
    if (!this.state.can("endCombat")) {
      return
    }

    this.enemy.destroy()
    this.player.slot = 0

    this.state.endCombat()
    this.game.events.emit("combat:end", this)

    await new Promise((r) => setTimeout(r, 2000))
    this.startCombat()
  }

  async resolveCombatTurn(move) {
    if (!this.state.can("takeTurn")) {
      return
    }

    this.state.takeTurn()

    move.execute()
    await new Promise((r) => setTimeout(r, 500))

    if (this.enemy.hp.value === 0 || this.enemy.lust.value === 0) {
      this.endCombat()
    } else {
      this.enemy.act()
      await new Promise((r) => setTimeout(r, 500))

      this.state.endTurn()
    }
  }

  moveToSlot(player, slot) {
    let x = [256, 192, 128][slot]

    this.tweens.add({
      targets: player,
      x,
      ease: "Back",
      duration: 250,
    })

    this.game.events.emit("change:slot")
  }
}
