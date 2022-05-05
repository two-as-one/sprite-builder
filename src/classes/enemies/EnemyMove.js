export class EnemyMove {
  constructor(enemy, config) {
    this.enemy = enemy
    this.config = config
  }

  get name() {
    return this.config.name
  }

  execute() {
    if (this.config.damage) {
      this.enemy.scene.player.hp.value -= this.config.damage
    }

    if (this.config.pull) {
      this.enemy.scene.player.slot = 1
    }
  }
}
