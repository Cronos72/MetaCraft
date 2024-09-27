export class Unit {
    constructor(scene, x, y, texture, frame = 0, totalFrames = 32, wiggleAmplitude = 1) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture, frame);
        this.sprite.setInteractive();
        this.sprite.name = texture;
        this.selection = scene.add.circle(x, y, 10, 0x00ff00, 0);
        this.isSelected = false;
        this.target = { x: -1, y: -1 };
        this.speed = 100;
        this.totalFrames = totalFrames;
        this.wiggleAmplitude = wiggleAmplitude;
        this.wiggleTime = 0;
        this.radius = 30; // Minimum distance between units
    }

    move(delta, units = []) {
        this.updateSelectionPosition();
        if (this.hasTarget()) {
            this.moveToTarget(delta);
            this.horribleCollisionHack(units);
        } else {
            this.stopMovement();
        }
    }

    updateSelectionPosition() {
        this.selection.x = this.sprite.x;
        this.selection.y = this.sprite.y + 10;
    }

    hasTarget() {
        return this.target.x !== -1 && this.target.y !== -1;
    }

    moveToTarget(delta) {
        const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.target.x, this.target.y);
        if (distance < 3) {
            this.reachTarget();
        } else {
            this.updateVelocityAndFrame(delta);
        }
    }

    reachTarget() {
        this.sprite.body.reset(this.target.x, this.target.y);
        console.log(`Unit reached target (${this.target.x}, ${this.target.y})`);
        this.target.x = -1;
        this.target.y = -1;
    }

    updateVelocityAndFrame(delta) {
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.target.x, this.target.y);
        this.sprite.body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
        console.log(`Unit moving towards (${this.target.x}, ${this.target.y})`);

        const frameIndex = this.calculateFrameIndex(angle, delta);
        this.sprite.setFrame(frameIndex);
    }

    calculateFrameIndex(angle, delta) {
        let degrees = Phaser.Math.RadToDeg(angle);
        if (degrees < 0) {
            degrees += 360;
        }

        const baseFrameIndex = Math.round(degrees / (360 / this.totalFrames)) % this.totalFrames;
        this.wiggleTime += delta * 2;
        const wiggleOffset = Math.sin(this.wiggleTime * 0.005) * this.wiggleAmplitude;
        return (baseFrameIndex + Math.round(wiggleOffset)) % this.totalFrames;
    }

    stopMovement() {
        this.sprite.body.setVelocity(0, 0);
    }

    select() {
        this.selection.setFillStyle(0x00ff00, 1);
        this.isSelected = true;
        console.log(`Unit selected at (${this.sprite.x}, ${this.sprite.y})`);
    }

    deselect() {
        this.selection.setFillStyle(0x00ff00, 0);
        this.isSelected = false;
        console.log(`Unit deselected at (${this.sprite.x}, ${this.sprite.y})`);
    }

    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
        console.log(`Target set to (${x}, ${y})`);
    }

    horribleCollisionHack(units) {
        units.forEach(unit => {
            if (unit !== this) {
                const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, unit.sprite.x, unit.sprite.y);
                if (distance < this.radius) {
                    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, unit.sprite.x, unit.sprite.y);
                    const overlap = this.radius - distance;
                    this.sprite.x -= Math.cos(angle) * overlap / 2;
                    this.sprite.y -= Math.sin(angle) * overlap / 2;
                    unit.sprite.x += Math.cos(angle) * overlap / 2;
                    unit.sprite.y += Math.sin(angle) * overlap / 2;
                }
            }
        });
    }
}