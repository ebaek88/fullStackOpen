import { useState } from "react";

const DisplayName = ({ name }) => {
  return <li style={{ listStyle: "none" }}>{name}</li>;
};

const Display = ({ persons }) => {
  return (
    <ul style={{ padding: "0px" }}>
      {persons.map((person) => (
        <DisplayName key={person.name} name={person.name} />
      ))}
    </ul>
  );
};

const AddNewName = ({ value, onSubmit, onChange }) => {
  return (
    <>
      <form name="new-name" onSubmit={onSubmit}>
        <div>
          name: <input value={value} onChange={onChange} />
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

  const addName = (evt) => {
    evt.preventDefault();
    // Checks if the newly put name already exists in the phonebook.
    // If so, an alert message pops up.
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const personObject = {
      name: newName,
    };

    // console.log("event target: ", evt.target);
    setPersons(persons.concat(personObject));
    setNewName("");
  };

  const handleNameChange = (evt) => {
    // console.log(evt.target.value);
    setNewName(evt.target.value);
  };

  // console.log(persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <AddNewName
        value={newName}
        onChange={handleNameChange}
        onSubmit={addName}
      />
      <h2>Numbers</h2>
      <Display persons={persons} />
    </div>
  );
};

export default App;
