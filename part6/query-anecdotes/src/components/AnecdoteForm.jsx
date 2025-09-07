import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests.js";

const AnecdoteForm = ({ notificationHandler }) => {
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      notificationHandler(`Successfull added ${newAnecdote.content}`);
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      // queryClient.invalidateQueries(["anecdotes"]);
    },
    onError: (error) => {
      console.log(error.response.data);
      notificationHandler(error.response?.data?.error || "An error occurred");
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
