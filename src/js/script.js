// Toggle navbar
const navBurger = document.getElementById("navBurger");
const navContent = document.getElementById("navContent");

navBurger.onclick = () => {
  navBurger.classList.toggle("active-nav");
  navContent.classList.toggle("active-nav");
};

// Toggle buttons in settings
const ccToggleBtn = document.getElementById("ccToggleBtn");
ccToggleBtn.onclick = () => {
  ccToggleBtn.classList.toggle("is-on");
};

const soundsTogleBtn = document.getElementById("soundsTogleBtn");
soundsTogleBtn.onclick = () => {
  soundsTogleBtn.classList.toggle("is-on");
};

// Create decks of cards
const suits = ["♠", "♣", "♦", "♥"],
  values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  shuffleCard = "Shuffle Card";
let allDecks = [];
let numberOfDecks = document.getElementById("deckNumberChoose");
const newGameButton = document.getElementById("newGameButton");

newGameButton.onclick = () => {
  // Close settings
  navBurger.classList.toggle("active-nav");
  navContent.classList.toggle("active-nav");

  // New game
  numberOfDecks = document.getElementById("deckNumberChoose");
  allDecks = [];
  createDecks(numberOfDecks.value);
  shuffleDeck();
  addShuffleCard();

  //! Docasny
  console.clear();
  setTimeout(() => {
    for (let i = 0; i < allDecks.length; i++) {
      if (allDecks[i].suit === !undefined)
        console.log(i + 1, allDecks[i].value + " " + allDecks[i].suit);
      console.log(i + 1, allDecks[i].value);
    }
  }, 250);
};

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
createDecks(numberOfDecks.value);

// Shuffle N decks
const shuffleDeck = () => {
  for (let i = allDecks.length - 1; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = allDecks[newIndex];
    allDecks[newIndex] = allDecks[i];
    allDecks[i] = oldValue;
  }
};
shuffleDeck();

// Add shuffle card to the deck
const addShuffleCard = () => {
  switch (numberOfDecks.value) {
    case "1":
      allDecks.splice(Math.floor(allDecks.length * 0.8), 0, {
        value: shuffleCard,
      });
      break;
    case "2":
      allDecks.splice(Math.floor(allDecks.length * 0.85), 0, {
        value: shuffleCard,
      });
      break;
    case "4":
    case "6":
    case "8":
      allDecks.splice(Math.floor(allDecks.length * 0.9), 0, {
        value: shuffleCard,
      });
      break;
    default:
      console.log("Error");
      break;
  }
};
addShuffleCard();

// Console log decks
for (let i = 0; i < allDecks.length; i++) {
  if (allDecks[i].suit === !undefined)
    console.log(i + 1, allDecks[i].value + " " + allDecks[i].suit);
  console.log(i + 1, allDecks[i].value);
}
