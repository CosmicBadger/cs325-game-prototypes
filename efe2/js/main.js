"use strict";

// Edit compareHands() two-pair section to account for two hands with equal high pairs, but unequal secondary pairs
// Edit compareHands() pair section to account for two hands with equal pairs

// https://phaser.io/examples/v2/buttons/changing-the-frames

window.onload = function() 
{
    
    var game = new Phaser.Game(1000, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() 
    {
        game.load.image('PlayBG', 'assets/PlayBG.png');
        game.load.spritesheet('CardIcons', 'assets/CardIcons.png', 110, 110, 120);
        game.load.spritesheet('HandIcons', 'assets/HandIcons.png', 110, 45, 9);
        game.load.spritesheet('NumIcons', 'assets/NumIcons.png', 40, 30, 101);
        game.load.spritesheet('SwapButton', 'assets/SwapButton.png', 95, 35, 3);
        game.load.spritesheet('BackupButton', 'assets/BackupButton.png', 95, 35, 3);
        game.load.spritesheet('DiscardButton', 'assets/DiscardButton.png', 95, 35, 3);
        game.load.spritesheet('EndTurnButton', 'assets/EndTurnButton.png', 80, 64, 2);
        game.load.audio('IntroMusic', 'assets/IntroMusic.mp3');
    }
    
    // 0 = Title Screen, 1 = Gameplay, 2 = Story, 3 = Instructions
    var gameMode = 0;

    // Create keyboard keys to listen for
    var pKey;
    var sKey;
    var iKey;
    var key1;
    var ESCkey;

    // Hold 5 card hands for the player and the opponent
    var playerHand = new Array;
    var alienHand = new Array;

    // Hold the entire deck, discard pile, and backup pile
    var deck = new Array;
    var discardPile = new Array;
    var backupPile = new Array;

    // holds the latest card drawn from the deck
    var newCard;

    // hold the sprite representing the new card
    var newCardImage;

    // holds the time left in the game
    var time = 100;

    // holds whether a move has been made on the current turn
    var moveMade;

    var music;

    // hold the control panel buttons
    var swapButton;
    var backupButton;
    var discardButton;
    var endTurnButton;

    // hold whether an action has been take on a given turn
    var hasSwapped;
    var hasBackedUp;
    var hasDiscarded;

    // hold player hand buttons
    var playerHandOne;
    var playerHandTwo;
    var playerHandThree;
    var playerHandFour;
    var playerHandFive;

    // hold alien hand buttons
    var alienHandOne;
    var alienHandTwo;
    var alienHandThree;
    var alienHandFour;
    var alienHandFive;

    // hold backup buttons
    var backupOne;
    var backupTwo;
    var backupThree;

    // hold the UI elements corresponding to:
    // the rank of the aliens' hand
    var alienHandType;
    // the rank of the player's hand
    var playerHandType;
    // the countdown clock
    var timeCount;
    // the number of cards discarded
    var numberDiscarded;

    var buttonsDown = new Array;





    function create() 
    {
        // // Init music
        // music = game.add.audio('IntroMusic');
        // music.loop = true;
        // music.play();

        // Init board
        game.add.sprite(0,0, 'PlayBG');

        // Init key inpiut
        ESCkey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        // Init time
        time = 100;

        // create the deck with 52 cards
        createDeck(52);



        // button template
        // game.add.button(100, 100, 'SwapButton', swapFunction, this, 2, 1, 0);        
        
        // console.log(deck[0].name);
        // console.log(deck[1].name);
        // populate player and alien hands with 5 cards (each) from the deck
        for(var i = 0; i < 5; i++)
        {
            playerHand[i] = deck.pop();
            console.log("Player Hand #" + i + ": " + playerHand[i].name + "; " + playerHand[i].imagePointer)
            alienHand[i] = deck.pop();
        }

        // draw the first card
        newCard = deck.pop();

        // set all actions to not yet taken
        hasSwapped = false;
        hasBackedUp = false;
        hasDiscarded = false;

        // render all buttons, images
        renderUI();

        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // // DEMO
        // window.alert("This game is still unplayable due to the unexpectedly immense amount of logic required to power it, but I've designed a short demo to demonstrate some things I currently have working under the hood");
        // window.alert("You will be prompted to enter a number representing a number of playing cards to be randomly drawn. The program will then build the best possible hand out of those cards in various categories (full house, flush, etc.).");
        // demo();
        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
    }

    function update() 
    {
        //
        ESCkey.onDown.add(escFunction, this);


        if(hasSwapped == true)
        {

        }
        // only allow entrance into story mode from the title screen
        if(gameMode == 0)
        {
            // sKey.onDown.add(enterStoryMode, this);
            // pKey.onDown.add(enterPlayMode, this);
            // iKey.onDown.add(enterInstructionsMode, this);

        }
        else if(gameMode == 2)
        {
            // sKey.onDown.add(advanceStory, this);
        }
    }

    function renderUI()
    {
        playerHand = sortHandByRank(playerHand);
        alienHand = sortHandByRank(alienHand);

        // render player hand
        playerHandOne = game.add.button(42,320, 'CardIcons', cardPress, this, (playerHand[0].imagePointer+60), playerHand[0].imagePointer, (playerHand[0].imagePointer+60), playerHand[0].imagePointer);
        playerHandTwo = game.add.button(196, 320, 'CardIcons', cardPress, this, (playerHand[1].imagePointer+60), playerHand[1].imagePointer, (playerHand[1].imagePointer+60));
        playerHandThree = game.add.button(346, 320, 'CardIcons', cardPress, this, (playerHand[2].imagePointer+60), playerHand[2].imagePointer, (playerHand[2].imagePointer+60));
        playerHandFour = game.add.button(498, 320, 'CardIcons', cardPress, this, (playerHand[3].imagePointer+60), playerHand[3].imagePointer, (playerHand[3].imagePointer+60));
        playerHandFive = game.add.button(650, 320, 'CardIcons', cardPress, this, (playerHand[4].imagePointer+60), playerHand[4].imagePointer, (playerHand[4].imagePointer+60));

        // render alien hand
        alienHandOne = game.add.button(40, 70, 'CardIcons', swapFunction, this, alienHand[0].imagePointer, alienHand[0].imagePointer, alienHand[0].imagePointer);
        alienHandTwo = game.add.button(194, 70, 'CardIcons', swapFunction, this, alienHand[1].imagePointer, alienHand[1].imagePointer, alienHand[1].imagePointer);
        alienHandThree = game.add.button(344, 70, 'CardIcons', swapFunction, this, alienHand[2].imagePointer, alienHand[2].imagePointer, alienHand[2].imagePointer);
        alienHandFour = game.add.button(496, 70, 'CardIcons', swapFunction, this, alienHand[3].imagePointer, alienHand[3].imagePointer, alienHand[3].imagePointer);
        alienHandFive = game.add.button(648, 70, 'CardIcons', swapFunction, this, alienHand[4].imagePointer, alienHand[4].imagePointer, alienHand[4].imagePointer);


        // render backup images
        if(backupPile[0] != null)
        {
            backupOne = game.add.sprite(40, 570, 'CardIcons', backupPile[0].imagePointer);
        }
        if(backupPile[1] != null)
        {
            backupOne = game.add.sprite(195, 570, 'CardIcons', backupPile[1].imagePointer);
        }
        if(backupPile[2] != null)
        {
            backupOne = game.add.sprite(345, 570, 'CardIcons', backupPile[0].imagePointer);
        }

        // render new card
        if(newCard != null)
        {
            newCardImage = game.add.sprite(536, 605, 'CardIcons', newCard.imagePointer);
        }
        
        // render swap button
        if(hasSwapped == false)
        {
            swapButton = game.add.button(672, 597, 'SwapButton', swapFunction, this, 1, 0, 1, 0);   
        }
        else
        {
            swapButton = game.add.button(672, 597, 'SwapButton', swapFunction, this, 2, 2, 2, 2);   
        }

        // render backup button
        if((hasBackedUp == false) && (backupPile.length < 3))
        {
            backupButton = game.add.button(672, 645, 'BackupButton', backupFunction, this, 1, 0, 1, 0);
        }
        else
        {
            backupButton = game.add.button(672, 645, 'BackupButton', backupFunction, this, 2, 2, 2, 2);
        }

        // render discard button
        if(hasDiscarded == false)
        {
            discardButton = game.add.button(672, 690, 'DiscardButton', discardFunction, this, 1, 0, 1, 0);
        }
        else
        {
            discardButton = game.add.button(672, 690, 'DiscardButton', discardFunction, this, 2, 2, 2, 2);
        }

        // render end turn button
        endTurnButton = game.add.button(855, 660, 'EndTurnButton', newTurn, this, 1, 0, 1, 0);

        // add player hand type
        alienHandType = game.add.sprite(846,313, 'HandIcons', getHandType(playerHand, 'int'));

        // add alien hand type
        playerHandType = game.add.sprite(846, 66, 'HandIcons', getHandType(alienHand, 'int'));

        // add time render
        timeCount = game.add.sprite(880, 405, 'NumIcons', (time-1));

        // add discard pile render
        if(discardPile.length > 0)
        {
            console.log("reached");
            numberDiscarded = game.add.sprite(883, 156, 'NumIcons', (discardPile.length-1));
            console.log(printHand(discardPile));
        }
        else
        {
            numberDiscarded = game.add.sprite(883, 156, 'NumIcons', 100)
        }

        // console.log(printHand(discardPile));



    }

    function cardPress()
    {
        if(this.x == 42)
        {
            pressUnpress(0, this);
        }
        else if(this.x < 200)
        {
            pressUnpress(1, this);
        }
        else if(this.x < 400)
        {
            pressUnpress(2, this);
        }
        else if(this.x < 600)
        {
            pressUnpress(3, this);
        }
        else if(this.x < 700)
        {
            pressUnpress(4, this);
        }

        // console printing
        if(buttonsDown[0] == null)
        {
            console.log("Buttons Down: [empty]");
        }
        else if(buttonsDown[1] == null)
        {
            console.log("Buttons Down: " + buttonsDown[0].name);
        }
        else
        {
            console.log("Buttons Down: " + buttonsDown[0].name + " / " + buttonsDown[1].name);
        }
        
    }
    

    function pressUnpress(cardID, button)
    {
        // if the pressed card is in the player's hand
        if(cardID <= 4)
        {
            // if the button is not pressed, change the frame to now appear pressed
            if((buttonsDown[0] == null) && (buttonsDown.length <= 1))
            {
                console.log("buttonsDown[0] is empty // Adding: " + playerHand[cardID].name);
                button.setFrames((playerHand[cardID].imagePointer+60), (playerHand[cardID].imagePointer+60), (playerHand[cardID].imagePointer+60), (playerHand[cardID].imagePointer+60));
                buttonsDown[0] = playerHand[cardID];
            }
            else if(buttonsDown[0].name == playerHand[cardID].name)
            {
                button.setFrames((playerHand[cardID].imagePointer+60), (playerHand[cardID]), (playerHand[cardID].imagePointer), (playerHand[cardID].imagePointer));
                buttonsDown[0] = null;
            }
            else if(buttonsDown.length >= 1)
            {
                console.log("buttonsDown is full!");
            }

        }
        
    }

    function newTurn()
    {
        // create the best possible alien hand
        newAlienHand();

        console.log(printHand(playerHand));
        console.log(getHandType(playerHand, 'string'));
    	// decrease time by random amount
    	time -= getRandomInt(5, 20);

        // the time has run out or the deck has run out of cards, end the game
        if((time < 1) || (deck.length == 0))
        {
            if(compareHands(playerHand, alienHand) == 0)
            {
                alert("Your " + getHandType(playerHand, 'string') + " WINS against the aliens' " + getHandType(alienHand, 'string'));
            }
            else if(compareHands(playerHand, alienHand) == 1)
            {

                alert("Your " + getHandType(playerHand, 'string') + " LOSES against the aliens' " + getHandType(alienHand, 'string'));
            }
            create();
        }

        // if the new card was not discarded, discard it
        if(newCard != null)
        {
            discardPile.push(newCard);
        }

        // create the best possible alien hand
        newAlienHand();
        
    	// draw a card
    	newCard = deck.pop();

        // reset action buttons
        hasSwapped = false;
        hasBackedUp = false;
        hasDiscarded = false;

        // destroy the passive UI elements so that they can be re-rendered
        alienHandType.destroy();
        playerHandType.destroy();
        timeCount.destroy();
        numberDiscarded.destroy();
        swapButton.destroy();
        backupButton.destroy();
        discardButton.destroy();
        newCardImage.destroy();

        // re-render the UI
        renderUI();
    }

    function swapFunction()
    {
        if(hasSwapped == true)
        {
            alert("You've already swapped this turn!");
            return;
        }
        // if no card is selected, prompt the user to select a card
        if(buttonsDown[0] == null)
        {
            alert("Select a card first!");
            return;
        }

        // swap the cards
        var targetCard = buttonsDown[0];
        var replacementCard = newCard;
        for(var i = 0; i < playerHand.length; i++)
        {
            if(playerHand[i].name == targetCard.name)
            {
                newCard = playerHand[i];
                playerHand[i] = replacementCard;
                break;
            }
        }

        // clear buttonsDown
        buttonsDown = new Array;

        // mark a swap as having been completed
        hasSwapped = true;

        // destroy the passive UI elements so that they can be re-rendered
        alienHandType.destroy();
        playerHandType.destroy();
        timeCount.destroy();
        numberDiscarded.destroy();
        swapButton.destroy();
        backupButton.destroy();
        discardButton.destroy();
        newCardImage.destroy();

        // re-render the UI with the swap having been made
        renderUI();
    }

    function discardFunction()
    {
        if(hasDiscarded == true)
        {
            alert("You've already discarded this turn!");
            return;
        }

        // remove the newCard image
        newCardImage.destroy();

        // push the newCard to the discardPile and set it to null
        discardPile.push(newCard);
        newCard = null;

        // clear buttonsDown
        buttonsDown = new Array;

        // make all buttons inoperable
        hasSwapped = true;
        hasDiscarded = true;
        hasBackedUp = true;



        // destroy the passive UI elements so that they can be re-rendered
        alienHandType.destroy();
        playerHandType.destroy();
        timeCount.destroy();
        numberDiscarded.destroy();
        swapButton.destroy();
        backupButton.destroy();
        discardButton.destroy();


        // create the best possible alien hand
        newAlienHand();

        if(newCard == null)
        {
            console.log('NULL');
        }

        // re-render the UI with the swap having been made
        renderUI();
    }

    function backupFunction()
    {
        if(hasBackedUp == true)
        {
            alert("You've already backed up a card this turn!");
            return;
        }

        if(backupPile.length == 3)
        {
            alert('Backup crew is full!');
            return;
        }

        // add the card to the backup pile
        backupPile.push(newCard);


        // remove newCard
        newCard = null;

        // make all buttons inoperable
        hasSwapped = true;
        hasDiscarded = true;
        hasBackedUp = true;

        // destroy the passive UI elements so that they can be re-rendered
        alienHandType.destroy();
        playerHandType.destroy();
        timeCount.destroy();
        numberDiscarded.destroy();
        swapButton.destroy();
        backupButton.destroy();
        discardButton.destroy();
        newCardImage.destroy();

        // re-render the UI with the swap having been made
        renderUI();

    }

    // If ESC is pressed
    function escFunction()
    {
        renderUI();
        buttonsDown = new Array;
    }

    // check if the game has reached end conditiojns
    function checkEnd()
    {
    	if((deck.length == 0) || (time <= 0))
        {
            if(compareHands(playerHand, alienHand) == 0)
            {
                alert("You win!");
            }
            else(compareHands(playerHand, alienHand) == 1)
            {
                alert("You lose");
            }
        }
    }

    function newAlienHand()
    {
        // hold all cards in the alien hand and the discard pile
        var allAlienCards = new Array();

        // add all cards in the alien hand to allAlienCards
        for(var i = 0; i < alienHand.length; i++)
        {
            allAlienCards.push(alienHand[i]);
        }
        // add all cards in the discard pile to allAlienCards
        for(var i = 0; i < discardPile.length; i++)
        {
            allAlienCards.push(discardPile[i]);
        }

        // hold the best possible alien hand that can be constructed
        alienHand = identifyBestHand(allAlienCards);

        // clear the discard pile
        discardPile = new Array;

        // parse the allAlienCards array
        for(var i = 0; i < allAlienCards.length; i++)
        {
            // check each card in allAlienCards again the cards in alienHand
            var isInHand = false;
            for(var j = 0; j < alienHand.length; j++)
            {
                // console.log("COMPARING: " + allAlienCards[i].name + " -> " + alienHand[j].name);
                if(allAlienCards[i].name == alienHand[j].name)
                {
                    // if the card exists in alienHand, set isInHand to true
                    console.log('true');
                    isInHand = true;
                }
            }

            // if the card exists in alienHand, push it to the new discard pile
            if(isInHand == false)
            {
                discardPile.push(allAlienCards[i]);
                console.log('reached');
            }
        }
    }


    function demo()
    {
        while(true)
        {
            var handSize = prompt("Enter number of cards (less than 52) from which to build the best possible hand OR enter 'q' to quit.");
            if(handSize == "q")
            {
                return true;
            }
            else if(Number.isInteger(parseInt(handSize)))
            {
                var returnString = "";

                var testHand = sortHandByRank(createHand(handSize));
                returnString += ("DEMO HAND: \n" + printHand(testHand) + "\n\n");
                var possibleStraights = identifyAllStraights(testHand);
                var straightFlushAttempt = identifyStraightFlush(possibleStraights);
                returnString += ("Straight Flush: \n" + printHand(straightFlushAttempt) + "\n\n");
                var straightAttempt = identifyHighestStraight(possibleStraights);
                returnString += ("Straight: \n" + printHand(straightAttempt) + "\n\n");
                var flushAttempt = identifyFlush(testHand);
                returnString += ("Flush: \n" + printHand(flushAttempt) + "\n\n");
                var fullHouseAttempt = identifyThreeOfKind(testHand);
                returnString += ("Full House: \n" + printHand(fullHouseAttempt) + "\n\n");
                var fourOfKindAttempt = identifyFourOfKind(testHand);
                returnString += ("4-of-a-Kind: \n" + printHand(fourOfKindAttempt) + "\n\n");

                window.alert(returnString);
            }
        }
        

    }

    // Card prototype hold the card's rank (2, ace, jack, etc.) and suit (heart, club, etc.)
    function Card(rank, suit)
    {
        // 11 = jack; 12 = queen; 13 = king; 14 = ace
        this.rank = rank;
        // 0 = diamond; 1 = heart; 2 = spade; 3 = club
        this.suit = suit;
        // assign this card a human comprehensible name
        this.name = getCardName(this);
        // assign this card an image for display
        this.imagePointer = ((rank-2)*4)+suit;
    }

    // create deck with default 52 cards
    function createDeck()
    {
        // add the first card to the deck
        var randRank = getRandomInt(2,14);
        var randSuit = getRandomInt(0,3);
        var newCard = new Card(randRank, randSuit);
        deck.push(newCard);

        // add all remaining cards to the deck
        while(deck.length < 52)
        {
            // generate a new, random card
            randRank = getRandomInt(2,14);
            randSuit = getRandomInt(0,3);
            newCard = new Card(randRank, randSuit);

            // parse the deck for potential duplicates
            var duplicateFound = false;
            for(var i = 0; i < deck.length; i++)
            {
                if(deck[i].name == newCard.name)
                {
                    duplicateFound = true;
                } 
            }

            // if no duplicate found, add the card
            if(duplicateFound == false)
            {
                deck.push(newCard);
            }
        }
    }

    // create deck with a specified length under 52 cards
    function createDeck(length)
    {
        // add the first card to the deck
        var randRank = getRandomInt(2,14);
        var randSuit = getRandomInt(0,3);
        var newCard = new Card(randRank, randSuit);
        deck.push(newCard);

        // add all remaining cards to the deck
        while(deck.length < length)
        {
            // generate a new, random card
            randRank = getRandomInt(2,14);
            randSuit = getRandomInt(0,3);
            newCard = new Card(randRank, randSuit);

            // parse the deck for potential duplicates
            var duplicateFound = false;
            for(var i = 0; i < deck.length; i++)
            {
                if(deck[i].name == newCard.name)
                {
                    duplicateFound = true;
                } 
            }

            // if no duplicate found, add the card
            if(duplicateFound == false)
            {
                deck.push(newCard);
            }
        }
    }

    // create a hand with a specified length under 52 cards
    function createHand(length)
    {
        var newHand = new Array;

        // add the first card to the hand
        var randRank = getRandomInt(2,14);
        var randSuit = getRandomInt(0,3);
        var newCard = new Card(randRank, randSuit);
        newHand.push(newCard);

        // add all remaining cards to the hand
        while(newHand.length < length)
        {
            // generate a new, random card
            randRank = getRandomInt(2,14);
            randSuit = getRandomInt(0,3);
            newCard = new Card(randRank, randSuit);

            // parse the hand for potential duplicates
            var duplicateFound = false;
            for(var i = 0; i < newHand.length; i++)
            {
                if(newHand[i].name == newCard.name)
                {
                    duplicateFound = true;
                } 
            }

            // if no duplicate found, add the card
            if(duplicateFound == false)
            {
                newHand.push(newCard);
            }
        }

        return newHand;
    }

    function printHand(hand)
    {
        var printString = "";
        for(var i = 0; i < hand.length; i++)
        {
            printString += (hand[i].name + " / ");
        }
        // printString += "";
        return printString;
    }

    // return the passed hand's type ("straight", "two-pair", etc.) as a string (by default)
    function getHandType(hand)
    {
        if(isStraightFlush(hand))
        {
        	return("Straight-Flush");
        }
        else if(isFourOfKind(hand))
        {
        	return("Four-of-a-Kind");
        }
        else if(isFullHouse(hand))
        {
        	return("Full House");
        }
        else if(isFlush(hand))
        {
        	return("Flush");
        }
        else if(isStraight(hand))
        {
        	return("Straight");
        }
        else if(isThreeOfKind(hand))
        {
        	return("Three-of-a-Kind");
        }
        else if(isTwoPair(hand))
        {
        	return("Two-Pair");
        }
        else if(isPair(hand))
        {
        	return("Pair");
        }
        else
        {
        	return("High-Card");
        }
    }


    // return the passed hand's type ("straight", "two-pair", etc.) as a string or int
    function getHandType(hand, returnType)
    {
        if(returnType == 'string')
        {
            if(isStraightFlush(hand))
            {
                return("Straight-Flush");
            }
            else if(isFourOfKind(hand))
            {
                return("Four-of-a-Kind");
            }
            else if(isFullHouse(hand))
            {
                return("Full House");
            }
            else if(isFlush(hand))
            {
                return("Flush");
            }
            else if(isStraight(hand))
            {
                return("Straight");
            }
            else if(isThreeOfKind(hand))
            {
                return("Three-of-a-Kind");
            }
            else if(isTwoPair(hand))
            {
                return("Two-Pair");
            }
            else if(isPair(hand))
            {
                return("Pair");
            }
            else
            {
                return("High-Card");
            } 
        }
        else if(returnType == 'int')
        {
            if(isStraightFlush(hand))
            {
                return(0);
            }
            else if(isFourOfKind(hand))
            {
                return(1);
            }
            else if(isFullHouse(hand))
            {
                return(2);
            }
            else if(isFlush(hand))
            {
                return(3);
            }
            else if(isStraight(hand))
            {
                return(4);
            }
            else if(isThreeOfKind(hand))
            {
                return(5);
            }
            else if(isTwoPair(hand))
            {
                return(6);
            }
            else if(isPair(hand))
            {
                return(7);
            }
            else
            {
                return(8);
            }
        }
        
    }
    

    // return "0" if handOne is GREATER THAN handTwo, "1" if handTwo is greater, and "2" if they are equal
    function compareHands(handOne, handTwo)
    {
    	handOne = sortHandByRank(handOne);
    	handTwo = sortHandByRank(handTwo);


    	/////////////////////////////////
    	// IF STRAIGHT FLUSH(ES) PRESENT
    	/////////////////////////////////

        // if both hands are straight flushes
        if(isStraightFlush(handOne) && isStraightFlush(handTwo))
        {
        	// if handOne has a higher high-card, return "0"
            if(handOne[0].rank > handTwo[0].rank)
            {
            	return 0;
            }
            // if handTwo has a higher high-card, return "1"
            else if(handTwo[0].rank > handOne[0].rank)
            {
            	return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a straight flush and handTwo is NOT
        else if(isStraightFlush(handOne) && (isStraightFlush(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT straight flush and handTwo is
        else if((isStraightFlush(handOne) == false) && isStraightFlush(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF FOUR-OF-A-KIND(S) PRESENT
    	/////////////////////////////////

    	// if both hands are four-of-a-kinds
        if(isFourOfKind(handOne) && isFourOfKind(handTwo))
        {
        	// if handOne has a higher four-of-a-kind, return "0"
            if(handOne[1].rank > handTwo[1].rank)
            {
            	return 0;
            }
            // if handTwo has a higher four-of-a-kind, return "1"
            else if(handTwo[1].rank > handOne[1].rank)
            {
            	return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a four-of-a-kind and handTwo is NOT
        else if(isFourOfKind(handOne) && (isFourOfKind(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT four-of-a-kind and handTwo is
        else if((isFourOfKind(handOne) == false) && isFourOfKind(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF FULL HOUSE(ES) PRESENT
    	/////////////////////////////////

    	// if both hands are full-houses
        if(isFullHouse(handOne) && isFullHouse(handTwo))
        {
        	// if handOne has a higher full-houses, return "0"
            if(handOne[2].rank > handTwo[2].rank)
            {
            	return 0;
            }
            // if handTwo has a higher full-houses, return "1"
            else if(handTwo[2].rank > handOne[2].rank)
            {
            	return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a full-houses and handTwo is NOT
        else if(isFullHouse(handOne) && (isFullHouse(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT full-houses and handTwo is
        else if((isFullHouse(handOne) == false) && isFullHouse(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF FLUSH(ES) PRESENT
    	/////////////////////////////////

    	// if both hands are flushes
        if(isFlush(handOne) && isFlush(handTwo))
        {
        	// if handOne has a higher flush, return "0"
            if(handOne[0].rank > handTwo[0].rank)
            {
            	return 0;
            }
            // if handTwo has a higher flush, return "1"
            else if(handTwo[0].rank > handOne[0].rank)
            {
            	return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a flush and handTwo is NOT
        else if(isFlush(handOne) && (isFlush(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT a flush and handTwo is
        else if((isFlush(handOne) == false) && isFlush(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF STRAIGHT(S) PRESENT
    	/////////////////////////////////

    	// if both hands are straights
        if(isStraight(handOne) && isStraight(handTwo))
        {
        	// if handOne has a higher straight, return "0"
            if(handOne[0].rank > handTwo[0].rank)
            {
            	return 0;
            }
            // if handTwo has a higher straight, return "1"
            else if(handTwo[0].rank > handOne[0].rank)
            {
            	return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a straight and handTwo is NOT
        else if(isStraight(handOne) && (isStraight(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT a straight and handTwo is
        else if((isStraight(handOne) == false) && isStraight(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF THREE-OF-A-KIND(S) PRESENT
    	/////////////////////////////////

    	// if both hands are three-of-a-kinds
        if(isThreeOfKind(handOne) && isThreeOfKind(handTwo))
        {
        	// if handOne has a higher three-of-a-kind, return "0"
            if(handOne[2].rank > handTwo[2].rank)
            {
            	return 0;
            }
            // if handTwo has a higher three-of-a-kind, return "1"
            else if(handTwo[2].rank > handOne[2].rank)
            {
            	return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a three-of-a-kind and handTwo is NOT
        else if(isThreeOfKind(handOne) && (isThreeOfKind(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT three-of-a-kind and handTwo is
        else if((isThreeOfKind(handOne) == false) && isThreeOfKind(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF TWO-PAIR(S) PRESENT
    	/////////////////////////////////

    	// if both hands are two-pairs
        if(isTwoPair(handOne) && isTwoPair(handTwo))
        {
        	// store the rank of the highest pairs in each hand
        	var handOneHighPair = 0;
        	var handOneLowPair = 0;
        	var handTwoHighPair = 0;
        	var handTwoLowPair = 0;

        	// parse the first hand and look for the rank of the high pair
        	for(var i = 0; i < (handOne.length-1); i++)
        	{
        		// if a pair is found and the rank of that pair is higher than the current value of "handOneHighPair"...
        		if((handOne[i].rank == handOne[i+1].rank) && (handOne[i].rank > handOneHighPair))
        		{
                    // if a pair has been previously identified but is lower ranking than the current pair...
                    if(handOneHighPair != 0)
                    {
                        // move it's value to handOneLowPair
                        handOneLowPair = handOneHighPair;
                    }
        			// set handOneHighPair equal to the rank of the pair
        			handOneHighPair = handOne[i].rank;
        		}
                // if a pair is found and the rank of that pair is lower than the current value of "handOneHighPair"...
                else if((handOne[i].rank == handOne[i+1].rank) && (handOne[i].rank < handOneHighPair))
                {
                    // set handOneLowPair equal to the value of the current pair's rank
                    handOneLowPair = handOne[i].rank;
                }
        	}

        	// parse the second hand and look for the rank of the high pair
        	for(var i = 0; i < (handTwo.length-1); i++)
        	{
        		// if a pair is found and the rank of that pair is higher than the current value of "handTwoHighPair"...
        		if((handTwo[i].rank == handTwo[i+1].rank) && (handTwo[i].rank > handTwoHighPair))
        		{
                    // if a pair has been previously identified but is lower ranking than the current pair...
                    if(handTwoHighPair != 0)
                    {
                        // move it's value to handTwoLowPair
                        handTwoLowPair = handTwoHighPair;
                    }
        			// set handTwoHighPair equal to the rank of the pair
        			handTwoHighPair = handTwo[i].rank;
        		}
                // if a pair is found and the rank of that pair is lower than the current value of "handTwoHighPair"...
                else if((handTwo[i].rank == handTwo[i+1].rank) && (handTwo[i].rank < handOneHighPair))
                {
                    // set handTwoLowPair equal to the value of the current pair's rank
                    handTwoLowPair = handTwo[i].rank;
                }
        	}
            console.log("handOne High Pair: " + handOneHighPair);
            console.log("handOne Low Pair: " + handOneLowPair);
            console.log("handTwo High Pair: " + handTwoHighPair);
            console.log("handTwo Low Pair: " + handTwoLowPair);

        	// if handOne has a higher two-pair, return "0"
            if(handOneHighPair > handTwoHighPair)
            {
            	return 0;
            }
            // if handTwo has a higher two-pair, return "1"
            else if(handTwoHighPair > handOneHighPair)
            {
            	return 1;
            }
            // if hand handOne has a higher secondary pair, return "0"
            else if(handOneLowPair > handTwoLowPair)
            {
                return 0;
            }
            // if hand handTwo has a higher secondary pair, return "1"
            else if(handTwoLowPair > handOneLowPair)
            {
                return 1;
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a two-pair and handTwo is NOT
        else if(isTwoPair(handOne) && (isTwoPair(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT a two-pair and handTwo is
        else if((isTwoPair(handOne) == false) && isTwoPair(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF PAIR(S) PRESENT
    	/////////////////////////////////

    	// if both hands are pair
        if(isPair(handOne) && isPair(handTwo))
        {
        	// store the rank of the highest pairs in each hand
        	var handOneHighPair = 0;
        	var handTwoHighPair = 0;

        	// parse the first hand and look for the rank of the high pair
        	for(var i = 0; i < (handOne.length-1); i++)
        	{
        		// if a pair is found and the rank of that pair is higher than the current value of "handOneHighPair"...
        		if((handOne[i].rank == handOne[i+1].rank) && (handOne[i].rank > handOneHighPair))
        		{
        			// set handOneHighPair equal to the rank of the pair
        			handOneHighPair = handOne[i].rank;
        		}
        	}

        	// parse the second hand and look for the rank of the high pair
        	for(var i = 0; i < (handTwo.length-1); i++)
        	{
        		// if a pair is found and the rank of that pair is higher than the current value of "handTwoHighPair"...
        		if((handTwo[i].rank == handTwo[i+1].rank) && (handTwo[i].rank > handTwoHighPair))
        		{
        			// set handTwoHighPair equal to the rank of the pair
        			handTwoHighPair = handTwo[i].rank;
        		}
        	}

        	// if handOne has a higher two-pair, return "0"
            if(handOneHighPair > handTwoHighPair)
            {
            	return 0;
            }
            // if handTwo has a higher two-prait, return "1"
            else if(handTwoHighPair > handOneHighPair)
            {
            	return 1;
            }
            // if the hands have equal pairs, determine high card winner
            else if(handOneHighPair == handTwoHighPair)
            {
            	// parse the hands and compare each successive card until a winner is found
            	for(var i = 0; i < handOne.length; i++)
            	{
            		if((handOne[i].rank != handOneHighPair) && (handOne[i].rank > handTwo[i].rank))
            		{
            			return 0;
            		}
            		else if((handOne[i].rank != handOneHighPair) && (handTwo[i].rank > handOne[i].rank))
            		{
            			return 1;
            		}
            	}  
            }
            else
            {
            	return 2;
            }
        }
        // if handOne is a pair and handTwo is NOT
        else if(isPair(handOne) && (isPair(handTwo) == false))
        {
            // handOne wins
            return 0;
        }
        // if handOne is NOT a pair and handTwo is
        else if((isPair(handOne) == false) && isPair(handTwo))
        {
            // handTwo wins
            return 1;
        }

        /////////////////////////////////
    	// IF HIGH CARD(S) PRESENT
    	/////////////////////////////////

    	// parse hand one
    	for(var i = 0; i < handOne.length; i++)
    	{
    		// if handOne's card at position "i" is higher than handTwo's...
    		if(handOne[i].rank > handTwo[i].rank)
    		{
    			// handOne is higher
    			return 0;
    		}
    		// if handTwo's card at position "i" is higher than handOne's...
    		else if(handTwo[i].rank > handOne[i].rank)
			{
    			// handTwo is higher
    			return 1;
    		}
    	}











        return false;
    }

    function identifyBestHand(hand)
    {
    	// if the hand passed is not of valid length, return false and print an error message to the console
    	if(hand.length < 5)
    	{
    		console.log("identifyBestHand() Error: Length of hand passed is less than 5");
    		return false;
    	}

    	// hold the best five-card hand that can be constructed from the given hand
    	var bestHand;

    	// hold an array containing all straights that can be constructed from the given hand
    	var potentialStraights = identifyAllStraights(hand);

    	// hold a straight-flush if one is identified below
 		var potentialStraightFlush;

 		// hold the highest ranking straight if one is identified below (default to false)
 		var potentialHighStraight = false;

 		// hold the highest ranking four-of-a-kind if one can be identified
 		var potentialFourOfKind = identifyFourOfKind(hand);

 		// hold the highest ranking three-of-a-kind if one can be identified  (may also hold a full house, must be verified below)
 		var potentialThreeOfKind = identifyThreeOfKind(hand);

 		// hold the highest ranking flush if one can be identified
 		var potentialFlush = identifyFlush(hand);

 		// hold the highest ranking two-pair if one can be identified
 		var potentialTwoPair = identifyTwoPair(hand);

 		// hold the highest ranking pair if one can be identified
 		var potentialPair = identifyPair(hand);

 		// hold the highest ranking high-card hand if one can be identified
 		var potentialHighCard = identifyHighCard(hand);

    	// if the number of potential straights is non-zero
    	if(potentialStraights != false)
    	{
    		// parse all possible straights and identify the highest, if any, straight flush
    		potentialStraightFlush = identifyStraightFlush(potentialStraights);
    		// if a straight-flush is found, set bestHand equal to it and return it as the best possible hand
    		if(potentialStraightFlush != false)
    		{
    			bestHand = potentialStraightFlush;
    			return bestHand;
    		}
    		// if no straight-flush is found, find the highest ranking straight and set potentialHighStraight equal to it
    		else
    		{
    			potentialHighStraight = identifyHighestStraight(potentialStraights);
    		}
    	}

    	////////////////////////////
    	// IF NO STRAIGHTS ARE FOUND
    	////////////////////////////

    	// if a four-of-a-kind was identified above, return it as the best possible hand
    	if(potentialFourOfKind != false)
    	{
    		bestHand = potentialFourOfKind;
    		return bestHand;
    	}

    	// if a full-house was identified above, return it as the best possible hand
    	if((potentialThreeOfKind != false) && (isFullHouse(potentialThreeOfKind) == true))
    	{
    		bestHand = potentialThreeOfKind;
    		return bestHand;
    	}

    	// if a flush was identified above, return it as the best possible hand
    	if(potentialFlush != false)
    	{
    		bestHand = potentialFlush;
    		return bestHand;
    	}

    	// if a straight was identified above, return it as the best possible hand
    	if(potentialHighStraight != false)
    	{
    		bestHand = potentialHighStraight;
    		return bestHand;
    	}

    	// if a three-of-a-kind was identified above, return it as the best possible hand
    	if(potentialThreeOfKind != false)
    	{
    		bestHand = potentialThreeOfKind;
    		return bestHand;
    	}

    	// if a two-pair was identified above, return it as the best possible hand
    	if(potentialTwoPair != false)
    	{
    		bestHand = potentialTwoPair;
    		return bestHand;
    	}

    	// if a two-pair was identified above, return it as the best possible hand
    	if(potentialPair != false)
    	{
    		bestHand = potentialPair;
    		return bestHand;
    	}

    	// if a two-pair was identified above, return it as the best possible hand
    	if(potentialHighCard != false)
    	{
    		bestHand = potentialHighCard;
    		return bestHand;
    	}

    	console.log("identifyBestHand() Error: Reached end of function without identifying a best hand")
    	return false;
    }

    // determine if a hand is a valid straight
    function isStraight(hand)
    {
        // if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isStraightFlush() Error: Length of hand passed does not equal 5");
            return false;
        }

        // sort the hand by rank so that it can be parsed
        var sortedHand = sortHandByRank(hand);

        // count each instance of a successful "chain"
        var validCount = 0;
        // parse the hand and count the number of valid links in the straight chain
        for(var i = 0; i < 4; i++)
        {
            if(sortedHand[i].rank == (sortedHand[i+1].rank+1))
            {   
                validCount++;
            }
        }

        // if there are four valid links in the chain, there is a straight
        if(validCount == 4)
        {
            return true;
        }
        // if there is a gap in the chain, there is not a straight
        else
        {
            return false;
        }
    }

    // determine if a hand is a valid flush
    function isFlush(hand)
    {
        // if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isFlush() Error: Length of hand passed does not equal 5");
            return false;
        }

        // store the suit of the first card in the hand for comparison
        var flushSuit = hand[0].suit;
        // parse the hand and compare each card's suit against the suit of the first card
        for(var i = 0; i < 5; i++)
        {
            // if any card does not match suit, return false
            if(hand[i].suit != flushSuit)
            {
                return false;
            }
        }

        // if no card was found not to match suit, then they form a flush
        return true;
    }

    // determine if a hand is a valid straight-flush
    function isStraightFlush(hand)
    {
        // if the hand is both a straight and a flush, it is a straight-flush
        if(isStraight(hand) && isFlush(hand))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // determine if a hand is a valid four-of-a-kind
    function isFourOfKind(hand)
    {
        // if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isFourOfKind() Error: Length of hand passed does not equal 5");
            return false;
        }

        // for each card in the hand, check for the existence of three other cards of like rank
        for(var i = 0; i < 5; i++)
        {
            // hold the number of matches identified
            var count = 0;

            // hold the rank of the current card being evaluated
            var currentRank = hand[i].rank;

            // compare each card in the hand against the current card
            for(var j = 0; j < 5; j++)
            {
                // if cards match rank, increment count
                if(hand[j].rank == currentRank)
                {
                    count++;
                }
            }

            // if four matches are identified, the four-of-a-kind is valid
            if(count == 4)
            {
                return true;
            }
        }

        // if insufficient matches are identified, no four-of-a-kind exists
        return false;
    }

    // determine if a hand is a valid three-of-a-kind
    function isThreeOfKind(hand)
    {
        // if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isThreeOfKind() Error: Length of hand passed does not equal 5");
            return false;
        }

        // holds the rank of the three-of-a-kind (if one is succesfully identified)
        var firstRank;

        // holds whether a three-of-a-kind was correctly identified
        var threeOfKindFound = false;

        // for each card in the hand, check for the existence of two other cards of like rank
        for(var i = 0; i < 5; i++)
        {
            // hold the number of matches identified
            var count = 0;

            // hold the rank of the current card being evaluated
            var currentRank = hand[i].rank;

            // compare each card in the hand against the current card
            for(var j = 0; j < 5; j++)
            {
                // if cards match rank, increment count
                if(hand[j].rank == currentRank)
                {
                    count++;
                }
            }

            // if three matches are identified, the three-of-a-kind is valid
            if(count == 3)
            {
                // set the firstRank to the currentRank, assignign it the rank of the three-of-a-kind
                firstRank = currentRank;
                threeOfKindFound = true;
            }
        }

        // if no three-of-kind is found, return false
        if(threeOfKindFound == false)
        {
            return false;
        }

        // store the rank of the next card found in the hand that is NOT part of the three-of-a-kind
        var secondRank = false;

        // parse the hand and compare the ranks of the non-three-of-a-kind cards
        for(var i = 0; i < 5; i++)
        {
            // if the current card is not part of the three-of-the-kind and the "secondRank" has not yet been identified...
            if((hand[i].rank != firstRank) && (secondRank == false))
            {
                // set secondRank equal to the card's rank
                secondRank = hand[i].rank;
            }
            // if the current card is not part of the three-of-a-kind and the "secondRank" HAS been identified
            else if((hand[i].rank != firstRank) && (secondRank != false))
            {
                // if the two cards not part of the three-of-a-kind match rank, it is a full house, not a three-of-a-kind
                if(hand[i].rank == secondRank)
                {
                    return false;
                }
                // if the two cards do not match, it is a three of a kind
                else
                {
                    return true;
                }
            }
        }

        // if this is ever arrived at, something went horribly wrong
        console.log("isThreeOfKind() Error: Reached end of function with no result");
        return false;
    }


    function isTwoPair(hand)
    {
    	// if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isTwoPair() Error: Length of hand passed does not equal 5");
            return false;
        }

        var matchesIdentified = 0;

        // holds hand sorted by rank
        var sortedHand = sortHandByRank(hand);

        for(var i = 0; i < sortedHand.length; i++)
        {
        	var currentCard = sortedHand[i];
        	for(var j = 0; j < sortedHand.length; j++)
        	{
        		// if two cards are found to match and they are not the same card...
        		if((currentCard.rank == sortedHand[j].rank) && (currentCard.name != sortedHand[j].name))
        		{
        			matchesIdentified++;
        		}
        	}
        }

        if(matchesIdentified == 4)
        {
        	return true;
        }
        else
        {
        	return false;
        }

    }

    function isPair(hand)
    {
    	// if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isPair() Error: Length of hand passed does not equal 5");
            return false;
        }

        var matchesIdentified = 0;

        // holds hand sorted by rank
        var sortedHand = sortHandByRank(hand);

        for(var i = 0; i < sortedHand.length; i++)
        {
        	var currentCard = sortedHand[i];
        	for(var j = 0; j < sortedHand.length; j++)
        	{
        		// if two cards are found to match and they are not the same card...
        		if((currentCard.rank == sortedHand[j].rank) && (currentCard.name != sortedHand[j].name))
        		{
        			matchesIdentified++;
        		}
        	}
        }

        if(matchesIdentified == 2)
        {
        	return true;
        }
        else
        {
        	return false;
        }
    }

    // determine if a hand is a valid full house
    function isFullHouse(hand)
    {
        // if the hand is not of valid length, return false and print an error message to the console
        if(hand.length != 5)
        {
            console.log("isFullHouse() Error: Length of hand passed does not equal 5");
            return false;
        }

        // holds the rank of the three-of-a-kind (if one is succesfully identified)
        var firstRank;

        // holds whether a three-of-a-kind was correctly identified
        var threeOfKindFound = false;

        // for each card in the hand, check for the existence of two other cards of like rank
        for(var i = 0; i < 5; i++)
        {
            // hold the number of matches identified
            var count = 0;

            // hold the rank of the current card being evaluated
            var currentRank = hand[i].rank;

            // compare each card in the hand against the current card
            for(var j = 0; j < 5; j++)
            {
                // if cards match rank, increment count
                if(hand[j].rank == currentRank)
                {
                    count++;
                }
            }

            // if three matches are identified, the three-of-a-kind is valid
            if(count == 3)
            {
                // set the firstRank to the currentRank, assignign it the rank of the three-of-a-kind
                firstRank = currentRank;
                threeOfKindFound = true;
            }
        }

        // if no three-of-kind is found, return false
        if(threeOfKindFound == false)
        {
            return false;
        }

        // store the rank of the next card found in the hand that is NOT part of the three-of-a-kind
        var secondRank = false;

        // parse the hand and compare the ranks of the non-three-of-a-kind cards
        for(var i = 0; i < 5; i++)
        {
            // if the current card is not part of the three-of-the-kind and the "secondRank" has not yet been identified...
            if((hand[i].rank != firstRank) && (secondRank == false))
            {
                // set secondRank equal to the card's rank
                secondRank = hand[i].rank;
            }
            // if the current card is not part of the three-of-a-kind and the "secondRank" HAS been identified
            else if((hand[i].rank != firstRank) && (secondRank != false))
            {
                // if the two cards not part of the three-of-a-kind match rank, it is a full house
                if(hand[i].rank == secondRank)
                {
                    return true;
                }
                // if the two cards do not match, it is a three of a kind, not a full house
                else
                {
                    return false;
                }
            }
        }

        // if this is ever arrived at, something went horribly wrong
        console.log("isFullHouse() Error: Reached end of function with no result");
        return false;
    }

    // return an array with all valid straights that may be formed from a given hand
    function identifyAllStraights(hand)
    {
        // holds possible straights
        var straightsArray = new Array;

        // holds hand sorted by rank
        var sortedHand = sortHandByRank(hand);

        // for each card in the hand, attempt to build a straight with the selected card as the highest member
        for(var i = 0; i < sortedHand.length; i++)
        {
            // create an array to hold the potential straight
            var potentialStraight = new Array;

            // add the card as the first member of a potential straight
            potentialStraight.push(sortedHand[i]);

            // for each card in the deck, check if it has a place in a potential straight with the selected card
            for(var j = 0; j < sortedHand.length; j++)
            {
                // if the rank of the current card is less than the selected card and greater than 5 below it, it may have a place in the straight
                if((sortedHand[j].rank < sortedHand[i].rank) && (sortedHand[j].rank > (sortedHand[i].rank-5)))
                {
                    // add the card to a potential straight
                    potentialStraight.push(sortedHand[j]);
                }    
            }
            // push the potential straight to the straights array, at this point may contain duplicate ranks or incomplete straights
            straightsArray.push(potentialStraight);
        }

        // for each potential straight in the straights array, eliminate duplicates and prioritize matching suits
        for(var k = 0; k < straightsArray.length; k++)
        {
            // holds the suit to be prioritized when eliminating duplicates
            var prioritySuit = straightsArray[k][0].suit;

            // holds a list of all the ranks currently duplicated in the potential straight
            var duplicateRanks = new Array;

            // for every card in the current potential straight array being operated on...
            for(var l = 0; l < straightsArray[k].length-1; l++)
            {
                // if the rank of the current card matches the rank of the next card, note that rank in the duplicateRanks array
                if(straightsArray[k][l].rank == straightsArray[k][l+1].rank)
                {
                    duplicateRanks.push(straightsArray[k][l].rank);
                }
            }

            // create a new array which will replace the old potential straight with duplicates eliminated
            var updatedArray = new Array;
            // keep track of the ranks which are added to the new array
            var addedRanks = new Array;
            for(var m = 0; m < straightsArray[k].length; m++)
            {
                // if the current card does not have a duplicate, push it to the updated array
                if(duplicateRanks.indexOf(straightsArray[k][m].rank) == (-1))
                {
                    updatedArray.push(straightsArray[k][m]);
                    addedRanks.push(straightsArray[k][m].rank);
                }
                // if the card has a duplicate, but is of priority suit, add it
                else if(straightsArray[k][m].suit == prioritySuit)
                {
                    updatedArray.push(straightsArray[k][m]);
                    addedRanks.push(straightsArray[k][m].rank);
                }
            }
            // pick remaining ranks needed to form the straight at random
            for(var n = 0; n < straightsArray[k].length; n++)
            {
                if((addedRanks.indexOf(straightsArray[k][n].rank) == (-1)))
                {
                    updatedArray.push(straightsArray[k][n]);
                    addedRanks.push(straightsArray[k][n].rank);
                }
            }
      
            // update the potential straight array with duplicates eliminated
            straightsArray[k] = updatedArray;
        }

        // update the straights array to contain only complete straights
        var newStraightsArray = new Array;
        for(var o = 0; o < straightsArray.length; o++)
            {
                // if the length is less than 5, the straight is incomplete- don't add it
                if(straightsArray[o].length == 5)
                {
                    newStraightsArray.push(straightsArray[o]);
                }
            }
        // update straights array to reflect changes
        straightsArray = newStraightsArray;

        for(var i = 0; i < straightsArray.length; i++)
        {
            straightsArray[i] = sortHandByRank(straightsArray[i]);
        }

        // if no straights could be assembled, return false
        if(straightsArray.length == 0)
        {
            return false;
        }

        return straightsArray;
    }

    // returns an array containing all possible flushes formable with a given hand
    function identifyFlush(hand)
    {
        // holds possible straights
        var flushesArray = new Array;

        // holds hand sorted by rank
        var sortedHand = sortHandByRank(hand);

        // for each card in the hand, attempt to build a flush with the selected card as the highest member
        for(var i = 0; i < sortedHand.length; i++)
        {
            // create an array to hold the potential flush
            var potentialFlush = new Array;

            // add the card as the first member of a potential flush
            potentialFlush.push(sortedHand[i]);

            // for each card in the deck, check if it has a place in a potential flush with the selected card
            for(var j = 0; j < sortedHand.length; j++)
            {
                // if the rank of the current card matches suit and isn't the same card...
                if((sortedHand[j].suit == sortedHand[i].suit) && (sortedHand[j].name != sortedHand[i].name))
                {
                    // add the card to a potential flush
                    potentialFlush.push(sortedHand[j]);
                }
            }
            // push the potential flush to the straights array, at this point may contain incomplete flushes
            flushesArray.push(potentialFlush);
        }

        // holds new array with incomplete flushes eliminated
        var newFlushesArray = new Array;
        // parse flushesArray and move only complete flushes to the new Array
        for(var i = 0; i < flushesArray.length; i++)
        {
            // if the flush is already of length 5...
            if(flushesArray[i].length == 5)
            {
                // push it to the new array
                newFlushesArray.push(flushesArray[i]);
            }
            // if the flush needs to be trimmed
            else if(flushesArray[i].length > 5)
            {
                // create a new array containing the flush
                var newFlush = new Array;
                // move the first five cards of the flush into the new array
                for(var j = 0; j < 5; j++)
                {
                    newFlush.push(flushesArray[i][j]);
                }
                // replace the old flush with the new array
                flushesArray[i] = newFlush;
                // add the trimmed flush to the new flushes array
                newFlushesArray.push(flushesArray[i]);
            }
        }
        // replace the old flushesArray with the new array
        flushesArray = newFlushesArray;

        // sort all flushes in the flushesArray by rank
        for(var i = 0; i < flushesArray.length; i++)
        {
            flushesArray[i] = sortHandByRank(flushesArray[i]);
        }

        // store the highest ranking flush, default to first flush
        var bestFlush = false;

        // if at least one flush has been identified, set bestFlush to the first flush
        if(flushesArray.length > 0)
        {
            bestFlush = flushesArray[0];
        }
        // if no flushes found, return false
        else
        {
            return false;
        }
        
        // parse every flush in flushesArray
        for(var i = 0; i < flushesArray.length; i++)
        {
            // compare each card (in rank-sorted order), left-to-right 
            for(var j = 0; j < 5; j++)
            {
                // if a flush is found to have a higher ranking card, swap it in as the new bestFlush
                if(flushesArray[i][j].rank > bestFlush[j].rank)
                {
                    bestFlush = flushesArray[i];
                    break;
                }
            }
        }

        return bestFlush;
    }

    // take a straightArray from identifyAllStraights() and return the highest possible straight-flush
    function identifyStraightFlush(straightsArray)
    {
        // if straightsArray is false, return false
        if(straightsArray == false)
        {
            return false;
        }

        // if the straights array is empty, return false and print an error to the console
        if(straightsArray.length < 1)
        {
            console.log("Invalid input");
            return false;
        }

        var straightFlushes = new Array();
        for(var i = 0; i < straightsArray.length; i++)
        {
            var targetSuit = straightsArray[i][0].suit;
            var suitCount = 0;
            for(var j = 0; j < straightsArray[i].length; j++)
            {
                if(straightsArray[i][j].suit == targetSuit)
                {
                    suitCount++;
                }
            }
            if(suitCount == 5)
            {
                straightFlushes.push(straightsArray[i]);
            }
        }

        // if no straight flushes are identified, return false
        if(straightFlushes.length == 0)
        {
        	return false;
        }

        // use identifyHighestStraight() to identify the highest possible straight-flush
        var bestStraightFlush = identifyHighestStraight(straightFlushes);

        return bestStraightFlush;
    }

    // take a straightArray from identifyAllStraights() and return the highest possible straight
    function identifyHighestStraight(straightsArray)
    {
        // if straightsArray is false, return false
        if(straightsArray == false)
        {
            return false;
        }

        // if the straights array is empty, return false and print an error to the console
        if(straightsArray.length < 1)
        {
            console.log("Invalid input");
            return false;
        }

        // sort all straights from highest to lowest
        for(var i = 0; i < straightsArray.length; i++)
        {
            straightsArray[i] = sortHandByRank(straightsArray[i]);
        }

        // hold the best possible straight, default to first straight in straightsArray
        var bestStraight = straightsArray[0];

        // parse straights array and compare the first cards of each straight against bestStraight
        for(var i = 0; i < straightsArray.length; i++)
        {
            // if an array is found to have a higher first card, set it as the new bestStraight
            if(straightsArray[i][0].rank > bestStraight[0].rank)
            {
                bestStraight = straightsArray[i];
            }
        }

        // console.log("bestStraight: " + printHand(bestStraight));

        return bestStraight;
    }

    // return the best possible four-of-a-kind that may be formed from a given hand
    function identifyFourOfKind(hand)
    {
        // create an array to hold all possible four-of-a-kinds
        var foursOfKind = new Array;

        // sort the hand for convenience
        var sortedHand = sortHandByRank(hand);

        // attempt to build a four-of-a-kind using each card in the given hand
        for(var i = 0; i < sortedHand.length; i++)
        {
            // hold a potential four-of-a-kind
            var potentialFourOfKind = new Array;

            // select a card to attempt to form a four-of-a-kind with
            potentialFourOfKind.push(sortedHand[i]);

            // parse the hand and compare cards against the selected card
            for(var j = 0; j < sortedHand.length; j++)
            {
                // if the ranks are the same (but names are not, to prevent duplication)...
                if((sortedHand[i].rank == sortedHand[j].rank) && (sortedHand[i].name != sortedHand[j].name))
                {
                    // push the card to the potential four-of-a-kind array
                    potentialFourOfKind.push(sortedHand[j]);
                }
            }

            // push the potential four-of-a-kind to the foursOfKind array
            foursOfKind.push(potentialFourOfKind);
        }

        // create array to hold only valid four-of-a-kinds
        var newFoursOfKind = new Array;

        // parse of foursOfKind array and eliminate incomplete four-of-a-kinds
        for(var j = 0; j < foursOfKind.length; j++)
        {
            // if a four-of-a-kind is of valid length, add it to the new array
            if(foursOfKind[j].length == 4)
            {
                newFoursOfKind.push(foursOfKind[j]);
            }
        }

        // set foursOfKind equal to the new array, with incomplete fours-of-a-kinds removed
        foursOfKind = newFoursOfKind;

        // if no four-of-a-kinds could be constructed, return false
        if(foursOfKind.length == 0)
        {
            return false;
        }

        // hold the best possible four-of-a-kind, default to first in foursOfKind array
        var bestFourOfKind = foursOfKind[0];

        // parse all four-of-a-kinds in the array and identify the highest one
        for(var i = 0; i < foursOfKind.length; i++)
        {
            if(foursOfKind[i][0].rank > bestFourOfKind[0].rank)
            {
                bestFourOfKind = foursOfKind[i];
            }
        }

        // do not append a card of the same rank as the four-of-a-kind
        var prohibitedRank = bestFourOfKind.rank;

        // hold the remaining highest ranking card in the hand to append to the end of the four-of-a-kind
        var lastCard = sortedHand[0];

        // parse the hand looking for the highest ranking card
        for(var j = 0; j < sortedHand[i]; j++)
        {
            if((sortedHand[j].rank > lastCard.rank) && (sortedHand[j].rank != prohibitedRank))
            {
                lastCard = sortedHand[j];
            }
        }

        // push the last card to the four-of-a-kind
        bestFourOfKind.push(lastCard)

        // return the best possible four-of-a-kind
        return bestFourOfKind;
    }

    // return an array containg the best possible three-of-a-kind or full house (use isFullHouse() to determine quality of hand)
    function identifyThreeOfKind(hand)
    {
        // create an array to hold all possible threes of a kind
        var threesOfKind = new Array;

        // sort the hand for convenience
        var sortedHand = sortHandByRank(hand);

        // attempt to build a three-of-a-kind using each card in the given hand
        for(var i = 0; i < sortedHand.length; i++)
        {
            // hold a potential three-of-a-kind
            var potentialThreeOfKind = new Array;

            // select a card to attempt to form a three-of-a-kind with
            potentialThreeOfKind.push(sortedHand[i]);

            // parse the hand and compare cards against the selected card
            for(var j = 0; j < sortedHand.length; j++)
            {
                // if the ranks are the same (but names are not, to prevent duplication)...
                if((sortedHand[i].rank == sortedHand[j].rank) && (sortedHand[i].name != sortedHand[j].name))
                {
                    // push the card to the potential three-of-a-kind array
                    potentialThreeOfKind.push(sortedHand[j]);
                }
            }

            // push the potential three-of-a-kind to the threesOfKind array
            threesOfKind.push(potentialThreeOfKind);
        }

        // create array to hold only valid three-of-a-kinds
        var newThreesOfKind = new Array;

        // parse of foursOfKind array and eliminate incomplete three-of-a-kinds
        for(var j = 0; j < threesOfKind.length; j++)
        {
            // if a three-of-a-kind is of valid length, add it to the new array
            if(threesOfKind[j].length == 3)
            {
                newThreesOfKind.push(threesOfKind[j]);
            }
        }

        // set threesOfKind equal to the new array, with incomplete three-of-a-kinds removed
        threesOfKind = newThreesOfKind;

        if(threesOfKind.length == 0)
        {
            return false;
        }

        // create a variable to hold the best possible three-of-a-kind
        var bestHand;

        // if at least one three-of-a-kind has been identified
        if(threesOfKind.length > 0)
        {   
            // set bestHand equal to the first valid three-of-a-kind
            bestHand = threesOfKind[0];
        }

        // check every possible three-a-kind and...
        for(var i = 0; i < threesOfKind.length; i++)
        {
            // if a three-of-a-kind of higher rank is found, set it as the new bestHand
            if(threesOfKind[i][0].rank > bestHand[0].rank)
            {
                bestHand = threesOfKind[i];
            }
        }

        ////////////////////////////////////////////////////////////////////
        // SEARCH FOR A POSSIBLE FULL HOUSE
        ////////////////////////////////////////////////////////////////////

        // create an array to hold all possible pairs
        var pairsArray = new Array;

        // attempt to build a pair using each card in the given hand
        for(var i = 0; i < sortedHand.length; i++)
        {
            // hold a potential pair
            var potentialPair = new Array;

            // select a card to attempt to form a three-of-a-kind with
            potentialPair.push(sortedHand[i]);

            // parse the hand and compare cards against the selected card
            for(var j = 0; j < sortedHand.length; j++)
            {
                // if the ranks are the same (but names are not, to prevent duplication)...
                if((sortedHand[i].rank == sortedHand[j].rank) && (sortedHand[i].name != sortedHand[j].name))
                {
                    // push the card to the potential three-of-a-kind array
                    potentialPair.push(sortedHand[j]);
                }
            }

            // push the potential three-of-a-kind to the threesOfKind array
            pairsArray.push(potentialPair);
        }

        // create array to hold only complete pairs
        var newPairsArray = new Array;

        // parse all possible pairs and...
        for(var i = 0; i < pairsArray.length; i++)
        {
            // add those that are complete to the new array
            if(pairsArray[i].length >= 2)
            {
                newPairsArray.push(pairsArray[i]);
            }
        }

        // replaces the old pairs array with the new pairs array
        pairsArray = newPairsArray;

        // hold rank which may not be present in the pair of the full house
        var prohibitedRank = bestHand[0].rank;

        // create a variable to hold the best possible pair
        var bestPair = false;

        // if at least one pair has been identified
        if((pairsArray.length > 0))
        {   
            // set bestHand equal to the last valid pair
            bestPair = pairsArray[pairsArray.length-1];
        }

        // parse all possible pairs and...
        for(var i = 0; i < pairsArray.length; i++)
        {
            // if a pair of higher rank than the current bestPair is found, set it as the new bestPair
            if((pairsArray[i][0].rank > bestPair[0].rank) && (pairsArray[i][0].rank != prohibitedRank))
            {
                bestPair = pairsArray[i];
            }
        }

        // if there are no possible full houses, set bestPair back equal to false
        if(bestPair[0].rank == prohibitedRank)
        {
            bestPair = false;
        }

        // if a compatible pair has been identified
        if(bestPair != false)
        {
            // push the first two cards of the pair to the best hand to form a full house
            for(var i = 0; i < 2; i++)
            {
                bestHand.push(bestPair[i]);
            }
        }
        // if no compatible pair can be found, add the highest ranking remaining cards
        else
        {
            for(var j = 0; j < 2; j++)
            {
                // set the highest card by default to the last card in the hand
                var highestCard = sortedHand[sortedHand.length-1];

                // parse the hand to find higher ranking cards
                for(var i = 0; i < sortedHand.length; i++)
                {
                    // if the current card is of higher rank the the present highest card && does not already exist in bestHand...
                    if((sortedHand[i].rank > highestCard.rank) && (bestHand.indexOf(sortedHand[i]) == (-1)))
                    {
                        // set the old highest card to the newly identified higher card
                        highestCard = sortedHand[i];
                    }
                }

                // push the highest card to bestHand
                bestHand.push(highestCard);
            }       
        }

        return bestHand;
    }

    // return an array containg the best possible two-pair that can be constructed from a given hand
    function identifyTwoPair(hand)
    {
    	// hold the ranks of the two pairs added
        var pairOneRank = 0;
        var pairTwoRank = 0;

        // hold the hand passed in sorted by rank
        var sortedHand = sortHandByRank(hand);

        // hold the best two pair that can be constructed
        var bestHand = new Array;

        // counts the number of pairs that have been added to bestHand
        var pairCount = 0;

        // parse the hand, search for each pair, and add them to the bestHand
        for(var i = 0; i < (sortedHand.length-1); i++)
        {
        	// if both pairs have been added, break the loop
        	if((pairOneRank != 0) && (pairTwoRank != 0))
        	{
        		break;
        	}
            // if the current card and next card match rank and the first pair has not yet been added...
            else if((sortedHand[i].rank == sortedHand[i+1].rank) && (pairOneRank == 0))
            {
                // document the rank of the first pair added in pairOneRank
                pairOneRank = sortedHand[i].rank;

                // push the pair to bestHand
                bestHand.push(sortedHand[i]);
                bestHand.push(sortedHand[i+1]);
            }

            // if the current card and next card match rank and the the current card does not does not match the first pair's rank...
            else if((sortedHand[i].rank == sortedHand[i+1].rank) && (sortedHand[i].rank != pairOneRank))
            {
                // document the rank of the first pair added in pairTwoRank
                pairTwoRank = sortedHand[i].rank;

                // push the pair to bestHand
                bestHand.push(sortedHand[i]);
                bestHand.push(sortedHand[i+1]);
            }
        }

        // Find the highest card that does not match rank with either pair and add it to bestHand
    	for(var i = 0; i < sortedHand.length; i++)
    	{
    		if((sortedHand[i].rank != pairOneRank) && (sortedHand[i].rank != pairTwoRank))
    		{
    			bestHand.push(sortedHand[i]);
    			break;
    		}
    	}

    	// return false if a two-pair could not be constructed
    	if(bestHand.length < 5)
    	{
    		return false;
    	}


        // return the hand with two pairs and the highest remaining card
        return bestHand;
    }

    // return an array containg the best possible pair that can be constructed from a given hand
    // NOTE: This function does not exclude two-pairs or threes/fours-of-a-kind, the functions
    // identifyTwoPair(), etc. must be run prior to this one in order to filter out potential
    // non-pair results
    function identifyPair(hand)
    {
    	// if the hand passed in has fewer than 5 cards, return false and print and error message to the console
    	if(hand.length < 5)
    	{
    		console.log("identifyPair() ERROR: Hand passed in has length less than 5");
    		return false;
    	}
    	// hold the hand passed in sorted by rank
        var sortedHand = sortHandByRank(hand);

        // hold the best pair that can be constructed
        var bestHand = new Array;

        // hold whether the pair has been identified and added to bestHand
        var pairRank = 0;

        // parse the sorted hand and search for the pair and add it to best hand
        for(var i = 0; i < (sortedHand.length-1); i++)
        {
        	// if the pair has already been identified and added, break the loop
        	if(pairRank != 0)
        	{
        		break;
        	}

        	// if a pair has been found...
        	else if(sortedHand[i].rank == sortedHand[i+1].rank)
        	{
        		// add both cards to best hand
        		bestHand.push(sortedHand[i]);
        		bestHand.push(sortedHand[i+1]);

        		// record the addition of the pair
        		pairRank = sortedHand[i].rank;
        	}
        }

        // if no pair was identified, return false
        if(bestHand.length == 0)
        {
        	return false;
        }

        // count the number of additional cards add to the pair
        var count = 0;
        // parse sortedHand and add the highest cards not in the pair to the hand
        for(var i = 0; i < sortedHand.length; i++)
        {
        	// if three cards have already been added, break the loop
        	if(count == 3)
        	{
        		break;
        	}
        	// add the first (highest) cards encountered that are not in the pair to bestHand
        	else if(sortedHand[i].rank != pairRank)
        	{
       			// add the non-pair high card to bestHand
        		bestHand.push(sortedHand[i]);
        		// increment count
        		count++;
        	}
        }

        // return the best pair that could be constructed
        return bestHand;
    }

	// return an array containg the best possible high-card hand that can be constructed from a given hand
    // NOTE: This function does not exclude higher ranking hands (straight, etc.), other identify functions
    // must be run prior to this one in order to exclude those hands
    function identifyHighCard(hand)
    {
    	// if the hand passed in has fewer than 5 cards, return false and print and error message to the console 
    	if(hand.length < 5)
    	{
    		console.log("identifyHighCard() ERROR: Hand passed in has length less than 5");
    		return false;
    	}
    	// hold the hand passed in sorted by rank
        var sortedHand = sortHandByRank(hand);

        // hold the best high-card hand that can be constructed
        var bestHand = new Array;

        // push the five highest cards in sortedHand to bestHand
        for(var i = 0; i < 5; i++)
        {
        	bestHand.push(sortedHand[i]);
        }

        // return the best high-card hand
        return bestHand;
    }

    // print every item in the deck
    function printDeck()
    {
        for(var i = 0; i < deck.length; i++)
        {
            console.log("Card #" + (i+1) + ": " + deck[i].name);
        }
    }

    // get a printable, human comprehensible name for a card
    function getCardName(card)
    {
        var returnString = "";

        // if not a face card, just use the number
        if(card.rank <= 10)
        {
            returnString += card.rank.toString();
        }
        // if a face card, identify it's name
        else if(card.rank == 11)
        {
            returnString += "Jack";
        }
        else if(card.rank == 12)
        {
            returnString += "Queen";
        }
        else if(card.rank == 13)
        {
            returnString += "King";
        }
        else if(card.rank == 14)
        {
            returnString += "Ace";
        }

        // append "of" to returnString
        returnString += " of ";

        // identify the name of the suit
        if(card.suit == 0)
        {
            returnString += "Diamonds";
        }
        else if(card.suit == 1)
        {
            returnString += "Hearts";
        }
        else if(card.suit == 2)
        {
            returnString += "Spades";
        }
        else if(card.suit == 3)
        {
            returnString += "Clubs";
        }

        return returnString;

    }

    // takes an array of cards and returns the array sorted by rank
    function sortHandByRank(hand)
    {
        // array to be returned
        var sortedArray = new Array;

        // search for highest ranked cards and push them to the new array
        for(var i = 14; i >= 2; i--)
        {
            for(var j = 0; j < hand.length; j++)
            {
                if(hand[j].rank == i)
                {
                    sortedArray.push(hand[j]);
                }
            }
        }

        // return newly sorted array
        return sortedArray;
    }

    // code taken from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


};
