import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs.js";
import { setNotification } from "./notificationReducer.js";

const blogSlice = createSlice({
	name: "blog",
	initialState: [],
	reducers: {
		appendBlog(state, action) {
			return [...state, action.payload];
		},
		setBlogs(state, action) {
			return action.payload;
		},
	},
});

export const { appendBlog, setBlogs } = blogSlice.actions;

// action creators
export const initializeBlogs = () => {
	return async (dispatch) => {
		const initialBlogs = await blogService.getAll();
		dispatch(setBlogs(initialBlogs));
	};
};

export const createBlog = (newBlogObject) => {
	return async (dispatch) => {
		try {
			const returnedBlog = await blogService.create(newBlogObject);
			// we need user information so that we can attach the user info to the returned blog
			dispatch(appendBlog(returnedBlog));
			dispatch(
				setNotification(
					`A new blog ${returnedBlog.title} by ${returnedBlog.author} added successfully!`
				)
			);
		} catch (err) {
			console.error(err.response.status);
			console.error(err.response.data);
			dispatch(
				setNotification(
					`Blog cannot be added to the server: ${err.response.data.error}`
				)
			);
		}
	};
};

export default blogSlice.reducer;
