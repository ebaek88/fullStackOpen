import { useSelector, useDispatch } from "react-redux";
import {
  voteFor,
  createAnecdote,
  sortByVotesAsc,
  sortByVotesDesc,
} from "./reducers/anecdoteReducer.js";

const App = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();

  const vote = (id) => {
    console.log("vote", id);
    dispatch(voteFor(id));
  };

  const addAnecdote = (evt) => {
    evt.preventDefault();
    const content = evt.target.anecdote.value;
    evt.target.anecdote.value = "";
    dispatch(createAnecdote(content));
  };

  const sortAscending = () => dispatch(sortByVotesAsc());
  const sortDescending = () => dispatch(sortByVotesDesc());

  return (
    <div>
      <h2>Anecdotes</h2>
      <div>
        <button onClick={sortDescending}>sort by votes(descending)</button>
        <button onClick={sortAscending}>sort by votes(ascending)</button>
      </div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default App;
