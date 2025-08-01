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

  /** Helper functions */
  const showNotification = (msg, timeout = 3000) => {
    setNotiMessage(msg);
    setTimeout(() => setNotiMessage(null), timeout);
  };

  /** useEffect */
  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => {
        showNotification("Loaded initial data successfully!");
        setPersons(initialPersons);
      })
      .catch((error) => {
        showNotification(error.message);
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

    if (existingPerson) {
      // If there already exists the same name and the same number, do not proceed further.
      const isSameNumber =
        existingPerson.id &&
        existingPerson.number &&
        existingPerson.number === trimmedNewNumber;
      if (isSameNumber) {
        showNotification(
          `The entry ${trimmedNewName} ${trimmedNewNumber} is already added to phonebook`
        );
        return;
      }

      // If the same name already exists, but a different number, if confirmed, edit the existing entry.
      const canUpdate =
        existingPerson.id &&
        existingPerson.name &&
        confirm(
          `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
        );

      if (canUpdate) {
        editExistingPerson(existingPerson, trimmedNewNumber);
        return;
      } else {
        return;
      }
    }

    // if no name or number is entered, the new entry should be denied.
    if (trimmedNewName.length === 0 || trimmedNewNumber.length === 0) {
      showNotification("Both the name and the number need to be entered.");
      return;
    }

    const newPersonObject = {
      name: trimmedNewName,
      number: trimmedNewNumber,
    };

    phonebookService
      .create(newPersonObject)
      .then((createdPerson) => {
        showNotification(`Added ${createdPerson.name}!`);
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        showNotification(error.response.data.error);
        setNewName("");
        setNewNumber("");
      });
  };

  const deleteHandler = (evt) => {
    const id = evt.target.closest("li").getAttribute("id");
    const name = persons.find((person) => person.id === id).name;
    if (id === null || name === undefined) {
      showNotification(
        "Cannot delete the entry because it is not in the database."
      );
      return;
    }

    if (!confirm(`Delete ${name} ?`)) {
      return;
    } else {
      phonebookService
        .deleteId(id)
        .then(() => {
          showNotification(`Deleted ${name}!`);
          const newPersons = persons.filter((person) => person.id !== id);
          setPersons(newPersons);
        })
        .catch((error) => {
          showNotification(error.message);
        });
    }
  };

  // If the newly put entry's name is already existing in the phonebook but the number is not
  // , copy the existing number and id into a new entry.
  const editExistingPerson = (existingPerson, newNumberToEnter) => {
    if (!newNumberToEnter.length) {
      showNotification(
        "The new number to update is empty. Please enter the number again."
      );
      return;
    }
    const newPerson = { ...existingPerson, number: newNumberToEnter };
    phonebookService
      .update(newPerson.id, newPerson)
      .then((updatedPerson) => {
        showNotification(`Updated ${updatedPerson.name}'s number!`);
        setPersons(
          persons.map((person) =>
            person.id === newPerson.id ? updatedPerson : person
          )
        );
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        showNotification(error.response.data.error);
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
