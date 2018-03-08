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

    // holds log of all actions taken
    var actionLog = new Array();

    // keeps track of the current slide when in story mode
    var storyCounter;

    // keeps track of whether a public/private witness button is held down
    var currentlyGuessing;

    // animal used to guess
    var guessAnimal;

    // keep track of how many correct guesses for each player
    var playerScore;
    var crowScore;

    // store text style for score displays
    var scoreStyle = { font: "125px Arial", fill: "#ffffff", align: "center" };

    // variables holding score displays
    var playerScoreDisplay;
    var crowScoreDisplay;

    // holds data for crow to refenence
    var crowKnowledgeBank = new Array(5);

    // hold conspirator buttons
    var conspiratorButtons = new Array(5);


    function create() 
    {
    	// Set correct guesses to zero
    	playerScore = 0;
    	crowScore = 0;

    	// Create counter for moving the story slides
        storyCounter = 0;

       	// Start in "non-guessing" mode
        currentlyGuessing = 0;

        // Set Crow's knowledge bank to clear
        for(var i = 0; i < 5; i++)
        {
        	crowKnowledgeBank[i] = [["Red", "Blue", "Green", "Yellow"], ["Pig", "Cow", "Sheep", "Goat"]];
        }
        
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
        game.add.sprite(0, 0, 'IntroFrame1');
        gameMode = 2;
    }

    function enterPlayMode()
    {
        game.add.sprite(0, 0, 'PlayBG');

        // Set score displays to zero
  	  	crowScoreDisplay = game.add.text(845, 30, crowScore, scoreStyle);
    	playerScoreDisplay = game.add.text(845, 605, playerScore, scoreStyle);

        // Create buttons on screen
        initButtons();

        // toggle game mode to play mode
        gameMode = 1;
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
    }

    // Conspirator prototype has a color, species, and state of being guessed or unguessed
    function Conspirator(color, species, guessed)
    {
        this.color = color;
        this.species = species;
        this.guessed = false;
        var IDNumber;
    }

    // Create a random combination of animals in the public and private witness pools
    function initWitnesses()
    {
        // populate witnesses (public and private) by filling array animalBank[] and distributing them to players and public witness pool
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
        var conspiratorsCreated = 0;
        while(conspiratorsCreated < 5)
        {
            // create a newAnimal var which will be added to the conspirators array
            var newConspirator;
            while(true)
            {
                // set newAnimal to a randomly generated animal
                newConspirator = genRandomConspirator();

                // Scan the conspirators array to ensure newAnimal is not a duplicate of a previously added animal
                var repeatCounter = 0;
                for(var i = 0; i < conspiratorsCreated; i++)
                {
                    if((newConspirator.color == conspirators[i].color) && (newConspirator.species == conspirators[i].species))
                    {
                        repeatCounter++;
                    }
                }
                // If no duplicate is found, add it to conspirators[]
                if(repeatCounter < 1)
                {
                	// update the conspirator's ID number to reflect it's position in the conspirators[] array
                	newConspirator.IDNumber = i;

                	// add the newConspirator to the conspirators[] array
                    conspirators[conspiratorsCreated] = newConspirator;

                    // increment and move through the loop
                    conspiratorsCreated++;
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

    // return an animal of random color and species
    function genRandomConspirator()
    {
        var newColor = colorsArray[getRandomInt(0,3)];
        var newSpecies = speciesArray[getRandomInt(0,3)];
        var newConspirator = new Conspirator(newColor, newSpecies, false);
        return newConspirator;
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
        conspiratorButtons[0] = con1;

        var con2 = game.add.button(815, 240, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
		con2.name = 1;
		conspiratorButtons[1] = con2;

        var con3 = game.add.button(970, 240, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con3.name = 2;
        conspiratorButtons[2] = con3;

        var con4 = game.add.button(735, 390, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con4.name = 3;
        conspiratorButtons[3] = con4;

        var con5 = game.add.button(890, 390, 'UnknownButton', conspiratorButtonPress, this, 2, 1, 0);
        con5.name = 4;
        conspiratorButtons[4] = con5;
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
        currentlyGuessing = 2;

        // store the animal selected to be compared with another selection
        guessAnimal = playerWitnesses[this.name];
    }

    function conspiratorButtonPress()
    {
    	// prevent the attempted guessing of an already guessed conspirator
    	if(conspirators[this.name].guessed == true)
    	{
    		window.alert("That conspirator has already been guessed!");
    		return;
    	}

    	// if a conspirator button is pressed without previously having hit a witness button, register a guess
    	if(currentlyGuessing == 0)
    	{
    		var answer = (conspirators[this.name].color + " " + conspirators[this.name].species);
    		var playerGuess = prompt("Enter your guess!", "(e.g. 'Red Sheep', case sensitive and include the space)");

    		// result used for documentation
    		var result; 

    		// if the player's guess is correct
    		if(answer == playerGuess)
    		{
    			// store the result for documentation in the actionLog
    			result = "True";
    			documentAction("player", result);

    			// set the conspirator's guessed state to "true"
    			conspirators[this.name].guessed = true;

    			// alert the player to the result of their guess
    			window.alert("Correct!");

    			// reveal the conspirator behind the door
    			this.key = (conspirators[this.name].color + conspirators[this.name].species);
    			this.loadTexture((conspirators[this.name].color + conspirators[this.name].species), 0);

    			// increment the scoreboard
    			playerScore++;
    			playerScoreDisplay.destroy();
    			playerScoreDisplay = game.add.text(845, 605, playerScore, scoreStyle);

    			// if the player has guessed a plurality of animals, notify them of their win and reset the game
    			if(playerScore == 3)
    			{
    				window.alert("You've guessed the most animals, you win!");
    				create();
    				enterPlayMode();
    			}
    		}
    		// if the player's guess is incorrect
    		else
    		{	
    			// store the result for documentation
    			result = "False";
    			documentAction("player", result);

    			// alert the player to the result of their guess
    			window.alert("Nope, try again!");
    		}

    		// reset guessAnimal
    		guessAnimal = 0;
    	}

    	// if a conspirator button is pressed after a witness button is pressed, compare the animals and display the result
    	else
    	{
    		// compare the guessAnimal and the targeted comparison and store the result in variable comparisonResult
    		var comparisonResult = compareAnimals(guessAnimal, conspirators[this.name]);

    		// alert user to result of comparison
    		window.alert("Matched " + compareAnimals(guessAnimal, conspirators[this.name]) + "!");

    		// if a public witness is used, pass collected information to Crow's knowledge bank
    		if(currentlyGuessing == 1)
    		{
    			updateKnowledgeBank(comparisonResult, this.name);
    		}

    		// document the the comparison in the actionLog
     		documentAction("player", comparisonResult)

     		// reset to not currently guessing
    		currentlyGuessing = 0;

    		// reset guessAnimal
    		guessAnimal = 0;
    	}

    	// queue Crow's turn
        crowTurn();
    }

    function crowTurn()
    {
    	// holds amount (out of 6) known about the target conspirator
    	var maxAmountKnown = 0;

    	// holds the breakdown of colors and species known about the target
    	var colorsEliminated = 0;
    	var speciesEliminated = 0;

    	// holds the position in the conspirators[] of the target conspirator
    	var targetID = 0;

    	// peruse each possible conspirator and determine the conspirator Crow will take action on
    	for(var i = 0; i < 5; i++)
    	{
    		var currentCount = 0;
    		var currentColorsCount = 0;
    		var currentSpeciesCount = 0;

    		// hold the current conspirator being investigated in a variable
    		var currentConspirator = crowKnowledgeBank[i]

    		// determine how much color data is known about the current conspirator
    		for(var j = 0; j < 4; j++)
    		{
    			if(currentConspirator[0][j] == "eliminated")
    			{
    				currentColorsCount++;
    				currentCount++;
    			}
    		}

    		// determine how much species data is known about the current conspirator
    		for(var k = 0; k < 4; k++)
    		{
    			if(currentConspirator[1][k] == "eliminated")
    			{
    				currentSpeciesCount++;
    				currentCount++;
    			}
    		}

    		// if more is known about that current conspirator than previous conspirators, set the target to the current conspirator (omit revealed conspirators)
    		if((currentCount > maxAmountKnown) && (conspirators[i].guessed == false))
    		{
    			targetID = i;
    			maxAmountKnown = currentCount;
    			colorsEliminated = currentColorsCount;
    			speciesEliminated = currentSpeciesCount;
    		}
    	}



    	// if Crow has a certain guess, make it
    	if(maxAmountKnown == 6)
    	{
    		// set conspirator's guessed status to true
    		conspirators[targetID].guessed = true;

    		// alert player to Crow's guess
    		window.alert("Crow guesses that Conspirator #" + (targetID + 1) + " is the " + conspirators[targetID].color + " " + conspirators[targetID].species + ".\nHe is correct!");

    		// reveal the conspirator behind the door
    		conspiratorButtons[targetID].key = (conspirators[targetID].color + conspirators[targetID].species);
    		conspiratorButtons[targetID].loadTexture((conspirators[targetID].color + conspirators[targetID].species), 0);

    		// increment Crow's score
    		crowScore++;
    		crowScoreDisplay.destroy();
    		crowScoreDisplay = game.add.text(845, 30, crowScore, scoreStyle);

    		// if Crow identifies a plurality of conspirators, notify the player and reset the game
    		if(crowScore == 3)
    		{
    			window.alert("Inspector Crow identified the most conspirators, try again!");
    			create();
    			enterPlayMode();
    		}
    	}

    	// if Crow has a 50% chance, take the guess
    	else if((maxAmountKnown == 5))
    	{
    		// holds the color to be guessed
    		var colorGuess;

    		// pick the first of up to two remaining colors to guess
    		for(var j = 0; j < 4; j++)
    		{
    			if(crowKnowledgeBank[targetID][0][j] != "eliminated")
    			{
    				colorGuess = crowKnowledgeBank[targetID][0][j];
    				break;
    			}
    		}

    		// holds the species to be guessed
    		var speciesGuess; 

    		// pick the first up to two remaining colors to guess
    		for(var k = 0; k < 4; k++)
    		{
    			if(crowKnowledgeBank[targetID][1][k] != "eliminated")
    			{
    				speciesGuess = crowKnowledgeBank[targetID][1][k];
    				break;
    			}
    		}

    		// if the guess is correct
    		if((conspirators[targetID].color == colorGuess) && (conspirators[targetID].species == speciesGuess))
    		{
    			// set conspirator's guessed status to true
    			conspirators[targetID].guessed = true;

    			// alert player to Crow's guess
    			window.alert("Crow guesses that Conspirator # " + (targetID + 1) + " is the " + colorGuess + " " + speciesGuess + ".\nHe is correct!");

    			// reveal the conspirator behind the door
	    		conspiratorButtons[targetID].key = (conspirators[targetID].color + conspirators[targetID].species);
	    		conspiratorButtons[targetID].loadTexture((conspirators[targetID].color + conspirators[targetID].species), 0);

	    		// increment Crow's score
	    		crowScore++;
	    		crowScoreDisplay.destroy();
	    		crowScoreDisplay = game.add.text(845, 30, crowScore, scoreStyle);

	    		// if Crow identifies a plurality of conspirators, notify the player and reset the game
	    		if(crowScore == 3)
	    		{
	    			window.alert("Inspector Crow identified the most conspirators, try again!");
	    			create();
	    			enterPlayMode();
	    		}
    		}

    		// if the guess is incorrect
    		else
    		{
    			// alert player to Crow's guess
    			window.alert("Crow guesses that Conspirator # " + (targetID + 1) + " is the " + colorGuess + " " + speciesGuess + ".\nHe is wrong!");

    			// update knowledgeBank to reflect wrong answer
    			if(colorsEliminated == 2)
    			{
    				for(var i = 0; i < 4; i++)
    				{
    					if(crowKnowledgeBank[targetID][0][i] == colorGuess)
    					{
    						crowKnowledgeBank[targetID][0][i] = "eliminated";
    					}
    				}
    			}
    			if(speciesEliminated == 2)
    			{
    				for(var i = 0; i < 4; i++)
    				{
    					if(crowKnowledgeBank[targetID][1][i] == speciesGuess)
    					{
    						crowKnowledgeBank[targetID][1][i] = "eliminated";
    					}
    				}
    			}
    		}
    	}

    	// if crow does not have a viable guess, use a witness
    	if(maxAmountKnown < 5)
    	{

            // corrects error in which known animals are guessed by the AI
            if(conspirators[targetID].guessed == true)
            {
                for(var l = 0; l < 5; l++)
                {
                    if(conspirators[l].guessed == false)
                    {
                        targetID = l;
                        break;
                    }
                }
            }
            
    		// holds the pointer to the targeted conspirator in the knowledge bank
    		var targetConspirator = crowKnowledgeBank[targetID];

    		if(colorsEliminated >= speciesEliminated)
    		{
    			for(var i = 0; i < 4; i++)
    			{
    				if(targetConspirator[1][i] == crowWitnesses[0].species)
    				{
    					// console.log("Entered if");
    					guessAnimal = new Animal(crowWitnesses[0].color, crowWitnesses[0].species);
    					var newComparison = compareAnimals(guessAnimal, conspirators[targetID]);
    					updateKnowledgeBank(newComparison, targetID);

    					window.alert("Crow compares Private Witness #1 against Conspirator #" + (targetID+1) + "\nMatched " + newComparison + "!");
    					return;
    				}

    				else if(targetConspirator[1][i] == crowWitnesses[1].species)
    				{
    					// console.log("Entered else if");
    					guessAnimal = new Animal(crowWitnesses[0].color, crowWitnesses[0].species);
    					var newComparison = compareAnimals(guessAnimal, conspirators[targetID]);
    					updateKnowledgeBank(newComparison, targetID);

    					window.alert("Crow compares Private Witness #2 against 'Conspirator #" + (targetID+1) + "\nMatched " + newComparison + "!");
    					return;
    				}
    				else
    				{
    					for(var j = 0; j < 6; j++)
    					{
    						if(publicWitnesses[j].species == targetConspirator[1][i])
    						{
    							guessAnimal = publicWitnesses[j];
    							var newComparison = compareAnimals(guessAnimal, conspirators[targetID]);
    							updateKnowledgeBank(newComparison, targetID);
    							window.alert("Crow compares the " + guessAnimal.color + " " + guessAnimal.species +  " against 'Conspirator #" + (targetID+1) + "\nMatched " + newComparison + "!");
    							return;
    						}
    					}
    				}
    			}
    		}

    		else if(speciesEliminated > colorsEliminated)
    		{
    			for(var i = 0; i < 4; i++)
    			{
    				if(targetConspirator[0][i] == crowWitnesses[0].color)
    				{
    					guessAnimal = new Animal(crowWitnesses[0].color, crowWitnesses[0].species);
    					var newComparison = compareAnimals(guessAnimal, conspirators[targetID]);
    					updateKnowledgeBank(newComparison, targetID);

    					window.alert("Crow compares Private Witness #1 against Conspirator #" + (targetID+1) + "\nMatched " + newComparison + "!");
    					return;
    				}
    				else if(targetConspirator[0][i] == crowWitnesses[1].color)
    				{
    					guessAnimal = new Animal(crowWitnesses[0].color, crowWitnesses[0].species);
    					var newComparison = compareAnimals(guessAnimal, conspirators[targetID]);
    					updateKnowledgeBank(newComparison, targetID);

    					window.alert("Crow compares Private Witness #2 against 'Conspirator #" + (targetID+1) + "\nMatched " + newComparison + "!");
    					return;
    				}
    				else
    				{
    					for(var j = 0; j < 6; j++)
    					{
    						if(publicWitnesses[j].color == targetConspirator[0][i])
    						{
    							guessAnimal = publicWitnesses[j];
    							var newComparison = compareAnimals(guessAnimal, conspirators[targetID]);
    							updateKnowledgeBank(newComparison, targetID);
    							window.alert("Crow compares the " + guessAnimal.color + " " + guessAnimal.species +  " against 'Conspirator #" + (targetID+1) + "\nMatched " + newComparison + "!");
    							return;
    						}
    					}
    				}
    			}
    		}
    	}
    }

    function consolePrintActionLog()
    {
    	console.log("--------------------");
    	console.log("    ACTION LOG");
    	console.log("--------------------");
    	for(var i = 0; i < actionLog.length; i++)
    	{
    		console.log("Turn #" + (i+1) + ": [" + actionLog[i].toString() + "]");
    	}
    }

    // store the data pertaining to an action in the action log
    function documentAction(player, result)
    {
    	var witnessLetter;
    	// check if animal is player's "A" card
    	if(guessAnimal = 0)
    	{
    		witnessLetter = "n";
    	}
    	else if((guessAnimal.color == playerWitnesses[0].color) && (guessAnimal.species == playerWitnesses[0].species))
		{
			witnessLetter = "A";
		}
		// check if animal is player's "B" card
		else if((guessAnimal.color == playerWitnesses[1].color) && (guessAnimal.species == playerWitnesses[1].species))
		{
			witnessLetter = "B";
		}
		else if((guessAnimal.color == crowWitnesses[0].color) && (guessAnimal.species == crowWitnesses[0].species))
		{
			witnessLetter = "A";
		}
		// check if animal is player's "B" card
		else if((guessAnimal.color == crowWitnesses[1].color) && (guessAnimal.species == crowWitnesses[1].species))
		{
			witnessLetter = "B";
		}
		else
		{
			witnessLetter = "public";
		}

		// determine type of guess used for documentation in actionLog
		var guessType;
		if(currentlyGuessing == 1)
		{
			guessType = "public";
		}
		else if(currentlyGuessing == 2)
		{
			guessType = "private";
		}
		else if(currentlyGuessing == 0)
		{
			guessType = "guess";
		}
		else
		{
			guessType = "something has gone horribly wrong";
		}

		var actionLogEntry = [player, guessType, witnessLetter, "conspiratorNumber", result];
        actionLog.push(actionLogEntry);

    }

    // updates Crow's knowledge bank to reflect match data
    function updateKnowledgeBank(matchType, conspiratorID)
    {
		if(matchType == "Color")
		{
			// create a var pointing to the conspirator and its associated color array in Crow's knowledge bank
			var conspiratorColorData = crowKnowledgeBank[conspiratorID][0];

			// eliminate all colors from the conspirator's color data that doesn't match the revealed color
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorColorData[i] != guessAnimal.color)
				{
					conspiratorColorData[i] = "eliminated";
				}
			}

			// create a var pointing to the conspirator and its associated species array in Crow's knowledge bank
			var conspiratorSpeciesData = crowKnowledgeBank[conspiratorID][1];

			// eliminate the guessAnimal's species from associated conspirator in Crow's knowledge bank
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorSpeciesData[i] == guessAnimal.species)
				{
					conspiratorSpeciesData[i] = "eliminated";
				}
			}

			// CRITICAL DEBUGGING LINE, left in for future iterations
			// window.alert("Data moved to crowKnowledgeBank\n" + "Colors: [" + conspiratorColorData.toString() + "]\n" + "Species: [" + conspiratorSpeciesData.toString() + "]");
		}

		else if(matchType == "Species")
		{
			// create a var pointing to the conspirator and its associated species array in Crow's knowledge bank
			var conspiratorSpeciesData = crowKnowledgeBank[conspiratorID][1];

			// eliminate all species from the conspirator's color data that doesn't match the revealed color
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorSpeciesData[i] != guessAnimal.species)
				{
					conspiratorSpeciesData[i] = "eliminated";
				}
			}

			// create a var pointing to the conspirator and its associated color array in Crow's knowledge bank
			var conspiratorColorData = crowKnowledgeBank[conspiratorID][0];

			// eliminate the guessAnimal's color from associated conspirator in Crow's knowledge bank
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorColorData[i] == guessAnimal.color)
				{
					conspiratorColorData[i] = "eliminated";
				}
			}

			// CRITICAL DEBUGGING LINE, left in for future iterations
			// window.alert("Data moved to crowKnowledgeBank\n" + "Colors: [" + conspiratorColorData.toString() + "]\n" + "Species: [" + conspiratorSpeciesData.toString() + "]");
		}

		else if(matchType == "Both")
		{
			// create a var pointing to the conspirator and its associated color array in Crow's knowledge bank
			var conspiratorColorData = crowKnowledgeBank[conspiratorID][0];

			// eliminate all colors from the conspirator's color data that doesn't match the revealed color
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorColorData[i] != guessAnimal.color)
				{
					conspiratorColorData[i] = "eliminated";
				}
			}

			// create a var pointing to the conspirator and its associated species array in Crow's knowledge bank
			var conspiratorSpeciesData = crowKnowledgeBank[conspiratorID][1];

			// eliminate all species from the conspirator's color data that doesn't match the revealed color
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorSpeciesData[i] != guessAnimal.species)
				{
					conspiratorSpeciesData[i] = "eliminated";
				}
			}

			// CRITICAL DEBUGGING LINE, left in for future iterations
			// window.alert("Data moved to crowKnowledgeBank\n" + "Colors: [" + conspiratorColorData.toString() + "]\n" + "Species: [" + conspiratorSpeciesData.toString() + "]");
		}

		else if(matchType == "Neither")
		{
			// create a var pointing to the conspirator and its associated color array in Crow's knowledge bank
			var conspiratorColorData = crowKnowledgeBank[conspiratorID][0];

			// eliminate the guessAnimal's color from associated conspirator in Crow's knowledge bank
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorColorData[i] == guessAnimal.color)
				{
					conspiratorColorData[i] = "eliminated";
				}
			}

			// create a var pointing to the conspirator and its associated species array in Crow's knowledge bank
			var conspiratorSpeciesData = crowKnowledgeBank[conspiratorID][1];

			// eliminate the guessAnimal's species from associated conspirator in Crow's knowledge bank
			for(var i = 0; i < 4; i++)
			{
				if(conspiratorSpeciesData[i] == guessAnimal.species)
				{
					conspiratorSpeciesData[i] = "eliminated";
				}
			}

			// CRITICAL DEBUGGING LINE, left in for future iterations
			// window.alert("Data moved to crowKnowledgeBank\n" + "Colors: [" + conspiratorColorData.toString() + "]\n" + "Species: [" + conspiratorSpeciesData.toString() + "]");
		}
    }

};
