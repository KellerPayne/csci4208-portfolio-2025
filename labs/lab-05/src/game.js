const config = new Object();

config.width = 640;     // width of viewport
config.height = 480;        //height of viewport
config.scene = [TitleScene, PlayScene];     // scenes for this game
config.physics = {default:'arcade'};        // physics for collisions

const game = new Phaser.Game(config);   // new game with configs
