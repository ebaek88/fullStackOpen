import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs.js";
import { setNotification } from "./notificationReducerRedux.js";

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
	return async (dispatch, getState) => {
		try {
			const returnedBlog = await blogService.create(newBlogObject);
			// we need user information so that we can attach the user info to the returned blog
			returnedBlog.user = { ...getState().user }; // we can access the state by using getState
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
			// throw err;
		}
	};
};

export const deleteBlog = (id) => {
	return async (dispatch, getState) => {
		const currentState = getState().blogs; // we can access the state by using getState
		const blogToDelete = currentState.find((blog) => blog.id === id);
		if (!blogToDelete) return;

		try {
			if (
				window.confirm(
					`Removing blog ${blogToDelete.title} by ${blogToDelete.author}`
				)
			) {
				await blogService.deleteBlog(id);
				dispatch(
					setNotification(`Deleted note ${blogToDelete.content} successfully!`)
				);
				dispatch(setBlogs(currentState.filter((blog) => blog.id !== id)));
			}
		} catch (err) {
			if (error.response.status === 404) {
				dispatch(
					setNotification(
						`The blog ${blogToDelete.content} has already been removed.`
					)
				);
				dispatch(setBlogs(currentState.filter((blog) => blog.id !== id)));
			} else {
				dispatch(
					setNotification(
						`Cannot be deleted from the server: ${error.response.data.error}`
					)
				);
			}
			// throw err;
		}
	};
};

export const increaseLike = (id) => {
	return async (dispatch, getState) => {
		const currentState = getState().blogs;
		const blogToUpdate = currentState.find((blog) => blog.id === id);
		if (!blogToUpdate) return;
		const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

		try {
			const returnedBlog = await blogService.update(id, updatedBlog);
			// This is for retaining the user info in detail, since the server returns only the userId
			returnedBlog.user = { ...getState().user };
			dispatch(
				setBlogs(
					currentState.map((blog) => (blog.id === id ? returnedBlog : blog))
				)
			);
		} catch (err) {
			// console.error(error.response.status);
			// console.error(error.response.data);
			// if (error.response.status === 404) {
			// 	dispatch(
			// 		setNotification(
			// 			`The blog ${blogToUpdate.title} has already been removed.`
			// 		)
			// 	);
			// 	dispatch(setBlogs(blogs.filter((blog) => blog.id !== id)));
			// } else {
			// 	dispatch(
			// 		setNotification(
			// 			`Cannot be updated from the server: ${error.response.data.error}`
			// 		)
			// 	);
			// }
			throw err;
		}
	};
};

export default blogSlice.reducer;
