// JSON Server module
const jsonServer = require("json-server");
const server = jsonServer.create();
const port = process.env.PORT || 8080;
const router = jsonServer.router("db.json");

// Make sure to use the default middleware
const middlewares = jsonServer.defaults({ readonly: false });

server.use(middlewares);
// Add this before server.use(router)
server.use(
//  // Add custom route here if needed
 jsonServer.rewriter({
  "/api/*": "/$1",
 })
);
server.use(router);
// Listen to port
server.listen(port, () => {
 console.log("JSON Server is running on port: ", port);
});

// Export the Server API
module.exports = server;

//integrate nodejs api with postgreSQL?
