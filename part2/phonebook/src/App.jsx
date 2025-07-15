import { useState, useEffect } from "react";
import phonebookService from "./services/api.js";
import Filter from "./components/Filter.jsx";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  /** States */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [notiMessage, setNotiMessage] = useState(null);

  /** useEffect */
  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => {
        setNotiMessage("Loaded initial data successfully!");
        setTimeout(() => {
          setNotiMessage(null);
        }, 1000);
        setPersons(initialPersons);
      })
      .catch((error) => {
        setNotiMessage(error.message);
        setTimeout(() => {
          setNotiMessage(null);
        }, 3000);
      });
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
        setNotiMessage(
          `The entry ${trimmedNewName} ${trimmedNewNumber} is already added to phonebook`
        );
        setTimeout(() => {
          setNotiMessage(null);
        }, 3000);
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
      setNotiMessage("Both the name and the number need to be entered.");
      setTimeout(() => {
        setNotiMessage(null);
      }, 3000);
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
        setNotiMessage(`Added ${returnedPerson.name}!`);
        setTimeout(() => {
          setNotiMessage(null);
        }, 3000);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setNotiMessage(error.message);
        setTimeout(() => {
          setNotiMessage(null);
        }, 3000);
        setNewName("");
        setNewNumber("");
      });
  };

  const deleteHandler = (evt) => {
    const id = evt.target.closest("li").getAttribute("id");
    const name = persons.find((person) => person.id === id).name;
    if (id === null || name === undefined) {
      setNotiMessage(
        "Cannot delete the entry because it is not in the database."
      );
      setTimeout(() => {
        setNotiMessage(null);
      }, 3000);
      return;
    }

    if (!confirm(`Delete ${name} ?`)) {
      return;
    } else {
      phonebookService
        .deleteId(id)
        .then((deletedPerson) => {
          setNotiMessage(`Deleted ${deletedPerson.name}!`);
          setTimeout(() => {
            setNotiMessage(null);
          }, 3000);
          const newPersons = persons.filter(
            (person) => person.id !== deletedPerson.id
          );
          setPersons(newPersons);
        })
        .catch((error) => {
          setNotiMessage(error.message);
          setTimeout(() => {
            setNotiMessage(null);
          }, 3000);
        });
    }
  };

  // If the newly put entry's name is already existing in the phonebook but the number is not
  // , copy the existing number and id into a new entry.
  const editExistingPerson = (existingPerson, newNumberToEnter) => {
    if (newNumberToEnter.length === 0) {
      setNotiMessage(
        "The new number to update is empty. Please enter the number again."
      );
      setTimeout(() => {
        setNotiMessage(null);
      }, 3000);
      return;
    }
    const newPerson = { ...existingPerson, number: newNumberToEnter };
    phonebookService
      .update(newPerson.id, newPerson)
      .then((updatedPerson) => {
        setNotiMessage(`Updated ${updatedPerson.name}'s number!`);
        setTimeout(() => {
          setNotiMessage(null);
        }, 3000);
        setPersons(
          persons.map((person) =>
            person.id === newPerson.id ? updatedPerson : person
          )
        );
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.log(error.message);
        setNotiMessage(
          `Information of ${newPerson.name} has already been removed from server`
        );
        setTimeout(() => {
          setNotiMessage(null);
        }, 3000);
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
      <Notification message={notiMessage} />
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
