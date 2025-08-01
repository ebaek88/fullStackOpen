require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
// const cors = require("cors");
const Person = require("./models/person.js");

const app = express();
app.use(express.json());
// app.use(cors({ origin: "*" }));
app.use(express.static("dist"));

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Initial data
// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// Helper function
// const generateId = () => {
//   const randomNum = Math.floor(Math.random() * 100000000 + 1);
//   return randomNum.toString();
// };

// REST routers
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

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

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        response
          .status(404)
          .json({ error: "The person requested CANNOT be retrieved." });
      } else {
        response.json(person);
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!(body.name && body.number)) {
    return response.status(400).json({ error: "content missing" });
  }

  // For now, editing an existing person is not functional.
  // I will refactor it so that PUT request is functional in the near future.
  Person.find({})
    .then((persons) => {
      // If there exists the same name and the same number, do not proceed further and return status 400.
      if (
        persons.some(
          (person) => person.name === body.name && person.number === body.number
        )
      ) {
        return response.status(400).json({ error: "entry must be unique" });
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      });

      return person.save();
    })
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save();
    })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Error-handling middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint " });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
