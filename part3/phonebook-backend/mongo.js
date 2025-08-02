const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.yjvbxla.mongodb.net/phonebookDB?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url).catch((err) => {
  console.log("Connection error: ", err.message);
  mongoose.connection.close();
  return;
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then(() => {
      console.log(`added ${name} ${number} to phonebook`);
    })
    .catch((err) => console.log(err.message))
    .finally(() => mongoose.connection.close());
};

const retrievePeople = () => {
  Person.find({})
    .then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    })
    .catch((err) => console.log(err.message))
    .finally(() => mongoose.connection.close());
};

// If there are no arguments for Person fields, just retrieve all entries in the DB.
process.argv[3] && process.argv[4]
  ? addPerson(process.argv[3], process.argv[4])
  : retrievePeople();
