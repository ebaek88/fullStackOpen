const DisplayLine = ({ name, number }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {name} {number}
    </li>
  );
};

const Persons = ({ persons, filterText }) => {
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

export default Persons;
