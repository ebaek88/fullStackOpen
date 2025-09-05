import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer.js";
import {
  setNotification,
  removeNotification,
} from "../reducers/notificationReducer.js";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = (evt) => {
    evt.preventDefault();
    const content = evt.target.anecdote.value;
    evt.target.anecdote.value = "";
    dispatch(createAnecdote(content));
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
