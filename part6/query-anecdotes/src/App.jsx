import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useContext } from "react";
import { getAnecdotes, voteFor } from "./requests.js";
import AnecdoteForm from "./components/AnecdoteForm.jsx";
import Notification from "./components/Notification.jsx";
import AnecdoteContext from "./AnecdoteContext.jsx";

const App = () => {
  // const [notification, setNotification] = useState("");
  const [notification, notificationDispatch] = useContext(AnecdoteContext);
  // Need to use useRef. Because if notificationTimeoutId is just an ordinary variable,
  // every time the App component renders, the notificationTimeoutId variable is recreated, thus losing the previous info.
  const notificationTimeoutId = useRef(null);

  const queryClient = useQueryClient();

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteFor,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      );
    },
  });

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server:{" "}
        {result.error.message}
      </div>
    );
  }

  const anecdotes = result.data;

  // handlers
  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const voteNotificationHandler = (msg, time = 5000) => {
    clearTimeout(notificationTimeoutId.current);

    notificationDispatch({
      type: "VOTE",
      payload: msg,
    });

    notificationTimeoutId.current = setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, time);
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification msg={notification} />
      <AnecdoteForm timeoutId={notificationTimeoutId} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                handleVote(anecdote);
                voteNotificationHandler(anecdote.content);
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
