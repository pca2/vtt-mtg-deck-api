// Import Fastify
const fastify = require("fastify")({ logger: true });
const fetch = require('node-fetch');
const cardTypes = require('./cardTypes.json');
const cards = require('./cards.json');
import { fetchRoomData, updateRoomData } from "./vtt";

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
function modifyRoomData(roomData) {
  let updatedRoom = JSON.parse(JSON.stringify(roomData));
  removeDeckCards(updatedRoom, 'playerDeck1');
  updatedRoom['playerDeck1']['cardTypes'] = cardTypes;
  const finalRoom = { ...updatedRoom, ...cards };
  return finalRoom;
}


// Declare a route to handle the request
fastify.get("/:room_id", async (request, reply) => {
  try {
    const { room_id } = request.params;
    const roomData = await fetchRoomData(room_id);
    const modifiedData = modifyRoomData(roomData);
    // Uncomment the following line if you wish to update the room data back to the server
    // const updateResponse = await updateRoomData(room_id, modifiedData);
    reply.send(modifiedData);
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
