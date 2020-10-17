import 'phaser'
import config from '../global/config'

export default class Game extends Phaser.Scene{
    constructor() {
        super('game');
    }

    create(){
        this.shots = this.physics.add.group();
        this.asteroids = this.physics.add.group();

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'space_background').setOrigin(0, 0);
        this.player = this.add.container(config.width/2, config.height - 20, [
            this.cannons = this.add.sprite(0, -10, 'cannons'),
            this.spaceship = this.add.sprite(0, 0, 'spaceship').play('spaceship-fly')
        ]);

        this.player.setSize(31, 33);
        this.physics.world.enable(this.player);

        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.pointer = this.input.activePointer;

        this.physics.add.overlap(this.shots, this.asteroids, this.damageAsteroid, null, this);
        this.physics.add.overlap(this.player, this.asteroids, this.damagePlayer, null, this);

        this.score = 0;
        this.scoreDisplay = this.add.bitmapText(20, 20, 'AGoblinAppears', this.score, 10).setDepth(1);
        console.log(this.scoreDisplay);

        this.resetGame();
        
    }

    update(){
        this.background.tilePositionY -= 1;
        this.handleMovement();
        this.shots.getChildren().forEach(shot => {
            if(shot.x > config.width || shot.x < 0 || shot.y > config.height || shot.y < 0) shot.destroy();
        });

        this.asteroids.getChildren().forEach(asteroid => {
            asteroid.rotation += 0.01;
            if(asteroid.y > config.height + 50) asteroid.destroy();
        });
        this.scoreDisplay.setText(this.score.toString());
    }

    resetGame(){
        this.score = 0;
        this.canShoot = true;
        this.time.removeAllEvents();
        
        this.shots.clear(true, true);
        this.asteroids.clear(true, true);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const x = Math.random() * config.width;
                const y = Math.random() * 50 - 100;
                const asteroid = this.physics.add.sprite(x, y, 'asteroid').setData('life', 100.0);
                this.asteroids.add(asteroid);
                const vel = Math.random() * 25 + 50;
                asteroid.setVelocityY(vel).setSize(50, 60);
            },
            callbackScope: this,
            repeat: -1
        });

        this.player.setActive(true).setPosition(config.width/2, config.height - 20);
    }

    damageAsteroid(shot, asteroid){
        shot.destroy();
        asteroid.data.values.life -= 5.0;
        this.score += 1;
        if(asteroid.getData('life') <= 0){
            this.score += 100;
            asteroid.destroy();
        }
    }

    damagePlayer(){
        this.player.setActive(false);
        this.card = this.add.image(config.width/2, config.height + 200, 'card');
        this.physics.pause();
        this.add.tween({
            targets: this.card,
            y: '-=300',
            ease: 'Linear',
            duration: 800,
            repeat: 0,
            onComplete: () => {
                this.resetGame();
                this.card.destroy();
                this.physics.resume();
            },
            onCompleteScope: this
        })
    }

    handleMovement(){
        const vel = 2;
        if(this.up.isDown) this.player.y -= vel;
        if(this.down.isDown) this.player.y += vel;
        if(this.left.isDown) this.player.x -= vel;
        if(this.right.isDown) this.player.x += vel;

        let angle = Math.PI/2 + Phaser.Math.Angle.Between(this.player.x, this.player.y, this.pointer.worldX, this.pointer.worldY);
        if(angle > Math.PI/3) angle = Math.PI/3;
        if(angle < -Math.PI/3) angle = -Math.PI/3;
        this.cannons.setOrigin(0.5, 1).setRotation(angle);
        
        if(this.pointer.leftButtonDown() && this.canShoot){
            angle -= Math.PI/2;
            const shotVel = 250;
            const spacing = 0.4;
            const x1 = this.player.x + Math.cos(angle + spacing)*18;
            const x2 = this.player.x + Math.cos(angle - spacing)*18;
            const y1 = this.player.y - 9 + Math.sin(angle + spacing)*18;
            const y2 = this.player.y - 9 + Math.sin(angle - spacing)*18;
            const shots = [
                this.physics.add.sprite(x1 , y1, 'shot'),
                this.physics.add.sprite(x2 , y2, 'shot')
            ];
            this.shots.add(shots[0]);
            this.shots.add(shots[1]);
            shots[0].setVelocity(shotVel*Math.cos(angle), shotVel*Math.sin(angle));
            shots[1].setVelocity(shotVel*Math.cos(angle), shotVel*Math.sin(angle));
            this.canShoot = false;
            this.time.addEvent({
                delay: 100,
                callback: () => {this.canShoot = true},
                callbackScope: this
            })
        }
    }
}
