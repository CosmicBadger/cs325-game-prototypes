"use strict";

window.onload = function() 
{
    
    var game = new Phaser.Game(1000, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() 
    {
        game.load.image('PlayBG', 'assets/PlayBG.png');
        game.load.audio('IntroMusic', 'assets/IntroMusic.mp3');
    }
    
    // 0 = Title Screen, 1 = Gameplay, 2 = Story, 3 = Instructions
    var gameMode = 0;

    // Create keyboard keys to listen for
    var pKey;
    var sKey;
    var iKey;
    var key1;

    var deck = new Array;
    var discardPile = new Array;
    var hand = new Array;

    var music;

    function create() 
    {
        // Init music
        music = game.add.audio('IntroMusic');
        music.loop = true;
        music.play();

        // Init board
        game.add.sprite(0,0, 'PlayBG');

        createDeck(30);
        deck = sortHandByRank(deck);
        // printDeck();

        // var testHand = sortHandByRank(createHand(10));
        // console.log("TEST HAND: " + printHand(testHand));
        // var possibleStraights = identifyAllStraights(testHand);
        // // console.log("possibleStraights" + possibleStraights);
        // var straightFlushAttempt = identifyStraightFlushes(possibleStraights);
        // console.log("straightFlushAttempt" + printHand(straightFlushAttempt));
        // var straightAttempt = identifyHighestStraight(possibleStraights);
        // console.log("straightAttempt" + printHand(straightAttempt));
        // var flushAttempt = identifyFlush(testHand);
        // console.log("flushAttempt" + printHand(flushAttempt));
        // var fullHouseAttempt = identifyThreeOfKind(testHand);
        // console.log("fullHouseAttempt" + printHand(fullHouseAttempt));
        // var fourOfKindAttempt = identifyFourOfKind(testHand);
        // console.log("fourOfKindAttempt" + printHand(fourOfKindAttempt));

        window.alert("This game is still unplayable due to the unexpectedly immense amount of logic required to power it, but I've designed a short demo to demonstrate some things I currently have working under the hood");
        window.alert("You will be prompted to enter a number representing a number of playing cards to be randomly drawn. The program will then build the best possible hand out of those cards in various categories (full house, flush, etc.).");

        demo();
        // var handOne = sortHandByRank(createHand(5));
        // var handTwo = sortHandByRank(createHand(5));
        // var handThree = sortHandByRank(createHand(5));
        // var handFour = sortHandByRank(createHand(5));
        // var handFive = sortHandByRank(createHand(5));

        // console.log("handOne: " + printHand(handOne));
        // console.log("   -isFullHouse: " + isFullHouse(handOne));
        // console.log("   -isStraight: " + isStraight(handOne));
        // console.log("   -isFlush: " + isFlush(handOne));
        // console.log("   -isThreeOfKind: " + isThreeOfKind(handOne));

        // console.log("handTwo: " + printHand(handTwo));
        // console.log("   -isFullHouse: " + isFullHouse(handTwo));
        // console.log("   -isStraight: " + isStraight(handTwo));
        // console.log("   -isFlush: " + isFlush(handTwo));
        // console.log("   -isThreeOfKind: " + isThreeOfKind(handTwo));

        // console.log("handThree: " + printHand(handThree));
        // console.log("   -isFullHouse: " + isFullHouse(handThree));
        // console.log("   -isStraight: " + isStraight(handThree));
        // console.log("   -isFlush: " + isFlush(handThree));
        // console.log("   -isThreeOfKind: " + isThreeOfKind(handThree));

        // console.log("handFour: " + printHand(handFour));
        // console.log("   -isFullHouse: " + isFullHouse(handFour));
        // console.log("   -isStraight: " + isStraight(handFour));
        // console.log("   -isFlush: " + isFlush(handFour));
        // console.log("   -isThreeOfKind: " + isThreeOfKind(handFour));

        // console.log("handFive: " + printHand(handFive));
        // console.log("   -isFullHouse: " + isFullHouse(handFive));
        // console.log("   -isStraight: " + isStraight(handFive));
        // console.log("   -isFlush: " + isFlush(handFive));
        // console.log("   -isThreeOfKind: " + isThreeOfKind(handFive));

        // // TEST FOR THREE-PAIR
        // var cardOne = new Card(13,1);
        // var cardTwo = new Card(13,1);
        // var cardThree = new Card(13,2);
        // var cardFour = new Card(4,3);
        // var cardFive = new Card(4,1);
        // var cardSix = new Card(9,2);
        // var cardSeven = new Card(2,1);
        // var testHand = [cardOne, cardTwo, cardThree, cardFour, cardFive, cardSix, cardSeven];

        // var testArray = identifyFourOfKind(deck);
        // console.log("4oK: " + printHand(testArray));
        // var testArray = identifyThreeOfKind(testHand);

        // var testArray = identifyAllStraights(deck)
        // identifyHighestStraight(testArray);
        // var testArray = identifyFlush(deck)
        // var testArray = identifyStraightFlushes(testArray)

        // // TEST FOR STRAIGHT
        // var cardOne = new Card(14,1);
        // var cardTwo = new Card(12,1);
        // var cardThree = new Card(13,2);
        // var cardFour = new Card(10,3);
        // var cardFive = new Card(11,1);
        // var testHand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

        // // TEST FOR FLUSH
        // var cardOne = new Card(14,1);
        // var cardTwo = new Card(12,1);
        // var cardThree = new Card(13,1);
        // var cardFour = new Card(10,1);
        // var cardFive = new Card(11,1);
        // var testHand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

        // // TEST FOR STRAIGHT-FLUSH
        // var cardOne = new Card(8,1);
        // var cardTwo = new Card(12,1);
        // var cardThree = new Card(9,1);
        // var cardFour = new Card(10,1);
        // var cardFive = new Card(11,1);
        // var testHand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

        // // TEST FOR FOUR-OF-A-KIND
        // var cardOne = new Card(8,1);
        // var cardTwo = new Card(8,3);
        // var cardThree = new Card(8,0);
        // var cardFour = new Card(8,2);
        // var cardFive = new Card(11,1);
        // var testHand = [cardOne, cardTwo, cardThree, cardFour, cardFive];

        // // PRINT TEST HAND
        // var printString = "|";
        // for(var i = 0; i < testHand.length; i++)
        // {
        //     printString += ("| " + testHand[i].name + " |");
        // }
        // printString += "|";
        // console.log("testHand: " + printString);



        // console.log("isStraight: " + isStraight(testHand));
        // console.log("isFlush: " + isFlush(testHand));
        // console.log("isStraightFlush: " + isStraightFlush(testHand));
        // console.log("isFourOfKind: " + isFourOfKind(testHand));

        // var cardOne = new Card(4,1);
        // var cardTwo = new Card(2,1);
        // var cardThree = new Card(6,2);
        // var cardFour = new Card(11,3);
        // var testArray = [[cardOne, cardTwo], [cardThree, cardFour]];

        // var printString = "";
        // for(var i = 0; i < testArray.length; i++)
        // {
        //     printString = "Straight #" + i + ": ";
        //     for(var j = 0; j < testArray[i].length; j++)
        //     {
        //         printString += (testArray[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }


        
    	
    }
    
    function update() 
    {
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
                var straightFlushAttempt = identifyStraightFlushes(possibleStraights);
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

    function evaluateHand(hand)
    {
        for(var i = 0; i < hand.length; i++)
        {
            return true;
        }
    }

    // return true if handOne is GREATER THAN handTwo
    function compareHands(handOne, handTwo)
    {
        // if both hands are straight flushes
        if(isStraightFlush(handOne) && isStraightFlush(handTwo))
        {
            // evaluate straight flushes and return one with highest score
        }
        // if handOne is a straight flush and handTwo is NOT
        else if(isStraightFlush(handOne) && (isStraightFlush(handTwo) == false))
        {
            // handOne wins
            return true;
        }
        // if handOne is NOT straight flush and handTwo is
        else if((isStraightFlush(handOne) == false) && isStraightFlush(handTwo))
        {
            // handTwo wings
            return false;
        }
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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < straightsArray.length; i++)
        // {
        //     printString = "Straight #" + i + ": ";
        //     for(var j = 0; j < straightsArray[i].length; j++)
        //     {
        //         printString += (straightsArray[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

        for(var i = 0; i < straightsArray.length; i++)
        {
            straightsArray[i] = sortHandByRank(straightsArray[i]);
        }

        // ///////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < straightsArray.length; i++)
        // {
        //     printString = "Straight #" + i + ": ";
        //     for(var j = 0; j < straightsArray[i].length; j++)
        //     {
        //         printString += (straightsArray[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "|";
        // for(var i = 0; i < bestFlush.length; i++)
        // {
        //     printString += ("| " + bestFlush[i].name + " |");
        // }
        // printString += "|";
        // console.log("bestFlush: " + printString);
        // ////////////////////////////////////////////////////////////////////

        return bestFlush;
    }

    // take a straightArray from identifyAllStraights() and return the highest possible straight-flush
    function identifyStraightFlushes(straightsArray)
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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < straightFlushes.length; i++)
        // {
        //     printString = "StraightFlush #" + i + ": ";
        //     for(var j = 0; j < straightFlushes[i].length; j++)
        //     {
        //         printString += (straightFlushes[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

    // return an array with all valid four-of-a-kinds that may be formed from a given hand
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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < foursOfKind.length; i++)
        // {
        //     printString = "4oK #" + i + ": ";
        //     for(var j = 0; j < foursOfKind[i].length; j++)
        //     {
        //         printString += (foursOfKind[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < foursOfKind.length; i++)
        // {
        //     printString = "4oK #" + i + ": ";
        //     for(var j = 0; j < foursOfKind[i].length; j++)
        //     {
        //         printString += (foursOfKind[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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


        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < foursOfKind.length; i++)
        // {
        //     printString = "4oK #" + i + ": ";
        //     for(var j = 0; j < foursOfKind[i].length; j++)
        //     {
        //         printString += (foursOfKind[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < threesOfKind.length; i++)
        // {
        //     printString = "3oK #" + i + ": ";
        //     for(var j = 0; j < threesOfKind[i].length; j++)
        //     {
        //         printString += (threesOfKind[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

        // set foursOfKind equal to the new array, with incomplete three-of-a-kinds removed
        threesOfKind = newThreesOfKind;

        if(threesOfKind.length == 0)
        {
            return false;
        }

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < threesOfKind.length; i++)
        // {
        //     printString = "3oK #" + i + ": ";
        //     for(var j = 0; j < threesOfKind[i].length; j++)
        //     {
        //         printString += (threesOfKind[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "|";
        // for(var i = 0; i < bestHand.length; i++)
        // {
        //     printString += ("| " + bestHand[i].name + " |");
        // }
        // printString += "|";
        // console.log("bestHand: " + printString);
        // ////////////////////////////////////////////////////////////////////

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "";
        // for(var i = 0; i < pairsArray.length; i++)
        // {
        //     printString = "Pair #" + i + ": ";
        //     for(var j = 0; j < pairsArray[i].length; j++)
        //     {
        //         printString += (pairsArray[i][j].name + " / ");
        //     }
        //     console.log(printString);
        // }
        // ////////////////////////////////////////////////////////////////////

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printStringTwo = "|";
        // for(var i = 0; i < bestPair.length; i++)
        // {
        //     printStringTwo += ("| " + bestPair[i].name + " |");
        // }
        // printStringTwo += "|";
        // console.log("bestPair: " + printStringTwo);
        // ////////////////////////////////////////////////////////////////////

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
                console.log("highestCard.rank: " + highestCard.rank);

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

        // ////////////////////////////////////////////////////////////////////
        // console.log("------------------------------------------------------------------------------------------------");
        // var printString = "|";
        // for(var i = 0; i < bestHand.length; i++)
        // {
        //     printString += ("| " + bestHand[i].name + " |");
        // }
        // printString += "|";
        // console.log("bestHand: " + printString);
        // ////////////////////////////////////////////////////////////////////

        return bestHand;
    }

    // function identifyTwoPair()
    // {

    // }

    // function identifyPair()
    // {

    // }

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
