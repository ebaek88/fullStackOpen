import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import "./index.css";

import blogReducer from "./reducers/blogReducer.js";
import notificationReducer from "./reducers/notificationReducer.js";

const store = configureStore({
	reducer: {
		blogs: blogReducer,
		notification: notificationReducer,
	},
});
// console.log(store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>
);
