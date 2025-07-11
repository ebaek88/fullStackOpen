import { useState } from "react";

const DisplayLine = ({ name, number }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {name} {number}
    </li>
  );
};

const Display = ({ persons }) => {
  return (
    <ul style={{ padding: "0px" }}>
      {persons.map((person) => (
        <DisplayLine
          key={person.name}
          name={person.name}
          number={person.number}
        />
      ))}
    </ul>
  );
};

const AddNew = (props) => {
  const newName = props.newName;
  const newNumber = props.newNumber;
  const onSubmit = props.onSubmit;
  const onNameChange = props.onNameChange;
  const onNumberChange = props.onNumberChange;

  return (
    <>
      <form name="new-entry" onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={onNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

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
    if (persons.some((person) => person.name === trimmedNewName)) {
      newPersons.splice(
        newPersons.findIndex((person) => person.name === trimmedNewName),
        1,
        personObject
      );
    } else {
      // If the entry is a brand new one
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

  return (
    <div>
      <h2>Phonebook</h2>
      <AddNew
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onSubmit={addNew}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Display persons={persons} />
    </div>
  );
};

export default App;
