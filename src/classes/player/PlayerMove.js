import { CONFIG } from "globals/config"

export class PlayerMove {
  constructor(player, name) {
    this.name = name
    this.config = CONFIG.player.moves[name]
    this.player = player
  }

  execute() {
    console.log(this.player.name, "used", this.name)
    this.config.effects.forEach((effect) => this.apply(effect))
  }

  get disabled() {
    if (this.config.melee && this.player.slot === 2) {
      return true
    }

    if (this.config.ranged && this.player.slot === 1) {
      return true
    }

    return false
  }

  apply(effect) {
    if (this.disabled) {
      return
    }

    if (effect.damage) {
      this.player.scene.enemy.hp.value -= effect.damage
    }

    if (effect.lust) {
      this.player.scene.enemy.lust.value -= effect.lust
    }

    if (effect.forward) {
      this.player.slot = 1
    }

    if (effect.backward) {
      this.player.slot = 2
    }
  }
}
