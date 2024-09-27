export class SelectionManager {
    constructor(scene) {
        this.scene = scene;
        this.selectionRectangle = scene.add.rectangle(0, 0, 0, 0, 0x00ff00, 0.3).setOrigin(0, 0).setVisible(false);
        this.dragStartPoint = null;

        // Initialize key objects for Ctrl, Shift, and Alt keys
        this.ctrlKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.altKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT);
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Bind event handlers
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);

        // Add Phaser input event listeners
        scene.input.on('pointerdown', this.onPointerDown);
        scene.input.on('pointermove', this.onPointerMove);
        scene.input.on('pointerup', this.onPointerUp);
    }

    onPointerDown(pointer) {
        if (pointer.leftButtonDown()) {
            this.startSelection(pointer);
        }
    }

    onPointerMove(pointer) {
        this.updateSelection(pointer);
    }

    onPointerUp(pointer) {
        if (pointer.leftButtonReleased()) {
            this.endSelection(this.scene.selectables, pointer);
        } else if (pointer.rightButtonReleased()) {
            this.moveSelectedUnits(pointer);
        }
    }

    startSelection(pointer) {
        this.dragStartPoint = { x: pointer.x, y: pointer.y };
        console.log('Drag Start Point:', this.dragStartPoint); // Log the drag start point for debugging
        this.selectionRectangle.setPosition(this.dragStartPoint.x, this.dragStartPoint.y);
        this.selectionRectangle.setSize(0, 0);
        this.selectionRectangle.setVisible(true);
    }

    updateSelection(pointer) {
        if (this.dragStartPoint) {
            const currentX = pointer.x;
            const currentY = pointer.y;

            const width = currentX - this.dragStartPoint.x;
            const height = currentY - this.dragStartPoint.y;

            // Handle negative width and height
            const rectX = width < 0 ? currentX : this.dragStartPoint.x;
            const rectY = height < 0 ? currentY : this.dragStartPoint.y;
            const rectWidth = Math.abs(width);
            const rectHeight = Math.abs(height);

            this.selectionRectangle.setPosition(rectX, rectY);
            this.selectionRectangle.setSize(rectWidth, rectHeight);
        }
    }

    endSelection(selectables, pointer) {
        if (this.dragStartPoint) {
            this.selectionRectangle.setVisible(false);
            const rect = this.selectionRectangle.getBounds();

            // Check if the selection rectangle is very small (indicating a click)
            const isClick = Math.abs(rect.width) < 5 && Math.abs(rect.height) < 5;

            if (isClick) {
                // Handle click selection
                this.handleClickSelection(selectables, pointer);
            } else {
                // Handle drag selection
                this.handleDragSelection(selectables, rect);
            }

            this.dragStartPoint = null;
        }
    }

    handleClickSelection(selectables, pointer) {
        const clickX = pointer.x;
        const clickY = pointer.y;
        const ctrlOrAltKey = this.ctrlKey.isDown || this.altKey.isDown;
        const shiftKey = this.shiftKey.isDown;

        console.log(`Left-click at (${clickX}, ${clickY}) with Ctrl/Alt: ${ctrlOrAltKey}, Shift: ${shiftKey}`); // Log the left-click position and keys

        selectables.forEach(unit => {
            const unitBounds = unit.sprite.getBounds();
            if (this.isPointInBounds(clickX, clickY, unitBounds)) {
                this.handleUnitSelection(unit, ctrlOrAltKey, shiftKey, selectables);
            } else if (!ctrlOrAltKey && !shiftKey) {
                unit.deselect();
            }
        });
    }

    handleUnitSelection(unit, ctrlOrAltKey, shiftKey, selectables) {
        if (ctrlOrAltKey) {
            // Toggle selection
            unit.isSelected ? unit.deselect() : unit.select();
        } else if (shiftKey) {
            // Add to selection
            unit.select();
        } else {
            // Normal click selection
            selectables.forEach(u => u.deselect());
            unit.select();
        }
    }

    handleDragSelection(selectables, rect) {
        const shiftKey = this.shiftKey.isDown;

        if (!shiftKey) {
            // Deselect all units if shift is not held
            selectables.forEach(unit => unit.deselect());
        }

        selectables.forEach(unit => {
            const unitBounds = unit.sprite.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(rect, unitBounds)) {
                unit.select();
            }
        });
    }

    moveSelectedUnits(pointer) {
        const targetX = pointer.x;
        const targetY = pointer.y;
        console.log(`Right-click at (${targetX}, ${targetY})`); // Log the right-click position

        this.scene.selectables.forEach(unit => {
            if (unit.isSelected) { // Access isSelected as a property
                unit.setTarget(targetX, targetY);
            }
        });
    }

    isPointInBounds(x, y, bounds) {
        return Phaser.Geom.Intersects.RectangleToRectangle(new Phaser.Geom.Rectangle(x, y, 1, 1), bounds);
    }

    destroy() {
        // Remove Phaser input event listeners
        this.scene.input.off('pointerdown', this.onPointerDown);
        this.scene.input.off('pointermove', this.onPointerMove);
        this.scene.input.off('pointerup', this.onPointerUp);
    }
}