import { Scene } from "phaser";

export class MainScene extends Scene {
    // Define background object in order to detect clicks on nothing
    background = null

    // Put all the jeep stuff on one object
    // In the future we should probably use Typescript and make a nice unit interface or something
    jeep = {
        sprite: null,
        spriteIndex: 0,
        isSelected: false,
        selection: null,
        target: {x: -1, y:-1}
    }

    frame = 0

    constructor() {
        super("MainScene");
    }

    create() {
        this.physics.world.setBounds(0, 0, 1600, 900);

        this.background = this.add.rectangle(0,0,1600,900, 0x2d2d2d, 1);
        this.background.setInteractive();
        this.background.name = "background";

        this.jeep.selection = this.add.circle(0, 0, 10, 0x00ff00, 0);
        this.jeep.sprite = this.physics.add.sprite(50, 50, 'jeep', 0);
        this.jeep.sprite.setInteractive();
        this.jeep.sprite.name = "jeep";

        this.input.mouse.disableContextMenu();
        this.input.on('gameobjectdown',this.onObjectClicked);
    }

    update() {
        this.frame++;
        this.moveJeep();
    }

    moveJeep() {
        // Position the selection object under the jeep
        this.jeep.selection.x = this.jeep.sprite.x;
        this.jeep.selection.y = this.jeep.sprite.y + 10;

        // Cycle through the jeep sprites
        // TODO: Select the appropriate frame based on what direction the jeep is moving
        if (this.frame % 10 == 0) {
            this.jeep.spriteIndex++;
            this.jeep.sprite.setFrame(this.jeep.spriteIndex % 32);
        }

        // Move the jeep towards the target if one is set
        if (this.jeep.target.x != -1) {
            const dist = Math.abs((this.jeep.target.y - this.jeep.sprite.y) + (this.jeep.target.x - this.jeep.sprite.x))
            if (dist < 3) {
                this.jeep.sprite.body.reset(this.jeep.sprite.x, this.jeep.sprite.y)
                this.jeep.target.x = -1
                this.jeep.target.y = -1
            }
        }
    }

    onObjectClicked(pointer, gameObject) {
        if (pointer.rightButtonDown()) {
            this.scene.handleMove(pointer, gameObject)
        } else {
            this.scene.handleSelect(pointer, gameObject)
        }
    }

    handleMove(pointer, gameObject) {
        this.physics.moveTo(this.jeep.sprite, pointer.x, pointer.y, 200)
        this.jeep.target.x = pointer.x
        this.jeep.target.y = pointer.y
    }

    handleSelect(pointer, gameObject) {
        if (gameObject.name === "background") {
            this.jeep.selection.setFillStyle(0x00ff00, 0);
            this.jeep.isSelected = false;
        } else if (gameObject.name === "jeep") {
            this.jeep.selection.setFillStyle(0x00ff00, 1);
            this.jeep.isSelected = true;
        }
    }
}
