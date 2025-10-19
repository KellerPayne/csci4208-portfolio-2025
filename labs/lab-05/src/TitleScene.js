class TitleScene extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        this.create_title();
        this.create_game_data();
        this.create_topscore();
        this.input.keyboard.on('keydown-SPACE', () => {this.scene.start('play'); });
    }

    create_title() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        this.add.text(width/2, height/3, 'DODGER GAME', {
            fontSize: '48px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.text(width/2, height/2, 'Arrow Keys to Move\nSpacebar to Fire', {
            fontSize: '24px',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 2/3, 'Press SPACE to Start', {
            fontSize : '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
    }

    create_game_data() {
        this.registry.set('top_score', this.registry.get('top_score') || 100);
        this.registry.set('winner', this.registry.get('winner') || 'Top Score');
    }

    create_topscore() {
        const topScore = this.registry.get('top_score');
        const winner = this.registry.get('winner');

        const x = this.game.config.width/2;
        const y = this.game.config.height - 50;
        this.add.text(x, y, `Leader: ${winner} - ${topScore}`, {
            fontSize: '20px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
    }
}