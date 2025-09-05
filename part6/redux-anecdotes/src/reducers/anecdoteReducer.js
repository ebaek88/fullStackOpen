import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes.js";

// Because json-server automatically creates id when requesting POST, you don't need getId function anymore.
// const getId = () => (100000 * Math.random()).toFixed(0);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      return [...state, action.payload];
    },
    voteFor(state, action) {
      const id = action.payload;
      return state.map((anecdote) => {
        if (anecdote.id === id) {
          return { ...anecdote, votes: anecdote.votes + 1 };
        } else {
          return anecdote;
        }
      });
    },
    sortByVotesDesc(state) {
      return [...state].sort((a, b) => b.votes - a.votes);
    },
    sortByVotesAsc(state) {
      return [...state].sort((a, b) => a.votes - b.votes);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const {
  createAnecdote,
  voteFor,
  sortByVotesDesc,
  sortByVotesAsc,
  setAnecdotes,
} = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export default anecdoteSlice.reducer;
