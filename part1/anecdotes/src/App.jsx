import { useState } from "react";

const DisplayMostVote = ({ anecdote, vote }) => {
  return (
    <>
      <h1>Anecdote with most votes</h1>
      <div>{anecdote}</div>
      <VoteDisplay vote={vote} />
    </>
  );
};

const VoteDisplay = ({ vote }) => {
  return <div>has {vote} votes</div>;
};

const Button = ({ text, handler }) => {
  return (
    <>
      <button onClick={handler}>{text}</button>
    </>
  );
};

const DisplayAnecdote = ({ anecdote, handlers, vote }) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{anecdote}</div>
      <VoteDisplay vote={vote} />
      <div>
        <Button text={"vote"} handler={handlers.voteHandler} />
        <Button text={"next anecdote"} handler={handlers.randomHandler} />
      </div>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0); // state for a selected anecdote
  const [votes, setVotes] = useState(
    Array.from({ length: anecdotes.length }).fill(0)
  ); // state for an array of votes for the anecdotes

  const randomHandler = () =>
    setSelected(Math.floor(Math.random() * anecdotes.length));

  const voteHandler = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const handlers = {
    randomHandler: randomHandler,
    voteHandler: voteHandler,
  };

  // Find the anecdote with most votes
  const anecdotesSorted = [...anecdotes].sort((a, b) => {
    return votes[anecdotes.indexOf(b)] - votes[anecdotes.indexOf(a)];
  });
  const anecdoteWithMostVotes = anecdotesSorted[0];
  const mostVotes = votes[anecdotes.indexOf(anecdoteWithMostVotes)];

  return (
    <>
      <DisplayAnecdote
        anecdote={anecdotes[selected]}
        handlers={handlers}
        vote={votes[selected]}
      />
      <DisplayMostVote anecdote={anecdoteWithMostVotes} vote={mostVotes} />
    </>
  );
};

export default App;
