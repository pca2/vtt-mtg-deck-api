// Utility function to convert strings to safe filenames
function toSafeString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
  }
  
async function fetchDeckData(url) {
const headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0",
};
try {
    const response = await fetch(url, {
    method: 'GET', // This is the default, but it's good to be explicit
    headers: headers,
    });
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Assuming the server response is JSON
    return data;
} catch (error) {
    console.error("Failed to fetch deck data:", error);
    throw error;
}
}
  
  
// Processes deck data into a structured format for JSON files
function processDeckData(deckData, playerNumber) {
const deckName = deckData.name;
const mainboard = deckData.mainboard;
let cardTypes = {};
let cardsObject = {};

Object.keys(mainboard).forEach((card) => {
    const name = mainboard[card].card.name;
    const count = mainboard[card].quantity;
    let cardName = toSafeString(name);
    cardTypes[cardName] = {
    label: name,
    image: `https://api.scryfall.com/cards/named?exact=${name
        .split(" ")
        .join("+")}&format=image`,
    };

    // Populate cards array with duplicates according to count
    for (let i = 1; i <= count; i++) {
    let objectName =
        cardName + "-" + Math.random().toString(36).substring(3, 7);
    cardsObject[objectName] = {
        deck: "playerDeck" + playerNumber,
        type: "card",
        cardType: cardName,
        id: objectName,
        parent: "playerPile" + playerNumber,
        //z: 45100 + count
    };
    }
});

return { cardTypes, cardsObject };
}

export async function getMoxfieldData(moxfield_id, playerNumber){
    const downloadUrl = `https://api2.moxfield.com/v2/decks/all/${moxfield_id}`;
    const deckData = await fetchDeckData(downloadUrl)
    return processDeckData(deckData, playerNumber)
}