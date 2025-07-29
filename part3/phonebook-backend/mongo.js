const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.yjvbxla.mongodb.net/phonebookDB?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

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
    .then((result) => {
      console.log(`added ${name} ${number} to phonebook`);
    })
    .catch((err) => console.log(err.message))
    .finally(() => mongoose.connection.close());
};

addPerson(process.argv[3], process.argv[4]);
