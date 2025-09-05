import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer.js";
import {
  setNotification,
  removeNotification,
} from "../reducers/notificationReducer.js";
import anecdoteService from "../services/anecdotes.js";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (evt) => {
    evt.preventDefault();
    const content = evt.target.anecdote.value;
    evt.target.anecdote.value = "";
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(createAnecdote(newAnecdote));
    dispatch(setNotification(`you created '${content}'`));
    setTimeout(() => dispatch(removeNotification()), 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
