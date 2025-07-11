const PersonForm = (props) => {
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

export default PersonForm;
