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

  document.getElementById("deckDepth").innerText = Number(numberOfDecks.value).toFixed(2);
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

newGame();

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

