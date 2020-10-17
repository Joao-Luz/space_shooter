import Scenes from '../scenes/Scenes'

export default {
    type: Phaser.AUTO,
    parent: "game-canvas",
    width: 400,
    height: 300,
    render: {
      pixelArt: true,

    },
    scene: Scenes,
    
    scale: {
      zoom: 2
    },
    physics: {
      default: "arcade",
      arcade:{
          gravity: {y: 0},
          debug: false
      }
    }
  };