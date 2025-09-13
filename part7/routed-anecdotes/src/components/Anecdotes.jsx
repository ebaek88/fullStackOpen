import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Anecdote = ({ anecdote }) => {
  const navigate = useNavigate();
  // Redirects to the homepage after 3 seconds
  useEffect(() => {
    !anecdote && setTimeout(() => navigate("/"), 3000);
  }, []);
  return (
    <>
      {anecdote ? (
        <div>
          <h2>{anecdote.content}</h2>
          <div>{anecdote.author}</div>
          <a href={anecdote.info} target="_blank" rel="noreferrer">
            {anecdote.info}
          </a>
          <div>
            votes: <strong>{anecdote.votes}</strong>
          </div>
        </div>
      ) : (
        <h2>anecdote not found 🤔</h2>
      )}
    </>
  );
};

export { Anecdote, AnecdoteList };
