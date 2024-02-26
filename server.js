// Import Fastify
const fastify = require("fastify")({ logger: true });

// Declare a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Declare a dynamic route
fastify.get("/:greeting/:name", async (request, reply) => {
  // Access the 'name' parameter from the URL
  const { greeting, name } = request.params;
  // Respond with a personalized message
  let response = {};
  response[greeting] = name;
  return response;
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
