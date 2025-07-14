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
    phonebookService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => console.log(error.message));
  }, []);

  /** Event handlers */
  const addNew = (evt) => {
    evt.preventDefault();
    const trimmedNewName = newName.trim();
    const trimmedNewNumber = newNumber.trim();
    // Checks if the newly put entry already exists in the phonebook.
    // If so, an alert message pops up.
    const existingPerson = persons.find(
      (person) => person.name === trimmedNewName
    );
    // console.log(existingPerson);

    if (existingPerson) {
      if (
        existingPerson.id &&
        existingPerson.number &&
        existingPerson.number === trimmedNewNumber
      ) {
        alert(
          `The entry ${trimmedNewName} ${trimmedNewNumber} is already added to phonebook`
        );
        return;
      } else if (existingPerson.id && existingPerson.name) {
        if (
          confirm(
            `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          editExistingPerson(existingPerson, trimmedNewNumber);
          return;
        }
      }
    }

    // if no name or number is entered, the new entry should be denied
    if (trimmedNewName.length === 0 || trimmedNewNumber.length === 0) {
      alert("Both the name and the number need to be entered.");
      return;
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

    phonebookService
      .create(newPersonObject)
      .then((returnedPerson) => {
        // console.log(returnedPerson);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        alert(error.message);
        setNewName("");
        setNewNumber("");
      });
  };

  const deleteHandler = (evt) => {
    const id = evt.target.closest("li").getAttribute("id");
    const name = persons.find((person) => person.id === id).name;
    if (id === null || name === undefined) {
      alert("Cannot delete the entry because it is not in the database.");
      return;
    }

    if (!confirm(`Delete ${name} ?`)) {
      return;
    } else {
      phonebookService
        .deleteId(id)
        .then((deletedPerson) => {
          // console.log(deletedPerson);
          const newPersons = persons.filter(
            (person) => person.id !== deletedPerson.id
          );
          setPersons(newPersons);
        })
        .catch((error) => alert(error.message));
    }
  };

  // If the newly put entry's name is already existing in the phonebook but the number is not
  // , copy the existing number and id into a new entry.
  const editExistingPerson = (existingPerson, newNumberToEnter) => {
    if (newNumberToEnter.length === 0) {
      alert(
        "The new number to update is empty. Please enter the number again."
      );
      return;
    }
    const newPerson = { ...existingPerson, number: newNumberToEnter };
    phonebookService
      .update(newPerson.id, newPerson)
      .then((updatedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id === newPerson.id ? updatedPerson : person
          )
        );
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        alert(error.message);
        setNewName("");
        setNewNumber("");
      });
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
      <Persons
        persons={persons}
        filterText={filterText}
        deleteHandler={deleteHandler}
      />
    </div>
  );
};

export default App;
