import { useState } from "react";

const SearchBar = ({ filterText, onChange }) => {
  return (
    <div>
      <label htmlFor="searchbar">filter shown with</label>
      <input
        type="text"
        value={filterText}
        onChange={onChange}
        id="searchbar"
      />
    </div>
  );
};

const DisplayLine = ({ name, number }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {name} {number}
    </li>
  );
};

const Display = ({ persons, filterText }) => {
  const displayLines = [];
  persons.forEach((person) => {
    if (
      person.name.indexOf(filterText) === -1 &&
      person.number.indexOf(filterText) === -1
    ) {
      return;
    }
    displayLines.push(
      <DisplayLine key={person.id} name={person.name} number={person.number} />
    );
  });
  // console.log(displayLines);
  return <ul style={{ padding: "0px" }}>{displayLines}</ul>;
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
          name: <input id="name" value={newName} onChange={onNameChange} />
        </div>
        <div>
          number:{" "}
          <input id="number" value={newNumber} onChange={onNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");

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
      <SearchBar filterText={filterText} onChange={handleFilterTextChange} />
      <h2>add a new</h2>
      <AddNew
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onSubmit={addNew}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Display persons={persons} filterText={filterText} />
    </div>
  );
};

export default App;
