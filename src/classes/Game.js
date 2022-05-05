import Phaser from "phaser"

import { CONFIG } from "globals/config"
import { MainScene } from "./scenes/MainScene"

export class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: CONFIG.game.width,
      height: CONFIG.game.height,
      backgroundColor: CONFIG.game.backgroundColor,
      pixelArt: true,
      zoom: 2,
      roundPixels: true,
      scene: MainScene,
    })
  }
}
