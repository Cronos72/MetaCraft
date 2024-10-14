import { SelectionManager } from './SelectionManager';
import { Jeep } from './Jeep';
var text1= null;
export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.selectables = [];
    }

    preload() 
    {
        const tileset = this.load.image('ground-tiles', 'assets/images/tilemaps/grass-tile.png')
        this.load.tilemapTiledJSON('map-atlas', 'assets/images/tilemaps/worldmap-atlas.tmj');
    }

    create() {


        /*
        this.cameras.main.setBounds(0, 0, 600, 900);
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);

        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        };

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
*/
        var map = this.make.tilemap({ key: 'map-atlas' }); 
        var tiles = map.addTilesetImage('ground', 'ground-tiles');
        //this.add.image(0, 0, 'map-image')
        var layer = map.createLayer(0, tiles, 0, 0);
        
        //this.cameras.main.setBounds(game.config.width, game.config.height); //this.sys.canvas.width
        
        this.cameras.main.setBounds(0, 0, map.width, map.height); //1920 1260
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);

        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.up),
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
       
    
        this.cameras.main.centerOn( 1000, 500);
        

        const populationCount = 20; // Specify the number of units to create
        this.createInitialUnits(populationCount);

        this.input.mouse.disableContextMenu();
        this.input.setDefaultCursor('url(https://labs.phaser.io/assets/input/cursors/sc2/SC2-cursor.cur), pointer');

        this.selectionManager = new SelectionManager(this);

        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        this.input.keyboard.on('keydown', event => {
            switch (event.key) {
                case ' ':
                    this.fireBullet();
                    break;
            }
        });
    }

    createInitialUnits(count) {
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(50, this.sys.canvas.width - 50);
            const y = Phaser.Math.Between(50, this.sys.canvas.height - 50);
            console.log(x+" : "+y)
            this.createJeep(x, y);
        }
    }

    createJeep(x, y) {
        const jeep = new Jeep(this, x, y);
        this.selectables.push(jeep);
        
    }

    update(time, delta) {
        this.selectables.forEach(unit => {
            unit.move(delta, this.selectables);
        });
        this.controls.update(delta);
        
    }

    destroy() {
        this.selectionManager.destroy();
    }
}
