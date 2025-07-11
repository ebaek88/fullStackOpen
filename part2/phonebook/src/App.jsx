import { useState } from "react";
import Filter from "./components/Filter.jsx";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  /** States */
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");

  /** Event handlers */
  const addNew = (evt) => {
    evt.preventDefault();
    const trimmedNewName = newName.trim();
    const trimmedNewNumber = newNumber.trim();
    // Checks if the newly put entry already exists in the phonebook.
    // If so, an alert message pops up.
    if (
      persons.some(
        (person) =>
          person.name === trimmedNewName && person.number === trimmedNewNumber
      )
    ) {
      alert(
        `The entry ${trimmedNewName} ${trimmedNewNumber} is already added to phonebook`
      );
      return;
    }

    const personObject = {
      name: trimmedNewName,
      number: trimmedNewNumber,
    };
    let newPersons = [...persons];

    // If the newly put entry's name is already existing in the phonebook but the number is not
    // , copy the existing number and id into a new entry.
    if (persons.some((person) => person.name === trimmedNewName)) {
      personObject.id = persons.find(
        (person) => person.name === trimmedNewName
      ).id;
      newPersons.splice(
        newPersons.findIndex((person) => person.name === trimmedNewName),
        1,
        personObject
      );
    } else {
      // If the entry is a brand new one, create a new entry.
      personObject.id = persons.length + 1;
      newPersons = newPersons.concat(personObject);
    }

    // console.log("Current persons: ", persons);
    // console.log("New persons: ", newPersons);
    setPersons(newPersons);
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (evt) => {
    // console.log(evt.target.value);
    setNewName(evt.target.value);
  };

  const handleNumberChange = (evt) => {
    // console.log(evt.target.value);
    setNewNumber(evt.target.value);
  };

  const handleFilterTextChange = (evt) => {
    // console.log(evt.target.value);
    setFilterText(evt.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} onChange={handleFilterTextChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onSubmit={addNew}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterText={filterText} />
    </div>
  );
};

export default App;
