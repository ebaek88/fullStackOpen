import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests.js";
import { useNotificationDispatch } from "../AnecdoteContext.jsx";

const AnecdoteForm = ({ timeoutId }) => {
  const notificationDispatch = useNotificationDispatch();
  const createNotificationHandler = (msg, time = 5000) => {
    clearTimeout(timeoutId.current);

    if (msg?.toLowerCase().includes("too short")) {
      notificationDispatch({
        type: "ERROR",
        payload: msg,
      });
    } else {
      notificationDispatch({
        type: "CREATE",
        payload: msg,
      });
    }

    timeoutId.current = setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, time);
  };

  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      createNotificationHandler(newAnecdote.content);
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      // queryClient.invalidateQueries(["anecdotes"]);
    },
    onError: (error) => {
      console.log(error.response.data);
      createNotificationHandler(
        error.response?.data?.error || "An error occurred"
      );
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
