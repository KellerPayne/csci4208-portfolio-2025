class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 300, 200, 'player');
        this.depth = 2;
        this.speed = 200;
        this.projectiles = scene.player_projectiles;
        this.last_fired = 0;
        this.projectileScale = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true); // don't go out of the map
        this.body.setSize(this.width-16, this.height-16);
        this.buttons = scene.input.keyboard.addKeys('up,down,left,right,space');
        this.anims.play('player-move', true);
    }

    // move player
    move() {
        // reset velocity
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        // take care of character movement
        if (this.buttons.up.isDown) {
            this.body.velocity.y = -this.speed;
        } 

        if (this.buttons.down.isDown) {
            this.body.velocity.y = this.speed;
        }

        if (this.buttons.left.isDown) {
            this.body.velocity.x = -this.speed;
        }
        
        if (this.buttons.right.isDown) {
            this.body.velocity.x = this.speed;
        }
    }

    attack(time) {
        if (this.buttons.space.isDown && time - this.last_fired > 400) {
            const position = {x:this.x, y:this.y};
            const velocity = {x:300, y:0};
            const projectile = new Projectile(this.scene, position, velocity);
            projectile.setScale(this.projectileScale);
            projectile.body.setSize(projectile.displayWidth, projectile.displayHeight, true);
            this.projectiles.push(projectile);
            this.last_fired = time;
        }
        
        if(this.buttons.space.isUp) {
            this.last_fired = 0;
        }
    }
}