import { useSelector, useDispatch } from "react-redux";
import {
  voteFor,
  sortByVotesAsc,
  sortByVotesDesc,
} from "../reducers/anecdoteReducer.js";
import {
  setNotification,
  removeNotification,
} from "../reducers/notificationReducer.js";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    // console.log("vote", id);
    dispatch(voteFor(id));
  };

  const sortAscending = () => dispatch(sortByVotesAsc());
  const sortDescending = () => dispatch(sortByVotesDesc());

  return (
    <>
      <div>
        <button onClick={sortDescending}>sort by votes(descending)</button>
        <button onClick={sortAscending}>sort by votes(ascending)</button>
      </div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={(evt) => {
                vote(anecdote.id);
                const anecdoteText =
                  evt.target.parentElement.previousElementSibling.textContent;
                dispatch(setNotification(`you voted '${anecdoteText}'`));
                setTimeout(() => dispatch(removeNotification()), 5000);
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
