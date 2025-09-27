import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs.js";
import loginService from "../services/login.js";
import { setNotification } from "./notificationReducerRedux.js";

const userSlice = createSlice({
	name: "user",
	initialState: null,
	reducers: {
		setUser(state, action) {
			return action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

// action creators
export const handleLogin = (loginUser) => {
	return async (dispatch) => {
		try {
			const user = await loginService.login(loginUser);
			if (!user) return;
			window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
			blogService.setToken(user.token);
			dispatch(setUser(user));
			dispatch(setNotification(`Welcome ${user.username}!`));
		} catch (err) {
			console.error(err.response.status);
			console.error(err.response.data);
			console.error(err);
			// throw err;
			dispatch(
				setNotification(`wrong credentials: ${err.response.data.error}`)
			);
		}
	};
};

export default userSlice.reducer;
