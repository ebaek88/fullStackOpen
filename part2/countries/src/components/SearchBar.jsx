const SearchBar = ({ onChange }) => {
  return (
    <div>
      find countries <input type="text" onChange={onChange} />
    </div>
  );
};

export default SearchBar;
