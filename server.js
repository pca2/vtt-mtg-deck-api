// Import Fastify
const fastify = require("fastify")({ logger: true });

// Declare a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Declare a dynamic route
fastify.get('/:greeting/:name', async (request, reply) => {
  // Access the 'name' parameter from the URL
  const { greeting, name } = request.params;
  // Respond with a personalized message
  let response = {};
  response[greeting] = name;
  return response;
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
