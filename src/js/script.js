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
ccToggleBtn.onclick = () => {
  ccToggleBtn.classList.toggle("is-on");

  if (ccToggleBtn.classList.contains("is-on")) {
    infoPanel.classList.add("active-panel");
  } else {
    infoPanel.classList.remove("active-panel");
  }
};

const soundsTogleBtn = document.getElementById("soundsTogleBtn");
soundsTogleBtn.onclick = () => {
  soundsTogleBtn.classList.toggle("is-on");
};

// Change deck img according to deck size
const deckImgSize = document.getElementById("deckOfCards");
const changeDeckImgSize = () => {
  deckImgSize.src =
    "./assets/img/decksAndCards/deck3D-" + numberOfDecks.value + "d.png";
};

// Change balace
let balanceChoose = document.getElementById("balanceChoose");
let playerBalance = document.getElementById("playerBalance");
const changePlayerBalance = () => {
  playerBalance.innerText = Number(balanceChoose.value).toLocaleString("cs");
};

// Change cursor to clicked chip and select chip
const chips = document.getElementsByClassName("chip");
const table = document.getElementById("table-container");
let previousChip, previousSelectedChip;
for (let i = 0; i < chips.length; i++) {
  chips[i].addEventListener("click", () => {
    if (
      !table.classList.contains("chipCursor") ||
      previousChip !== chips[i].getAttribute("data-value")
    ) {
      if (previousSelectedChip !== undefined)
        chips[previousSelectedChip].classList.remove("selected");
      chips[i].classList.add("selected");
      previousChip = chips[i].getAttribute("data-value");
      previousSelectedChip = chips[i].getAttribute("data-index");
      table.classList.add("chipCursor");
      table.style.setProperty(
        "--url",
        'url("../assets/img/chips75x75/coin' +
          chips[i].getAttribute("data-value") +
          '.png")'
      );
    } else {
      table.classList.remove("chipCursor");
      table.style.setProperty("--url", "");
      chips[i].classList.remove("selected");
    }
  });

  // Hover on chips bcs Safari sucks :)
  chips[i].addEventListener("mouseenter", () => {
    chips[i].style.scale = "1.15";
  });
  chips[i].addEventListener("mouseout", () => {
    chips[i].style.scale = "1";
  });
}

// New game
const newGameButton = document.getElementById("newGameButton");
const newGame = () => {
  numberOfDecks = document.getElementById("deckNumberChoose");
  allDecks = [];
  createDecks(numberOfDecks.value);
  shuffleDeck();
  addShuffleCard();
  changeDeckImgSize();
  changePlayerBalance();

  document.getElementById("deckDepth").innerText = Number(
    numberOfDecks.value
  ).toFixed(2);
};

newGameButton.onclick = () => {
  // Close settings
  navBurger.classList.toggle("active-nav");
  nav.classList.toggle("active-nav");

  newGame();

  // Docasny
  console.clear();
  setTimeout(() => {
    for (let i = 0; i < allDecks.length; i++) {
      if (allDecks[i].suit === undefined) console.log(i + 1, allDecks[i].value);
      else console.log(i + 1, allDecks[i].value + " " + allDecks[i].suit);
    }
  }, 250);
};

// Create decks of cards
const suits = ["♠", "♣", "♦", "♥"],
  values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  shuffleCard = "Shuffle Card";
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
const shuffleDeck = () => {
  for (let i = allDecks.length - 1; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = allDecks[newIndex];
    allDecks[newIndex] = allDecks[i];
    allDecks[i] = oldValue;
  }
};

// Add shuffle card to the deck
const addShuffleCard = () => {
  switch (Number(numberOfDecks.value)) {
    case 1:
      allDecks.splice(Math.floor(allDecks.length * 0.8), 0, {
        value: shuffleCard,
      });
      break;
    case 2:
      allDecks.splice(Math.floor(allDecks.length * 0.85), 0, {
        value: shuffleCard,
      });
      break;
    case 4:
    case 6:
    case 8:
      allDecks.splice(Math.floor(allDecks.length * 0.9), 0, {
        value: shuffleCard,
      });
      break;
    default:
      console.log("Add shuffle card Error");
      break;
  }
};

// Get next card from the deck
const getNextCard = () => {
  let card = allDecks[currentDeckIndex];
  currentDeckIndex++;
  if (currentDeckIndex === allDecks.length) {
    shuffleDeck();
    currentDeckIndex = 0;
  }
  if (card.value === shuffleCard) {
    addShuffleCard();
  }
  // if (card.value !== shuffleCard) {
  //   cardCount += countCards(card);
  // }
  return card;
};

// Game logic
let playerCards = [];
let dealerCards = [];
let currentBet = 0;
let cardCount = 0;
let gameOver = false;

// Deal cards to player and dealer
const dealCards = () => {
  if (!gameOver) {
    playerCards = [getNextCard(), getNextCard()];
    dealerCards = [getNextCard(), getNextCard()];
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

// Determine the winner of the round
const determineWinner = () => {
  let playerScore = getHandScore(playerCards);
  let dealerScore = getHandScore(dealerCards);

  if (playerScore === 21 && playerCards.length === 2) {
    return "Blackjack - Player";
  } else if (dealerScore === 21 && dealerCards.length === 2) {
    return "Blackjack - Dealer";
  } else if (playerScore > 21) {
    return "Player busts, dealer wins";
  } else if (dealerScore > 21) {
    return "Dealer busts, player wins";
  } else if (playerScore > dealerScore) {
    return "Player wins";
  } else if (dealerScore > playerScore) {
    return "Dealer wins";
  } else {
    return "Push";
  }
};

const hitButton = document.getElementById("hitBtn");
hitButton.addEventListener("click", () => {
  if (!gameOver) {
    playerCards.push(getNextCard());
    let playerScore = getHandScore(playerCards);
    console.log("Player's hand: ", playerCards);
    console.log("Player's score: ", playerScore);
    if (playerScore > 21) {
      gameOver = true;
      console.log("Player busts!");
      let winner = determineWinner();
      console.log("Winner: ", winner);
    }
  }
});

const standButton = document.getElementById("standBtn");
standButton.addEventListener("click", () => {
  if (!gameOver) {
    gameOver = true;
    while (getHandScore(dealerCards) < 17) {
      dealerCards.push(getNextCard());
    }
    console.log("Dealer's hand: ", dealerCards);
    console.log("Dealer's score: ", getHandScore(dealerCards));
    let winner = determineWinner();
    console.log("Winner: ", winner);
  }
});

newGame();
