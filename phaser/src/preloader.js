// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        this.load.setPath("assets");
        this.load.spritesheet('jeep', 'jeep_45_spaced.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('bullet', 'bullet.png');
    }

    create() {
        this.scene.start("MainScene");
    }
}
