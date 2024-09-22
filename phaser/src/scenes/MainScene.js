import { Scene } from "phaser";

export class MainScene extends Scene {
    // Define background object in order to detect clicks on nothing
    background = null

    jeepMetadata = {
        isSelected: false,
    }

    jeep = null
    jeepSelection = null

    constructor() {
        super("MainScene");
    }

    init() {

    }

    create() {
        this.background = this.add.rectangle(0,0,800,600, 0x000000, 1);
        this.background.setInteractive();
        this.background.name = "background";
        this.jeepSelection = this.add.circle(0, 0, 10, 0x00ff00, 0);
        console.log("this.jeepSelection", this.jeepSelection);
        this.jeep = this.add.sprite(50, 50, 'jeep', 0);
        this.jeep.setInteractive();
        this.jeep.name = "jeep";
        this.input.on('gameobjectdown',this.onObjectClicked);
    }

    update() {
        this.moveJeep();
    }

    moveJeep() {
        this.jeepSelection.x = this.jeep.x;
        this.jeepSelection.y = this.jeep.y + 10;
    }

    onObjectClicked(pointer, gameObject) {
        if (gameObject.name === "background") {
            console.log("Clicked on background -- deselect all");
            this.scene.jeepSelection.setFillStyle(0x00ff00, 0);
            this.scene.jeepMetadata.isSelected = false;
        } else if (gameObject.name === "jeep") {
            console.log("Clicked on jeep -- select jeep");
            this.scene.jeepSelection.setFillStyle(0x00ff00, 1);
            this.scene.jeepMetadata.isSelected = true;
        }
    }
}
