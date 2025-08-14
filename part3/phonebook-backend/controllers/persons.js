const personsRouter = require("express").Router();
const Person = require("../models/person.js");

personsRouter.get("/", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

personsRouter.get("/:id", (request, response, next) => {
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

personsRouter.post("/", (request, response, next) => {
  const body = request.body;

  if (!(body.name && body.number)) {
    return response.status(400).json({ error: "content missing" });
  }

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

      person.validateSync(); // validate the updated entry

      return person.save();
    })
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      person.validateSync(); // validate the updated entry

      return person.save();
    })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
