import { configureStore } from "@reduxjs/toolkit";

import blogReducer from "./blogReducer.js";
import notificationReducer from "./notificationReducerRedux.js";
import userReducer from "./userReducer.js";

const store = configureStore({
	reducer: {
		blogs: blogReducer,
		notification: notificationReducer,
		user: userReducer,
	},
});

export default store;
