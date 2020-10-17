import 'phaser'

export default class Load extends Phaser.Scene {
    constructor(){
        super('load');
    }

    preload(){
        this.load.image('space_background', require('../assets/space_background.png'));
        this.load.image('cannons', require('../assets/cannons.png'));
        this.load.image('shot', require('../assets/shot.png'));
        this.load.image('asteroid', require('../assets/asteroid.png'));
        this.load.image('card', require('../assets/card.png'));
        this.load.spritesheet("spaceship", require('../assets/spaceship.png'), {
            frameWidth: 35,
            frameHeight: 39
        });

        this.load.bitmapFont('AGoblinAppears', require('../assets/font/AGoblinAppears.png'), require('../assets/font/AGoblinAppears.xml'));
    }

    create(){
        this.anims.create({
            key: 'spaceship-fly',
            frames: this.anims.generateFrameNumbers('spaceship'),
            frameRate: 12,
            repeat: -1,
        });

        this.scene.start('game');
    }
}
