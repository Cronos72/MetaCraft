// Class to preload all the assets
// Remember you can load this assets in another scene if you need it

/* Note: 

1) browsers have a default setting now that disables the playback of audio with out a user having interacted with the browser. It might make sense to have this just be a black screen
where you click next on. Then have a seperate scene for the main menu.  

2) What kind of artsyle do we want? I hope you like my placeholder art!


*/
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        this.load.setPath("assets");

        this.load.spritesheet('jeep', 'jeep_45_spaced.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('bullet', 'bullet.png');

        //MENU
        this.load.image('main-menu-logo', 'images/logo/logo1.png');
        this.load.image('buttonBG', 'images/buttons/start-button.png');

        this.load.audio('song',['sound/music/02.mp3', 'sound/music/02.OGG']); 
        this.load.audio('startbutton-sound',['sound/sfx/enginestart.ogg']); // TODO: Sound clip needs to be shortened... maybe 3-5 seconds. rest of teh clip can be engine running sound
        

        
        //this.load.image('buttonText', 'assets/sprites/button-text.png');


        this.load.video(
             {
                key: 'intro',
                url: [ 'video/intro-shitty.mp4' ],
                noAudio: true
             });
             
        
    }

    create() 
    {
       
    //PLAY BACKGROUND VIDEO
       const introVideo = this.add.video(0,0,'intro', true).setOrigin(0).setScale(0.5);
       introVideo.play(true);
       
       
    //PLAY MUSIC
       const music = this.sound.add('song');
       music.play();

    //DiSPLAY TITLE LOGO
       var x =  this.cameras.main.width / 2;
       var y =  (this.cameras.main.height / 2);
       const logo = this.add.image(x ,y - 140, 'main-menu-logo');

    //DISPLAY START BUTOON
       //https://phaser.io/examples/v3.85.0/game-objects/container/view/container-hitarea-from-size
       
       const startButton = this.add.image(x , y , 'buttonBG');
       const container = this.add.container(startButton );
       container.setSize(startButton.width, startButton.height);// start button is wraped inside a container with which is set to listen for mouse clicks
       container.x = startButton.x;
       container.y = startButton.y;
       container.setInteractive();

       container.on('pointerover', () =>
       {
    
         startButton.setTint(0xFF69B4);// set color on hover
    
        });
    
        container.on('pointerout', () =>
        {
    
            startButton.clearTint(); // clear color when mouse not over container
    
        });
        container.on('pointerdown', ()=> 
        {
            music.setVolume(0.5);                      // Make music quiet so you can hear engine start sound
            this.sound.add('startbutton-sound').play();
            this.scene.start("MainScene");
        });

        
        
    }
}
