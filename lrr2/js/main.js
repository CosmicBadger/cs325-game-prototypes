// this iteretion:
// - increases the no. of wolves
// - prevent spawning of wolves on top of little red
// - granny's house now spawns in a reliably difficult location
window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'LittleRed64', 'assets/LittleRed64.png' );
        game.load.image( 'House', 'assets/House.png' );
        game.load.image( 'Wolf', 'assets/Wolf.png' );
        game.load.image('HomePage', 'assets/HomePage.png');
        game.load.image('Tree', 'assets/tree.png');
        game.load.image('Bread', 'assets/bread.png');
        // game.load.image( 'Instructions', 'assets/Instructions.png' );
        // load a tilemap and call it 'map'.
        // from .json file
        game.load.tilemap('map', 'assets/tilemap_example.json', null, Phaser.Tilemap.TILED_JSON);

        // game.load.tilemap('map', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);

        
        //load tiles for map
        game.load.image('tiles', 'assets/tiles.png');
    }
    
    var map;
    var layer1;
    var sprite;
    var house;
    var xHouseCoord;
    var yHouseCoord;
    var wolves = new Array(50);
    var pKey;
    var eKey;
    var playMode;
    var bread;
    var newBread;
    var backgroundLayer;
    var groundLayer;

    var trees;
    
    function create() 
    {
        // show instructions
        game.add.sprite(0,0, 'HomePage');

        // Initialize keyboard input
        game.input.enabled = true;
        pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

        playMode = false;        
        
    }

    function makeForest()
    {
        // tree = game.add.sprite(0,0, 'Tree');
        // alert("makeForest");
        // trees = game.add.physicsGroup(Phaser.Physics.ARCADE);
        // trees.create(0, 0,'Tree');
    }

    function makeWorld()
    {

        // // makeForest();
        // this.map = game.add.tilemap('map');
        // this.map.addTilesetImage('tiles', 'tiles');
        // this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        // this.groundLayer = this.map.createLayer('GroundLayer');


        // this.groundLayer.resizeWorld()

        // Create the map. 
        map = game.add.tilemap('map');
        // for csv files specify the tile size.
        //map = game.add.tilemap('map', 32, 32);
        
        //add tiles
        map.addTilesetImage('tiles');
        
        // Create a layer from the map
        //using the layer name given in the .json file
        layer1 = map.createLayer('Tile Layer 1');
        //for csv files
        //layer1 = map.createLayer(0);
        
        //  Resize the world
        layer1.resizeWorld();
        
        // Create a sprite at the center of the screen using the 'logo' image.
        sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'LittleRed64' );
 
        //////////////////////////////////////////////////////////////////////
        // CREATE GRANNY'S HOUSE /////////////////////////////////////////////
        var topBottom = getRandomInt(0,1)
        var leftRight = getRandomInt(0,1)
        xHouseCoord = getRandomInt(40, 1500);
        yHouseCoord = getRandomInt(40, 1500);
        // determine top/bottom spawning position of granny's house
        if(topBottom == 0)
        {
            yHouseCoord = getRandomInt(1200, 1540);
        }
        else
        {
            yHouseCoord = getRandomInt(60, 200);
        }

        // determine left/right spawning position of granny's house
        if(topBottom == 0)
        {
            xHouseCoord = getRandomInt(1200, 1540);
        }
        else
        {
            xHouseCoord = getRandomInt(60, 200);
        }
        house = game.add.sprite(xHouseCoord, yHouseCoord, 'House');
        //////////////////////////////////////////////////////////////////////

        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        sprite.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable(sprite, Phaser.Physics.ARCADE );
        game.physics.enable(house, Phaser.Physics.ARCADE );

        // Make it bounce off of the world bounds.
        sprite.body.collideWorldBounds = true;

        //  Tell it we don't want physics to manage the rotation
        sprite.body.allowRotation = false;
        
        // Cause game camera to follow litte red
        game.camera.follow(sprite);

        // allow for collison between sprite and house
        game.physics.arcade.collide(sprite, house);


        var xCoord = 0;
        var yCoord = 0;
        var xVel = 0;
        var yVel = 0;

        for(var i = 0; i < wolves.length; i++)
        {
            var topBottom = getRandomInt(0,1)
            var leftRight = getRandomInt(0,1)

            // determine top/bottom spawning position of wolf, away from Little Red
            if(topBottom == 0)
            {
                yCoord = getRandomInt(1000, 1600);
            }
            else
            {
                yCoord = getRandomInt(0, 600);
            }

            // determine left/right spawning position of wolf, away from Little Red
            if(topBottom == 0)
            {
                xCoord = getRandomInt(1000, 1600);
            }
            else
            {
                xCoord = getRandomInt(0, 600);
            }

            // xCoord = getRandomInt(0, 1600);
            // yCoord = getRandomInt(0, 1600);
            xVel = getRandomInt(0, 1);
            yVel = getRandomInt(0, 1);

            if(xVel == 0)
            {
                xVel = 200;
            }
            else
            {
                xVel = -200;
            }
            if(yVel == 0)
            {
                yVel = 200;
            }
            else
            {
                yVel = -200;
            }
            wolves[i] = game.add.sprite(xCoord, yCoord, 'Wolf');

            game.physics.enable(wolves[i], Phaser.Physics.ARCADE);
            wolves[i].body.collideWorldBounds = true;

            wolves[i].body.velocity.setTo(xVel, yVel);
            wolves[i].body.bounce.set(1);
            game.physics.arcade.collide(wolves[i]);
        }

        playMode = true;

    }
    
    function update() 
    {
        if(playMode == false)
        {
            pKey.onDown.add(makeWorld, this);

        }

        if(playMode == true)
        {
            sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 1000);

            game.physics.arcade.overlap(house, sprite, victory, null, this);

            for(var i = 0; i < wolves.length; i++)
            {
                game.physics.arcade.overlap(wolves[i], sprite, lose, null, this);
            }
            game.physics.arcade.overlap(house, sprite, victory, null, this);
        }

        // // listen for e key to throw break
        // if(playMode == true)
        // {
        //     eKey.onDown.add(throwBread, this);
        // }
        
    }

    function victory()
    {
        alert("you win");
        makeWorld();
    }

    function lose()
    {
        alert("you lose");
        makeWorld();
    }

    function throwBread()
    {
        alert("X: " + sprite.body.x + "Y: " + sprite.body.y);
        alert("Vel: " + sprite.body.speed);
        newBread = game.add.sprite(sprite.body.X, sprite.body.Y, 'Bread');
        // sprite.X
    }

    // code taken from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
