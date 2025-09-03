import { useSelector, useDispatch } from "react-redux";
import {
  voteFor,
  sortByVotesAsc,
  sortByVotesDesc,
} from "./reducers/anecdoteReducer.js";
import AnecdoteForm from "./components/AnecdoteForm.jsx";

const App = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();

  const vote = (id) => {
    console.log("vote", id);
    dispatch(voteFor(id));
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
      <AnecdoteForm />
    </div>
  );
};

export default App;
