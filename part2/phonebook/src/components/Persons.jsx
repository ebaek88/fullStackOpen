const DisplayLine = ({ id, name, number, deleteHandler }) => {
  return (
    <li id={id} style={{ listStyle: "none" }}>
      {name} {number} <button onClick={deleteHandler}>delete</button>
    </li>
  );
};

const Persons = ({ persons, filterText, deleteHandler }) => {
  const displayLines = [];
  persons.forEach((person) => {
    if (
      person.name.indexOf(filterText) === -1 &&
      person.number.indexOf(filterText) === -1
    ) {
      return;
    }
    displayLines.push(
      <DisplayLine
        key={person.id}
        name={person.name}
        number={person.number}
        deleteHandler={deleteHandler}
        id={person.id}
      />
    );
  });
  // console.log(displayLines);
  return <ul style={{ padding: "0px" }}>{displayLines}</ul>;
};

export default Persons;
