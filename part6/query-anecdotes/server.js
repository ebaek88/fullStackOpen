import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const validator = (request, response, next) => {
  console.log("BODY:", request.body);

  const { content } = request.body;

  if (request.method === "POST" && (!content || content.length < 5)) {
    return response.status(400).json({
      error: "too short anecdote, must have length 5 or more",
    });
  } else {
    next();
  }
};

server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(validator);
server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running");
});
