import { useState } from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Menu from "./components/Menu.jsx";
import { Anecdote, AnecdoteList } from "./components/Anecdotes.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
import CreateNew from "./components/CreateNew.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  // states
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");

  // helper
  const match = useMatch("/anecdotes/:id");
  const anecdote = match
    ? anecdotes.find((anecdote) => anecdote.id === Number(match.params.id))
    : null;

  // handlers
  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  const notificationHandler = (msg, duration = 5000) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, duration);
  };

  // rendering
  return (
    <div>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification msg={notification} />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route
            path="/anecdotes/:id"
            element={<Anecdote anecdote={anecdote} />}
          />
          <Route
            path="/create"
            element={
              <CreateNew
                addNew={addNew}
                notificationHandler={notificationHandler}
              />
            }
          />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
