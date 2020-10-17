import Phaser from "phaser";
import Config from "./global/config"

class Game extends Phaser.Game{
  constructor(){
    super(Config);
  }
}

window.onload = function(){
  window.game = new Game();
}
