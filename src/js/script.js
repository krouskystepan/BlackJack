// Toggle navbar
const navBurger = document.getElementById("navBurger");
const nav = document.getElementById("nav");

navBurger.onclick = () => {
  navBurger.classList.toggle("active-nav");
  nav.classList.toggle("active-nav");
};

// Toggle buttons in settings
const ccToggleBtn = document.getElementById("ccToggleBtn");
const infoPanel = document.getElementById("info");
const deckImage = document.getElementById("fullDeck");
ccToggleBtn.onclick = () => {
  ccToggleBtn.classList.toggle("is-on");

  if (ccToggleBtn.classList.contains("is-on")) {
    infoPanel.classList.add("active-panel");
    deckImage.classList.add("hidden");
  } else {
    infoPanel.classList.remove("active-panel");
    deckImage.classList.remove("hidden");
  }
};

const soundsTogleBtn = document.getElementById("soundsTogleBtn");
const PLAYER_WIN_SOUND = new Audio("../assets/sounds/playerWin.mp3");
const DEALER_WIN_SOUND = new Audio("../assets/sounds/dealerWin.mp3");
const CARD_SHUFFLE_SOUND = new Audio("../assets/sounds/cardShuffle.mp3");
let SOUND_VOLUME = 0.0;
PLAYER_WIN_SOUND.volume = SOUND_VOLUME;
DEALER_WIN_SOUND.volume = SOUND_VOLUME;
CARD_SHUFFLE_SOUND.volume = SOUND_VOLUME;
soundsTogleBtn.onclick = () => {
  soundsTogleBtn.classList.toggle("is-on");

  if (soundsTogleBtn.classList.contains("is-on")) {
    SOUND_VOLUME = 0.3;
  } else {
    SOUND_VOLUME = 0.0;
  }
  PLAYER_WIN_SOUND.volume = SOUND_VOLUME;
  DEALER_WIN_SOUND.volume = SOUND_VOLUME;
  CARD_SHUFFLE_SOUND.volume = SOUND_VOLUME;
};

// Change deck img according to deck size
const deckImgSize = document.getElementById("deckOfCards");
const changeDeckImgSize = () => {
  deckImgSize.src =
    "./assets/img/decksAndCards/deck3D-" + numberOfDecks.value + "d.png";
};

// Change balace
let balanceChoose = document.getElementById("balanceChoose");
let playerBalanceHTML = document.getElementById("playerBalance");
let playerBalance = 0;
const changePlayerBalance = () => {
  playerBalance = Number(balanceChoose.value);
  playerBalanceHTML.innerText = playerBalance.toLocaleString("cs");
};

// New game
const newGameButton = document.getElementById("newGameButton");
const newGame = () => {
  console.clear();
  numberOfDecks = document.getElementById("deckNumberChoose");
  allDecks = [];
  playerCards = [];
  dealerCards = [];
  currentDeckIndex = 0;
  totalBet = 0;
  cardCount = 0;
  cardCountingValue.innerText = cardCount;
  createDecks(numberOfDecks.value);
  shuffleDeck();
  changeDeckImgSize();
  changePlayerBalance();
  updateBalance();
  playerHand.innerHTML = "";
  dealerHand.innerHTML = "";
  gameMenu.classList.remove("active-menu");
  betMenu.classList.remove("active-menu");
  chipsMenu.classList.add("active-menu");
  clearBetButton.classList.add("active");
  betButton.classList.add("active");
};

newGameButton.onclick = () => {
  // Close settings
  navBurger.classList.toggle("active-nav");
  nav.classList.toggle("active-nav");

  newGame();
};

// Create decks of cards
const suits = ["♠", "♣", "♦", "♥"],
  values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let allDecks = [];
let currentDeckIndex = 0;
let numberOfDecks = document.getElementById("deckNumberChoose");
const createDecks = (num) => {
  for (let i = 0; i < num; i++) {
    let curDeck = [];
    for (let j = 0; j < suits.length; j++) {
      for (let k = 0; k < values.length; k++) {
        curDeck.push({ value: values[k], suit: suits[j] });
      }
    }
    allDecks.push(curDeck);
  }
  allDecks = allDecks.flatMap((num) => num);

  return allDecks;
};

// Shuffle N decks
let documentSound = false;
const shuffleDeck = () => {
  if (documentSound) {
    CARD_SHUFFLE_SOUND.play();
  }
  documentSound = true;
  for (let i = allDecks.length - 1; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = allDecks[newIndex];
    allDecks[newIndex] = allDecks[i];
    allDecks[i] = oldValue;
  }
  
  for (let i = 0; i < allDecks.length; i++) {
    if (allDecks[i].suit === undefined) console.log(i + 1, allDecks[i].value);
    else console.log(i + 1, allDecks[i].value + " " + allDecks[i].suit);
  }
};

// Get next card from the deck
const cardCountingValue = document.getElementById("cardCountingValue");
const getNextCard = () => {
  let card = allDecks[currentDeckIndex];
  currentDeckIndex++;
  if (currentDeckIndex === allDecks.length) {
    createDecks(document.getElementById("deckNumberChoose"));
    shuffleDeck();
    cardCount = 0;
    cardCountingValue.innerText = 0;
    currentDeckIndex = 0;
  }
  return card;
};

// Game logic
let playerCards = [];
let dealerCards = [];
let gameOver = false;
let hasBJ = false;
let cardCount = 0;

// Deal cards to player and dealer
// CALL THIS AFTER BET TO GIVE 2 CARDS
const dealCards = () => {
  if (!gameOver) {
    playerCards.push(getNextCard());
    dealerCards.push(getNextCard());
    playerCards.push(getNextCard());

    // dealerCards.push({value: "A"});
    // dealerCards.push({value: "10"});

    // console.log("Player's hand: ", playerCards);
    // console.log("Player's score: ", getHandScore(playerCards));
    // console.log("Dealer's hand: ", dealerCards);
    // console.log("Dealer's score: ", getHandScore(dealerCards));

    playerCards.map((card) => {
      if (getCardValue(card) >= 2 && getCardValue(card) <= 6) {
        cardCount++;
      } else if (getCardValue(card) >= 10 || getCardValue(card) === 1) {
        cardCount--;
      }
    });
    dealerCards.map((card) => {
      if (getCardValue(card) >= 2 && getCardValue(card) <= 6) {
        cardCount++;
      } else if (getCardValue(card) >= 10 || getCardValue(card) === 1) {
        cardCount--;
      }
    });

    cardCountingValue.innerText = cardCount;
    updateDisplay();

    dealerCards.push(getNextCard());

    dealerCards.slice(1).map((card) => {
      if (getCardValue(card) >= 2 && getCardValue(card) <= 6) {
        cardCount++;
      } else if (getCardValue(card) >= 10 || getCardValue(card) === 1) {
        cardCount--;
      }
    });

    // Check for blackjack hand
    if (getHandScore(playerCards) === 21) {
      gameOver = true;
      updateDisplay();
      determineWinner();
    } else if (getHandScore(dealerCards) === 21) {
      gameOver = true;
      updateDisplay();
      determineWinner();
    }
  }
};

// Get the value of a card
const getCardValue = (card) => {
  if (card.value === "A") {
    return 11;
  } else if (["J", "Q", "K"].includes(card.value)) {
    return 10;
  } else {
    return parseInt(card.value);
  }
};

// Get the current score for a hand of cards
const getHandScore = (cards) => {
  let score = 0;
  let numAces = 0;
  for (let card of cards) {
    score += getCardValue(card);
    if (card.value === "A") {
      numAces++;
    }
  }

  // If the score is over 21 and there is an Ace in the hand,
  // check if it can be 1 instead of 11
  while (score > 21 && numAces > 0) {
    score -= 10;
    numAces--;
  }
  return score;
};

// Update the player's and dealer hands
const playerHand = document.getElementById("playerHand");
const updateDisplay = () => {
  playerHand.innerHTML = `
    ${playerCards
      .map(
        (card) =>
          `    
          <div class="card ${card.suit} cardUp">
            <div class="top">
            <span class="value">${card.value}</span>
              <span class="suit">${card.suit}</span>
            </div>
            <div class="bottom">
              <span class="value">${card.value}</span>
              <span class="suit">${card.suit}</span>
            </div>
          </div>
          `
      )
      .join("")}
  `;

  let dealerHandHTML = `    
  <div class="card ${dealerCards[0].suit} cardUp">
    <div class="top">
    <span class="value">${dealerCards[0].value}</span>
      <span class="suit">${dealerCards[0].suit}</span>
    </div>
    <div class="bottom">
      <span class="value">${dealerCards[0].value}</span>
      <span class="suit">${dealerCards[0].suit}</span>
    </div>
  </div>
  `;

  if (gameOver) {
    dealerHandHTML = `
        ${dealerCards
          .map(
            (card) =>
              `    
            <div class="card ${card.suit} cardUp">
              <div class="top">
              <span class="value">${card.value}</span>
                <span class="suit">${card.suit}</span>
              </div>
              <div class="bottom">
                <span class="value">${card.value}</span>
                <span class="suit">${card.suit}</span>
              </div>
            </div>
            `
          )
          .join("")}
      `;
  } else {
    dealerHandHTML += `
        <img class="card" src="./assets/img/decksAndCards/card.png" />
      `;
  }
  dealerHand.innerHTML = dealerHandHTML;
};

// Determine the winner of the round
const winnerText = document.getElementById("winnerText");
const returnOutput = (who) => {
  playerCards = [];
  dealerCards = [];
  gameOver = false;
  switch (who) {
    case "PlayerBJ":
      playerBalance += Math.floor((3 / 2) * totalBet) + totalBet;
      totalBet = 0;
      hasBJ = true;
      PLAYER_WIN_SOUND.play();
      updateBalance();
      winnerText.innerText = "Player has a blackjack!";
      return "Player has a blackjack!";
    case "DealerBJ":
      totalBet = 0;
      hasBJ = true;
      DEALER_WIN_SOUND.play();
      updateBalance();
      winnerText.innerText = "Dealer has a blackjack!";
      return "Dealer has a blackjack!";
    case "DealerBUST":
      playerBalance += totalBet * 2;
      totalBet = 0;
      PLAYER_WIN_SOUND.play();
      updateBalance();
      winnerText.innerText = "Dealer busts, player wins";
      return "Dealer busts, player wins";
    case "PlayerBUST":
      totalBet = 0;
      DEALER_WIN_SOUND.play();
      updateBalance();
      winnerText.innerText = "Player busts, dealer wins";
      return "Player busts, dealer wins";
    case "PlayerWIN":
      playerBalance += totalBet * 2;
      totalBet = 0;
      PLAYER_WIN_SOUND.play();
      updateBalance();
      winnerText.innerText = "Player wins";
      return "Player wins";
    case "DealerWIN":
      totalBet = 0;
      DEALER_WIN_SOUND.play();
      updateBalance();
      winnerText.innerText = "Dealer wins";
      return "Dealer wins";
    case "PUSH":
      playerBalance += totalBet;
      totalBet = 0;
      updateBalance();
      winnerText.innerText = "Push";
      return "Push";
    default:
      break;
  }
};

let previousBet;
const determineWinner = () => {
  cardCountingValue.innerText = cardCount;
  handEnd();
  previousBet = totalBet;
  if (playerCards.length === 2 && getHandScore(playerCards) === 21) {
    return returnOutput("PlayerBJ");
  } else if (dealerCards.length === 2 && getHandScore(dealerCards) === 21) {
    return returnOutput("DealerBJ");
  } else if (getHandScore(playerCards) > 21) {
    return returnOutput("PlayerBUST");
  } else if (getHandScore(dealerCards) > 21) {
    return returnOutput("DealerBUST");
  } else if (getHandScore(playerCards) > getHandScore(dealerCards)) {
    return returnOutput("PlayerWIN");
  } else if (getHandScore(dealerCards) > getHandScore(playerCards)) {
    return returnOutput("DealerWIN");
  } else {
    return returnOutput("PUSH");
  }
};

// Menu
const gameMenu = document.getElementById("gameMenu");
const betMenu = document.getElementById("betMenu");
const chipsMenu = document.getElementById("chipsMenu");
const handEnd = () => {
  if (hasBJ) return;
  gameMenu.classList.remove("active-menu");
  chipsMenu.classList.remove("active-menu");
  betMenu.classList.add("active-menu");
};

// Game Menu
const hitButton = document.getElementById("hitBtn");
hitButton.addEventListener("click", () => {
  if (!gameOver) {
    previousBet = totalBet;
    playerCards.push(getNextCard());
    // console.log("Player's hand: ", playerCards);
    // console.log("Player's score: ", getHandScore(playerCards));
    updateDisplay();
    if (getHandScore(playerCards) > 21) {
      gameOver = true;
      updateDisplay();
      let winner = determineWinner();
      console.log("Winner:", winner);
    }
  }
});

const standButton = document.getElementById("standBtn");
const standFce = () => {
  if (!gameOver) {
    previousBet = totalBet;
    gameOver = true;
    while (getHandScore(dealerCards) < 17) {
      dealerCards.push(getNextCard());
    }
    updateDisplay();
    // console.log("Dealer's hand: ", dealerCards);
    // console.log("Dealer's score: ", getHandScore(dealerCards));
    let winner = determineWinner();
    console.log("Winner:", winner);
  }
};
standButton.addEventListener("click", standFce);

const doubleButton = document.getElementById("doubleBtn");
doubleButton.onclick = () => {
  if (!gameOver && playerCards.length === 2) {
    if (totalBet * 2 > playerBalance) return alert("Na to nemas zetony");
    playerCards.push(getNextCard());
    // console.log("Player's hand: ", playerCards);
    // console.log("Player's score: ", getHandScore(playerCards));

    playerBalance -= totalBet;
    totalBet *= 2;
    updateBalance();

    if (getHandScore(playerCards) > 21) {
      updateDisplay();
      gameOver = true;
      let winner = determineWinner();
      console.log("Winner:", winner);
    } else {
      standFce();
    }
    document
      .getElementById("playerHand")
      .getElementsByClassName("card")[2]
      .classList.add("double");
  }
};

// Bet Menu
const rebetButton = document.getElementById("rebetBtn");
rebetButton.addEventListener("click", () => {
  if (previousBet > playerBalance) return alert("Na to nemas zetony");
  totalBet = previousBet;
  playerBalance -= totalBet;
  updateBalance();
  dealCards();
  if (hasBJ) return (hasBJ = false);
  gameMenu.classList.add("active-menu");
  betMenu.classList.remove("active-menu");
});

const doubleBetButton = document.getElementById("doubleBetBtn");
doubleBetButton.addEventListener("click", () => {
  if (previousBet * 2 > playerBalance) return alert("Na to nemas zetony");
  totalBet = previousBet * 2;
  playerBalance -= totalBet;
  updateBalance();
  dealCards();
  if (hasBJ) return (hasBJ = false);
  betMenu.classList.remove("active-menu");
  gameMenu.classList.add("active-menu");
});

const clearBetButton = document.getElementById("clearBetBtn");
const betButton = document.getElementById("betBtn");
const newBetButton = document.getElementById("newBetBtn");
newBetButton.addEventListener("click", () => {
  betMenu.classList.remove("active-menu");
  chipsMenu.classList.add("active-menu");
  clearBetButton.classList.add("active");
  betButton.classList.add("active");
});

clearBetButton.addEventListener("click", () => {
  playerBetHTML.innerText = "0";
  playerBalance += totalBet;
  playerBalanceHTML.innerText = playerBalance.toLocaleString("cs");
  totalBet = 0;
});

betButton.addEventListener("click", () => {
  if (totalBet === 0) return;
  previousBet = totalBet;
  dealCards();
  clearBetButton.classList.remove("active");
  betButton.classList.remove("active");
  if (hasBJ) {
    betMenu.classList.add("active-menu");
    chipsMenu.classList.remove("active-menu");
  } else {
    gameMenu.classList.add("active-menu");
  }
  chipsMenu.classList.remove("active-menu");
});

// Chips Menu
const chips = document.getElementsByClassName("chip");
const playerBetHTML = document.getElementById("playerBet");
let totalBet = 0;
let playerBet;

for (let i = 0; i < chips.length; i++) {
  chips[i].addEventListener("click", () => {
    playerBet = Number(chips[i].getAttribute("data-value"));

    if (playerBet > playerBalance) return alert("Na to nemas zetony");
    playerBalance -= playerBet;
    totalBet += playerBet;
    playerBalanceHTML.innerText = playerBalance.toLocaleString("cs");
    playerBetHTML.innerText = totalBet.toLocaleString("cs");
  });
}

const updateBalance = () => {
  playerBalanceHTML.innerText = playerBalance.toLocaleString("cs");
  playerBetHTML.innerText = totalBet.toLocaleString("cs");
};

newGame();
