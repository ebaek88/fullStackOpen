const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const Person = require("./models/person.js");
const middleware = require("./utils/middleware.js");
const personsRouter = require("./controllers/persons.js");

const app = express();

logger.info("connecting to ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB: ", error.message);
  });

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (request) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${persons.length} ${
          persons.length > 1 ? "people" : "person"
        }</p>
        <p>${Date(response.get("Date"))}</p>`
      ); // The "Date" of the response header is a Date object.
      // Therefore, it needs to be converted into a string.
    })
    .catch((error) => next(error));
});

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
