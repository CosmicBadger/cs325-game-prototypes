"use strict";

window.onload = function() 
{
    
    var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() 
    {
        game.load.image('TitlePage', 'assets/TitlePage.png');
        game.load.image('IntroFrame1', 'assets/IntroFrame1.png');
        game.load.image('IntroFrame2', 'assets/IntroFrame2.png');
        game.load.image('IntroFrame3', 'assets/IntroFrame3.png');
        game.load.image('IntroFrame4', 'assets/IntroFrame4.png');
        game.load.image('IntroFrame5', 'assets/IntroFrame5.png');
        game.load.image('IntroFrame6', 'assets/IntroFrame6.png');
        game.load.image('PlayBG', 'assets/PlayBG.png');
        game.load.image('InstructionsPage', 'assets/InstructionsPage.png');
        game.load.image('UnknownButton', 'assets/UnknownButton.png');
        game.load.image('RedPig', 'assets/RedPig.png');
        game.load.image('RedCow', 'assets/RedCow.png');
        game.load.image('RedSheep', 'assets/RedSheep.png');
        game.load.image('RedGoat', 'assets/RedGoat.png');
        game.load.image('BluePig', 'assets/BluePig.png');
        game.load.image('BlueCow', 'assets/BlueCow.png');
        game.load.image('BlueSheep', 'assets/BlueSheep.png');
        game.load.image('BlueGoat', 'assets/BlueGoat.png');
        game.load.image('GreenPig', 'assets/GreenPig.png');
        game.load.image('GreenCow', 'assets/GreenCow.png');
        game.load.image('GreenSheep', 'assets/GreenSheep.png');
        game.load.image('GreenGoat', 'assets/GreenGoat.png');
        game.load.image('YellowPig', 'assets/YellowPig.png');
        game.load.image('YellowCow', 'assets/YellowCow.png');
        game.load.image('YellowSheep', 'assets/YellowSheep.png');
        game.load.image('YellowGoat', 'assets/YellowGoat.png');
    }
    
    // 0 = Title Screen, 1 = Gameplay, 2 = Story, 3 = Instructions
    var gameMode = 0;

    // Create keyboard keys to listen for
    var pKey;
    var sKey;
    var iKey;
    var key1;

    // arrays hold Animal attributes
    var colorsArray = ["Red", "Blue", "Green", "Yellow"];
    var speciesArray = ["Pig", "Cow", "Sheep", "Goat"];

    // holds animals to be ditributed as witnesses
    var animalBank = new Array(10);

    // holds witnesses
    var crowWitnesses = Array(2);
    var playerWitnesses = Array(2);
    var publicWitnesses = new Array(6);
    var conspirators = new Array(5)

    // keeps track of the current slide when in story mode
    var storyCounter;

    // keeps track of whether a public/private witness button is held down
    var currentlyGuessing;

    // 
    var guessAnimal;

    // keep track of how many correct guesses
    var correctGuesses;

    function create() 
    {
    	// Set correct guesses to zero
    	correctGuesses = 0;

    	// Create counter for moving the story slides
        storyCounter = 0;

       	// Start in "non-guessing" mode
        currentlyGuessing = 0;
        
        // Create the title page
        game.add.sprite(0, 0, 'TitlePage');

        // Initialize keyboard input
        game.input.enabled = true;
        sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        iKey = game.input.keyboard.addKey(Phaser.Keyboard.I);

        // Initialize witnesses and conspirators
        initWitnesses();
        initConspirators();

        // Print witnesses and conspirators to console for debugging
        consolePrintData();
    }
    
    function update() 
    {
        // only allow entrance into story mode from the title screen
        if(gameMode == 0)
        {
            sKey.onDown.add(enterStoryMode, this);
            pKey.onDown.add(enterPlayMode, this);
            iKey.onDown.add(enterInstructionsMode, this);

        }
        else if(gameMode == 2)
        {
            sKey.onDown.add(advanceStory, this);
        }
    }

    function enterStoryMode()
    {
        // console.log("enterStoryMode() -whenGameMode =0");
        // console.log("'gameMode in enterStoryMode() = " + gameMode + "'");
        game.add.sprite(0, 0, 'IntroFrame1');
        gameMode = 2;
        // storyCounter = 0;   
    }

    function enterPlayMode()
    {
        // console.log("enterStoryMode() -whenGameMode =0");
        // console.log("'gameMode in enterStoryMode() = " + gameMode + "'");
        game.add.sprite(0, 0, 'PlayBG');

        // Create buttons on screen
        initButtons();

        // toggle game mode to play mode
        gameMode = 1;
        // storyCounter = 0;  
    }

    // display instructions for the player
    function enterInstructionsMode()
    {
    	console.log("reached");
    	game.add.sprite(0, 0, 'InstructionsPage');
    	gameMode = 3;
    }

    function advanceStory()
    {
    	// I cannot figure out a particular bug, so I'm leaving in 
    	// these debugging lines so I can revisit in a future iteration

        // console.log("------------------------");
        // console.log("'Story counter before = " + storyCounter + "'");
        // console.log("'Game mode before = " + gameMode + "'");

        if(storyCounter == 0)
        {
            game.add.sprite(0, 0, 'IntroFrame2');
            storyCounter++;
        }
        else if(storyCounter == 1)
        {
            game.add.sprite(0, 0, 'IntroFrame3');
            storyCounter++;
        }
        else if(storyCounter == 2)
        {
            game.add.sprite(0, 0, 'IntroFrame4');
            storyCounter++;
        }
        else if(storyCounter == 3)
        {
            game.add.sprite(0, 0, 'IntroFrame5');
            storyCounter++;
        }
        else if(storyCounter == 4)
        {
            game.add.sprite(0, 0, 'IntroFrame6');
            storyCounter++;
        }
        else if(storyCounter == 5)
        {
            game.add.sprite(0, 0, 'TitlePage');
            gameMode = 0;
            storyCounter = 0;
        }
        else
        {
            console.log("else");
        }

        // console.log("'Story counter after = " + storyCounter + "'");
        // console.log("'Game mode after = " + gameMode + "'");
    }

    // Public
    function buttonPress(int) 
    {
        console.log("Click.");

    }

    // Animal prototype has a color and a species
    function Animal(color, species)
    {
        this.color = color;
        this.species = species;
        // this.button = 0;
    }

    // Create a random combination of animals in the public and private witness pools
    function initWitnesses()
    {
        // populate witnesses (public and private)
        var animalsCreated = 0;
        while(animalsCreated < 10)
        {
            // create a newAnimal var which will be added to the animalBank array
            var newAnimal;
            while(true)
            {
                // set newAnimal to a randomly generated animal
                newAnimal = genRandomAnimal();

                // Scan the animalBank array to ensure newAnimal is not a duplicate of a previously added animal
                var repeatCounter = 0;
                for(var i = 0; i < animalsCreated; i++)
                {
                    if((newAnimal.color == animalBank[i].color) && (newAnimal.species == animalBank[i].species))
                    {
                        repeatCounter++;
                    }
                }
                // If no duplicate is found, add it to animalBank[]
                if(repeatCounter < 1)
                {
                    animalBank[animalsCreated] = newAnimal;
                    animalsCreated++;
                    break;
                }
            }
        }
    
    	// Take the animals in the animalBank and distribute them between players and the public witnesses
        for(var j = 0; j < 6; j++)
        {
            publicWitnesses[j] = animalBank[j];
        }
        crowWitnesses[0] = animalBank[6];
        crowWitnesses[1] = animalBank[7];
        playerWitnesses[0] = animalBank[8];
        playerWitnesses[1] = animalBank[9];
    }

    // Create a random combination of animals in the conspirators pool
    function initConspirators()
    {
        // populate witnesses (public and private)
        var animalsCreated = 0;
        while(animalsCreated < 5)
        {
            // create a newAnimal var which will be added to the conspirators array
            var newAnimal;
            while(true)
            {
                // set newAnimal to a randomly generated animal
                newAnimal = genRandomAnimal();

                // Scan the conspirators array to ensure newAnimal is not a duplicate of a previously added animal
                var repeatCounter = 0;
                for(var i = 0; i < animalsCreated; i++)
                {
                    if((newAnimal.color == conspirators[i].color) && (newAnimal.species == conspirators[i].species))
                    {
                        repeatCounter++;
                    }
                }
                // If no duplicate is found, add it to conspirators[]
                if(repeatCounter < 1)
                {
                    conspirators[animalsCreated] = newAnimal;
                    animalsCreated++;
                    break;
                }
            }
        }
    }

    // return an animal of random color and species
    function genRandomAnimal()
    {
        var newColor = colorsArray[getRandomInt(0,3)];
        var newSpecies = speciesArray[getRandomInt(0,3)];
        var newAnimal = new Animal(newColor, newSpecies);
        return newAnimal;
    }

    // code taken from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // print a formatted list of witnesses and conspirators to the console
    function consolePrintData()
    {
    	console.log("CONSPIRATORS:");
    	for(var l = 0; l < 5; l++)
    	{
    		console.log(conspirators[l].color + " " + conspirators[l].species);
    	}

    	console.log("PUBLIC WITNESSES:");
    	for(var i = 0; i < 6; i++)
    	{
    		console.log(publicWitnesses[i].color + " " + publicWitnesses[i].species);
    	}

    	console.log("PLAYER WITNESSES:");
    	for(var j = 0; j < 2; j++)
    	{
    		console.log(playerWitnesses[j].color + " " + playerWitnesses[j].species);
    	}

    	console.log("CROW WITNESSES:");
    	for(var k = 0; k < 2; k++)
    	{
    		console.log(crowWitnesses[k].color + " " + crowWitnesses[k].species);
    	}
    }

    // take two animals and compare their color and species
    function compareAnimals(animal1, animal2)
    {
    	var response = "Response";

		if((animal1.color == animal2.color) && ((animal1.species) == (animal2.species)))
		{
			response = "Both";
		}
		else if(animal1.color == animal2.color)
		{
			response = "Color";
		}
		else if(animal1.species == animal2.species)
		{
			response = "Species";
		}
		else
		{
			response = "Neither";
		}

		return response;
    }

    // Create buttons on the screen corresponding to each animal
    function initButtons()
    {
    	// Public Witnesses Buttons
        var wit1 = game.add.button(50, 240, (publicWitnesses[0].color + publicWitnesses[0].species), publicButtonPress, this, 2, 1, 0);
        wit1.name = 0;
        var wit2 = game.add.button(205, 240, (publicWitnesses[1].color + publicWitnesses[1].species), publicButtonPress, this, 2, 1, 0);
        wit2.name = 1;
        var wit3 = game.add.button(360, 240, (publicWitnesses[2].color + publicWitnesses[2].species), publicButtonPress, this, 2, 1, 0);
        wit3.name = 2;
        var wit4 = game.add.button(50, 390, (publicWitnesses[3].color + publicWitnesses[3].species), publicButtonPress, this, 2, 1, 0);
        wit4.name = 3;
        var wit5 = game.add.button(205, 390, (publicWitnesses[4].color + publicWitnesses[4].species), publicButtonPress, this, 2, 1, 0);
        wit5.name = 4;
        var wit6 = game.add.button(360, 390, (publicWitnesses[5].color + publicWitnesses[5].species), publicButtonPress, this, 2, 1, 0);
        wit6.name = 5;

        // Player Witnesses Buttons
       	var pla1 = game.add.button(140, 600, (playerWitnesses[0].color + playerWitnesses[0].species), privateButtonPress, this, 2, 1, 0);
       	pla1.name = 0;
        var pla2 = game.add.button(290, 600, (playerWitnesses[1].color + playerWitnesses[1].species), privateButtonPress, this, 2, 1, 0);
        pla2.name = 1;

        // Crow Witnesses Buttons
        var cro1 = game.add.button(140, 25, 'UnknownButton', buttonPress, this, 2, 1, 0);
        var cro2 = game.add.button(290, 25, 'UnknownButton', buttonPress, this, 2, 1, 0);

        // Conspirator Buttons
        var con1 = game.add.button(660, 240, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con1.name = 0;
        var con2 = game.add.button(815, 240, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
		con2.name = 1;
        var con3 = game.add.button(970, 240, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con3.name = 2;
        var con4 = game.add.button(735, 390, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con4.name = 3;
        var con5 = game.add.button(890, 390, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con5.name = 4;
    }

   
    function publicButtonPress() 
    {
        // enter "guessing mode"
        currentlyGuessing = 1;

        // store the animal selected to be compared with another selection
        guessAnimal = publicWitnesses[this.name];

    }

    function privateButtonPress() 
    {        
        // enter "guessing mode"
        currentlyGuessing = 1;

        // store the animal selected to be compared with another selection
        guessAnimal = playerWitnesses[this.name];

    }

    function conspiratorButtonPress()
    {
    	console.log("currentlyGuessing: " + currentlyGuessing);
    	if(currentlyGuessing == 0)
    	{
    		var answer = (conspirators[this.name].color + " " + conspirators[this.name].species);
    		var playerGuess = prompt("Enter your guess!", "(e.g. 'Red Sheep', case sensitive and include the space)");
    		if(answer == playerGuess)
    		{
    			window.alert("Correct!");
    			this.key = (conspirators[this.name].color + conspirators[this.name].species);
    			this.loadTexture((conspirators[this.name].color + conspirators[this.name].species), 0);
    			correctGuesses++;
    			if(correctGuesses == 5)
    			{
    				window.alert("You've guessed all the animals, you win!");
    				create();
    				enterPlayMode();
    			}
    		}
    		else
    		{
    			window.alert("Nope, try again!");
    		}
    	}
    	else
    	{
    		window.alert("Matched " + compareAnimals(guessAnimal, conspirators[this.name]) + "!");
    		currentlyGuessing = 0;
    	}
    }

};
