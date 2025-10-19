class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, position) {
        super(scene, position.x, position.y, 'enemy');
        this.depth = 2;
        this.last_fired = 0;
        this.projectiles = scene.enemy_projectiles;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.velocity.x = - Phaser.Math.Between(120, 300);
        this.anims.play('enemy-move', true);
        this.attack_duration = Phaser.Math.Between(2000, 4000);
    }

    attack(time) {
        if (!this.active || !this.body || !this.scene) return;

        if (time - this.last_fired > this.attack_duration) {
            const position = {x:this.x, y:this.y};
            const velocity = {x:this.body.velocity.x-100, y:0};
            const projectile = new Projectile(this.scene, position, velocity);
            this.projectiles.push(projectile);
            this.last_fired = time;
            this.attack_duration = Phaser.Math.Between(2000,4000);
        }
    }
}