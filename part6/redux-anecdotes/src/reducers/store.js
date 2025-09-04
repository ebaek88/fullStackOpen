import { configureStore } from "@reduxjs/toolkit";

import anecdoteReducer from "./anecdoteReducer.js";
import filterReducer from "./filterReducer.js";

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
  },
});

export default store;
