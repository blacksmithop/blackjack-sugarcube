// game logic
$(document).ready(function() {

    function cardFace(suit, figure) {
        const suits = { 1: "clubs", 2: "diamonds", 3: "hearts", 4: "spades" };
        const figures = { 1: "ace", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "jack", 12: "queen", 13: "king" };
        var c = figures[figure] + "_of_" + suits[suit] + ".png";
        return c;
    }

    //Shuffle deck
    function shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
        return a;
    }

    // Create a deck of cards
    function deck() {
        this.create = function() {
            var cardArray = [];
            var i = 1;
            var j = 1;
            for (i = 1; i < 14; i++) {
                for (j = 1; j < 5; j++) {
                    cardArray.push(new Card(j, i));
                }
            }
            return shuffle(shuffle(cardArray));
        };
    }


    // deal a hand
    var deal = function(whos) {
        var newCard = gameDeck.pop();
        if (whos == "b") {
            countingDealersCards += 1;
        }
        console.log("[INFO] Dealing card")
        if (whos == "p") {
            console.log('[INFO] Player card dealt')
            $('.player-cards').prepend(`<img id='card' src='resources/images/deck/${cardFace(newCard.CardSuit, newCard.CardNumber)}'/>`);
        } else if (whos == "b" && countingDealersCards < 2) {
            $('.dealer-cards').prepend(`<img id='card' src='resources/images/deck/${cardFace(newCard.CardSuit, newCard.CardNumber)}'/>`);
        } else if (whos == "b" && countingDealersCards == 2) {
            $('.dealer-cards').prepend(`<img id='card' src='resources/images/deck/card-back.jpg'/>`);
        };
        return newCard;

    }

    // Create hand of cards
    function Hand(whos, howManyCards) {
        var who = whos;
        var cardArray = [];
        for (var i = 0; i < howManyCards; i++) {

            cardArray[i] = deal(who);
        }

        this.getHand = function() {
            return cardArray;
        };

        this.score = function() {
            var handSum = 0;
            var numofaces = 0;
            for (i = 0; i < cardArray.length; i++) {
                handSum += getValue(cardArray[i].CardNumber);
                if (cardArray[i].CardNumber === 1) {
                    numofaces += 1;
                }
            }
            if (handSum > 21 && numofaces != 0) {
                for (i = 0; i < numofaces; i++) {
                    if (handSum > 21) {
                        handSum -= 10;
                    }
                }
            }
            return handSum;
        };
        this.printHand = function() {
            var string = "";
            for (i = 0; i < cardArray.length; i++) {
                string = string + cardArray[i].getNumber() + " of suit " + cardArray[i].getSuit() + ", ";
            }
            return string;
        };
        this.hitMe = function(whos) {
            cardArray.push(deal(whos));
            this.getHand();
        };
    }

    // Card class
    class Card {
        constructor(suit, number) {
            this.CardSuit = suit;
            this.CardNumber = number;
        }
        get Suit() {
            return this.CardSuit;
        }

        get Number() {
            return this.CardNumber;
        }
    }


    function getValue(number) {
        if (number === 1) {
            return 11;
        } else if (number > 9) {
            return 10;
        } else {
            return number;
        }
    };

    // reveal dealer cards
    function revealDealerHand(hand) {
        var hand = hand.getHand();
        for (var i = 0; i < hand.length; i++) {
            $('.dealer-cards').prepend(`<img id='card' src='resources/images/deck/${cardFace(hand[i].CardSuit, hand[i].CardNumber)}'/>`);
        }
    }
    // Hit
    window.hit = function() {
        playerHand.hitMe("p");
        var result = firstResultCheck();
        inputUserScore(result);
        if (isNumeric(result)) {
            //pass;
        } else {
            $('#buttons').hide()
            return;
        }
    };


    window.stand = function() {
        while (dealerHand.score() < 17) {
            countingDealersCards = 0;
            dealerHand.hitMe("b");
        }
        var result = finalResultCheck();
        $('.dealers-cards img').remove();
        revealDealerHand(dealerHand);
        inputUserScore(result);
        if (isNumeric(result)) {
            //pass;
        } else {
            $('#buttons').hide()
            return;
        }
        return;
    };

    // check result
    var firstResultCheck = function() {
        var pS = playerHand.score();
        var dS = dealerHand.score();
        if (pS > 21) {
            if (dS > 21) {
                return "TideOver";
            } else {
                return "Bust";
            }
        } else if (dS > 21) {
            return "Win";
        } else if (pS === 21) {
            return "BJ";
        } else {
            return pS;
        }
    };

    var finalResultCheck = function() {
        var pS = playerHand.score();
        var dS = dealerHand.score();
        if (pS > 21) {
            if (dS > 21) {
                return "Tide";
            } else {
                return "Bust";
            }
        } else if (dS > 21) {
            return "Win";
        } else if (pS > dS) {
            return "Win";
        } else if (pS === dS) {
            return "Tide";
        } else {
            return "Bust";
        }
    };

    // Set score
    var inputUserScore = function(input) {
        $('#player-score').html(input);
    }


    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // run game
    var runGame = function() {
        var result = firstResultCheck();

        inputUserScore(result);
        if (isNumeric(result)) {
            //pass;
        } else {
            $('#buttons').hide()
            return;
        }
    }


    // test
    console.log("[INFO] Starting game of blackjack");

    var countingDealersCards = 0;

    var blackjack = new deck()
    var gameDeck = blackjack.create()

    var dealerHand = new Hand("b", 2);
    var playerHand = new Hand("p", 2);

    runGame();

});