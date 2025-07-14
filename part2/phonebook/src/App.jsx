import { useState, useEffect } from "react";
import phonebookService from "./services/api.js";
import Filter from "./components/Filter.jsx";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";

const App = () => {
  /** States */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");

  /** useEffect */
  useEffect(() => {
    phonebookService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

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
    } else {
      // if the same name exists but the number is new, direct to editExistingPerson()
      if (persons.some((person) => person.name === trimmedNewName)) {
        // editExistingPerson(trimmedNewName);
        return;
      }
    }

    const maxId =
      persons.length > 0
        ? Math.max(...persons.map((person) => Number(person.id)))
        : 0;
    const newPersonObject = {
      name: trimmedNewName,
      number: trimmedNewNumber,
      id: String(maxId + 1),
    };

    phonebookService.create(newPersonObject).then((res) => {
      console.log(res);
      setPersons(persons.concat(res.data));
      setNewName("");
      setNewNumber("");
    });
  };

  // const editExistingPerson = (name) => {
  //   // If the newly put entry's name is already existing in the phonebook but the number is not
  //   // , copy the existing number and id into a new entry.
  //   if (persons.some((person) => person.name === trimmedNewName)) {
  //     personObject.id = persons.find(
  //       (person) => person.name === trimmedNewName
  //     ).id;
  //     newPersons.splice(
  //       newPersons.findIndex((person) => person.name === trimmedNewName),
  //       1,
  //       personObject
  //     );
  //   }
  // };

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
