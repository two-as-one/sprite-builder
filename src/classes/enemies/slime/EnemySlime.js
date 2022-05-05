import { Enemy } from "../Enemy"
import { EnemyMove } from "../EnemyMove"

export class EnemySlime extends Enemy {
  constructor(scene) {
    super(scene, "slime", 32)
    this.lust.max = 20
  }

  get intent() {
    if (this.scene.player.slot === 1) {
      return new EnemyMove(this, {
        name: "slam",
        damage: 2,
      })
    } else {
      // TODO: add move cooldowns to prevent enemies from spamming
      return this.chance.weighted(
        [
          new EnemyMove(this, {
            name: "splatter",
            damage: 1,
          }),
          new EnemyMove(this, {
            name: "creep",
            pull: true,
          }),
        ],
        [2, 1]
      )
    }
  }
}
