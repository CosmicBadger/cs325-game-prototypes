"use strict";

window.onload = function() {
    
    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() 
    {
        // Load an image and call it 'logo'.
        game.load.image('whitechicken', 'assets/whitechicken.png');
        game.load.image('blackchicken', 'assets/blackchicken.png');
        game.load.image('eggball', 'assets/eggball.png');
        game.load.image('analog', 'assets/analog.png');
        game.load.image('arrow', 'assets/arrow.png');
        game.load.image('hole', 'assets/chickenhole.png');
        game.load.audio('song', 'assets/chickensong.mp3');
    }
    
    var text;
    var sprites;
    var eggball;
    var spaceKey;
    var click;
    var catchFlag;
    var launchVelocity;
    var analog;
    var arrow;

    var holes;

    var whitesSunk;
    var blacksSunk;

    var music;
    
    function create() 
    {
        // Init music
        music = game.add.audio('song');
        music.play();

        // Init scoreboard
        whitesSunk = 0;
        blacksSunk = 0;
        text = game.add.text(250, 16, '', { fill: '#ffffff' });
        text.text = 'White: ' + whitesSunk + ' ; Black: ' + blacksSunk;

        // Set background colour
        game.stage.backgroundColor = "#2A5D2D";

        // CREATE BALLS
        sprites = game.add.physicsGroup(Phaser.Physics.ARCADE);
        sprites.create(120, 150,'whitechicken');
        sprites.create(220, 150,'blackchicken');
        sprites.create(320, 150,'whitechicken');
        sprites.create(420, 150,'blackchicken');
        sprites.create(520, 150,'whitechicken');
        sprites.create(620, 150,'blackchicken');

        sprites.create(120, 300,'blackchicken');
        sprites.create(220, 300,'whitechicken');
        sprites.create(520, 300,'blackchicken');
        sprites.create(620, 300,'whitechicken');

        sprites.create(120, 450,'whitechicken');
        sprites.create(220, 450,'blackchicken');
        sprites.create(520, 450,'whitechicken');
        sprites.create(620, 450,'blackchicken');

        sprites.create(120, 600,'blackchicken');
        sprites.create(220, 600,'whitechicken');
        sprites.create(320, 600,'blackchicken');
        sprites.create(420, 600,'whitechicken');
        sprites.create(520, 600,'blackchicken');
        sprites.create(620, 600,'whitechicken');

        // CREATE EGGBALL
        eggball = sprites.create(370, 375,'eggball');

        // CREATE HOLES
        holes = game.add.physicsGroup(Phaser.Physics.ARCADE);
        holes.create(200, 0, 'hole');
        holes.create(600, 760, 'hole');
        holes.create(760, 200, 'hole');
        holes.create(0, 600, 'hole');

        // CREATE 'ANALOG' (code taken from https://phaser.io/examples/v2/arcade-physics/launcher#download)
        // I'm not sure why this is necessary, but without it everything breaks. ¯\_(ツ)_/¯
        analog = game.add.sprite(400, 350, 'analog');
        game.physics.enable(analog, Phaser.Physics.ARCADE);
        analog.width = 8;
        analog.rotation = 220;
        analog.alpha = 0;
        analog.anchor.setTo(0.5, 0.0);

        // CREATE 'ARROW' (code taken from https://phaser.io/examples/v2/arcade-physics/launcher#download)
        // NOTE: Image is actually the Pause button, NOT an arrow. Change to var name was not made due to time constraints.
        arrow = game.add.sprite(400, 350, 'arrow');
        game.physics.enable(arrow, Phaser.Physics.ARCADE);
        arrow.anchor.setTo(0.1, 0.5);
        arrow.body.moves = false;
        arrow.alpha = 0;

        // ENABLE BALL BOUNCINESS
        sprites.setAll('body.collideWorldBounds', true);
        sprites.setAll('body.bounce.x', 1);
        sprites.setAll('body.bounce.y', 1);

        // ENABLE MOUSE INPUT
        game.input.mouse.capture = true;
        game.input.onDown.add(launch, this)


        // ENABLE SPACE KEY PAUSE (code taken from https://phaser.io/examples/v2/arcade-physics/global-pause)
        spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(set, this);

        // Alert the player with rules
        alert("Welcome to Chickenball! Your goal is to sink all the white chickens into holes while sinking as few black chickens as possible. You do this by pausing the screen (by clicking the spacebar) and then clicking behind the 'eggball', the white ball at the center of the screen. This will launch it forward with a velocity proportional to the distance between your cursor and the ball, hopefully knocking white chickens into the holes. But be careful- if you sink the eggball, you lose!");

        // Begin on a pause
        catchFlag = false;
        set();
    }

    // Used to pause phsyics (code taken from https://phaser.io/examples/v2/arcade-physics/global-pause)
    function togglePause() 
    {
      game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    }

    function set()
    {
        if(catchFlag == false)
        {
            eggball.body.moves = false;
            eggball.body.velocity.setTo(0, 0);
            catchFlag = true;
            // pause physics
            togglePause();
        } 
    }

    function launch()
    {   
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        if(catchFlag == true)
        {
            // unpause physics
            togglePause(); 
            catchFlag = false;
        
            eggball.body.moves = true;
            arrow.alpha = 0;
            analog.alpha = 0;

            var Xvector = (mouseX - eggball.x) * (-5);
            var Yvector = (mouseY - eggball.y) * (-5);

            eggball.body.velocity.setTo(Xvector, Yvector);
        }
    }

    function sinkBall(hole, sprite)
    {
        sprite.kill();
        if(sprite.key == 'eggball')
        {
            alert("You sunk the eggball! You lose!");
        }
        else if(whitesSunk == 10)
        {
            alert("You sunk all the white chickens! Refresh the page to play again.")
        }
        else if(sprite.key == 'whitechicken')
        {
            whitesSunk++;
            text.text = 'White: ' + whitesSunk + ' ; Black: ' + blacksSunk;
        }
        else if(sprite.key == 'blackchicken')
        {
            blacksSunk++;
            text.text = 'White: ' + whitesSunk + ' ; Black: ' + blacksSunk;
        }
    }
    
    function update()
    {
        // Enable collision between balls
        game.physics.arcade.collide(sprites);

        // Enable collision with holes
        game.physics.arcade.overlap(holes, sprites, sinkBall, null, this);

        if (catchFlag == true)
        {     
            arrow.alpha = 1;    
            analog.rotation = arrow.rotation - 3.14 / 2;
            launchVelocity = analog.height;
        }   
    }
};
