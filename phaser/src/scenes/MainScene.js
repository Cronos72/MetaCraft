import { Scene } from "phaser";

export class MainScene extends Scene {
    constructor() {
        super("MainScene");
    }

    init() {

    }

    create() {
        this.add.image(50, 50, 'jeep', 0);
    }

    update() {

    }
}
