class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.depth = 2;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.velocity.x = -300;
    }

    applyEffect(player) {
        console.warn(`applyEffect not implemented for this power-up type.`);
    }
}

class SlayPowerUp extends PowerUp {
    constructor(scene, x, y) {
        super(scene, x, y, 'powerup-slay');
    }

    applyEffect(player) {
        const scene = this.scene;
        scene.enemies.forEach(monster => monster.destroy());
        scene.enemy_projectiles.forEach(bullet => bullet.destroy());
        scene.cameras.main.flash();
    }
}

class ProjectilePowerUp extends PowerUp {
    constructor(scene, x, y){
        super(scene, x, y, 'powerup-projectile');
    }

    applyEffect(player) {
            player.projectileScale = Math.min(player.projectileScale + 1, 3);
        }
}