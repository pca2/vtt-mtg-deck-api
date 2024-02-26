// Import Fastify
const fastify = require("fastify")({ logger: true });
const fetch = require('node-fetch');

// Declare a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});


// Declare a route to fetch JSON based on room_id
fastify.get("/:room_id", async (request, reply) => {
  const { room_id } = request.params;
  const url = `https://virtualtabletop.io/state/${room_id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Handle response errors (e.g., 404 or 500)
      reply.code(response.status).send({ error: "Failed to fetch data" });
      return;
    }
    const jsonData = await response.json();
    const updatedDeck = JSON.parse(JSON.stringify(jsonData));
    
    // Send the JSON data as response
    return jsonData;
  } catch (error) {
    // Handle network errors
    fastify.log.error(error);
    reply.code(500).send({ error: "Internal Server Error" });
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
