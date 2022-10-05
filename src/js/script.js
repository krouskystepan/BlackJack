// Vytvorime balicky karet
const suits = ["♠", "♣", "♦", "♥"],
  values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let allDecks = [];
let numberOfDecks = 4;

const createDecks = () => {
  for (let i = 0; i < numberOfDecks; i++) {
    let curDeck = [];
    for (let j = 0; j < suits.length; j++) {
      for (let k = 0; k < values.length; k++) {
        curDeck.push({ value: values[k], suit: suits[j] });
      }
    }
    allDecks.push(curDeck);
  }
  return allDecks;
};
createDecks();
allDecks = allDecks.flatMap((num) => num);

// Zamichame balicek s N balicky
const shuffleDeck = () => {
  for (let i = allDecks.length - 1; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = allDecks[newIndex];
    allDecks[newIndex] = allDecks[i];
    allDecks[i] = oldValue;
  }
};
shuffleDeck();

// Vypise vsechny zamichane karty v N balicku
for (let i = 0; i < allDecks.length; i++) {
  console.log(i + 1, allDecks[i].value + " " + allDecks[i].suit);
}
