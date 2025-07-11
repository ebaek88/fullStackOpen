const Filter = ({ filterText, onChange }) => {
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

export default Filter;
