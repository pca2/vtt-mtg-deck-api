// Import Fastify
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
import fetch from 'node-fetch';
import cors from '@fastify/cors'
fastify.register(cors, {
  // Put your options here
  origin: "*", // Allow all origins
  methods: ["GET"], // Specify which methods to allow
});
//const cardTypes = require('./cardTypes.json');
//const cards = require('./cards.json');
import { fetchRoomData, updateRoomData } from "./vtt.js";
import { getMoxfieldData } from "./moxfield.js";

function removeDeckCards(roomObject, deckName) {
  let updatedRoom = JSON.parse(JSON.stringify(roomObject));
  Object.keys(updatedRoom).forEach(key => {
    const value = updatedRoom[key];
    if (typeof value === 'object' && value !== null) {
      if (value.deck === deckName && value.type === 'card') {
        delete updatedRoom[key];
      } else {
        removeDeckCards(value);
      }
    }
  });
  return updatedRoom
}

// Helper function to modify room data
function modifyRoomData(roomData, moxFieldData, playerNumber) {
  const playerDeckName = 'playerDeck' + playerNumber
  let updatedRoom = removeDeckCards(roomData, playerDeckName);
  updatedRoom[playerDeckName]['cardTypes'] = moxFieldData.cardTypes;
  const finalRoom = { ...updatedRoom, ...moxFieldData.cardsObject };
  return finalRoom;
}


// Declare a route to handle the request
fastify.get("/:room_id/:moxfield_id/:playerNumber", async (request, reply) => {
  try {
    const { room_id, moxfield_id, playerNumber } = request.params;
    const roomData = await fetchRoomData(room_id);
    const moxFieldData = await getMoxfieldData(moxfield_id, playerNumber)
    const modifiedData = modifyRoomData(roomData, moxFieldData, playerNumber);
    // Uncomment the following line if you wish to update the room data back to the server
    const updateResponse = await updateRoomData(room_id, modifiedData);
    console.log(updateResponse)
    reply.send({"status": updateResponse});
  } catch (error) {
    fastify.log.error(error);
    reply.code(error.message === 'Failed to fetch data' || error.message === 'Failed to update data' ? 500 : 500).send({ error: error.message });
  }
});


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log(`Server is running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
