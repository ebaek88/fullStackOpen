import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog.jsx";
import Login from "./components/Login.jsx";
import NewBlog from "./components/NewBlog.jsx";
import blogService from "./services/blogs.js";
import loginService from "./services/login.js";
import Notification from "./components/Notification.jsx";
import Togglable from "./components/Togglable.jsx";

// The error object structure is specific to Axios
const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState(null);

	// For useEffect, callbacks need to be synchronous in order to prevent race condition.
	// In order to use async functions as callbacks, wrap them around synch ones.
	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const initialBlogs = await blogService.getAll();
				setBlogs(initialBlogs);
			} catch (error) {
				console.error(error.response.status);
				console.error(error.response.data);
				showNotification(
					`Blogs cannot be fetched from the server: ${error.response.data.error}`
				);
			}
		};

		fetchBlogs();
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	// Reference to the Togglable component that contains the NewBlog component.
	const newBlogRef = useRef();

	// Helper function to render Notification component
	const showNotification = (msg, timeout = 3000) => {
		setMessage(msg);
		setTimeout(() => {
			setMessage(null);
		}, timeout);
	};

	// Handlers related to login and logout
	const handleLogin = async (loginUser) => {
		try {
			const user = await loginService.login(loginUser);
			if (!user) return; // when the login failed, user becomes undefined

			window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);

			showNotification(`Welcome ${user.username}!`);
		} catch (err) {
			console.error(err.response.status);
			console.error(err.response.data);
			showNotification(`wrong credentials: ${err.response.data.error}`);
		}
	};

	const handleLogout = () => {
		window.localStorage.clear();
		setUser(null);
		showNotification("Logged out successfully!");
	};

	// Handler related to adding a new blog
	const addBlog = async (blogObject) => {
		newBlogRef.current.toggleVisibility();
		try {
			const returnedBlog = await blogService.create(blogObject);
			// This is for retaining the user info in detail, since the server returns only the userId
			returnedBlog.user = { ...user };
			setBlogs(blogs.concat(returnedBlog));
			showNotification(
				`A new blog ${returnedBlog.title} by ${returnedBlog.author} added successfully!`
			);
		} catch (err) {
			console.error(err.response.status);
			console.error(err.response.data);
			showNotification(
				`Blog cannot be added to the server: ${err.response.data.error}`
			);
		}
	};

	// Handler related to increase a like by 1
	const increaseLike = async (id) => {
		const blogToUpdate = blogs.find((blog) => blog.id === id);
		const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

		try {
			const returnedBlog = await blogService.update(id, updatedBlog);
			// This is for retaining the user info in detail, since the server returns only the userId
			returnedBlog.user = { ...blogToUpdate.user };
			setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
		} catch (error) {
			console.error(error.response.status);
			console.error(error.response.data);
			if (error.response.status === 404) {
				showNotification(
					`The blog ${blogToUpdate.title} has already been removed.`
				);
				setBlogs(blogs.filter((blog) => blog.id !== id));
			} else {
				showNotification(
					`Cannot be updated from the server: ${error.response.data.error}`
				);
			}
		}
	};

	// Handlers for sorting blogs by likes
	const sortByLikeAscending = () => {
		const sortedBlogs = [...blogs].sort((a, b) => a.likes - b.likes);
		setBlogs(sortedBlogs);
	};

	const sortByLikeDescending = () => {
		const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
		setBlogs(sortedBlogs);
	};

	// Handler to delete a blog
	const deleteBlog = async (id) => {
		const blogToDelete = blogs.find((blog) => blog.id === id);
		if (!blogToDelete) return;

		try {
			if (
				window.confirm(
					`Removing blog ${blogToDelete.title} by ${blogToDelete.author}`
				)
			) {
				await blogService.deleteBlog(id);
				showNotification(`Deleted note ${blogToDelete.content} successfully!`);
				setBlogs(blogs.filter((blog) => blog.id !== id));
			}
		} catch (error) {
			if (error.response.status === 404) {
				showNotification(
					`The blog ${blogToDelete.content} has already been removed.`
				);
				setBlogs(blogs.filter((blog) => blog.id !== id));
			} else {
				showNotification(
					`Cannot be deleted from the server: ${error.response.data.error}`
				);
			}
		}
	};

	// render components
	return (
		<div>
			<Notification message={message} />
			{!user && <Login tryLogin={handleLogin} />}
			{user && (
				<>
					<p>
						{user.name} logged in <button onClick={handleLogout}>logout</button>
					</p>
					<Togglable buttonLabel={"create new blog"} ref={newBlogRef}>
						<NewBlog createBlog={addBlog} />
					</Togglable>
					<h2>blogs</h2>
					<div>
						<button onClick={sortByLikeDescending}>
							sort by like(descending order)
						</button>
						&nbsp;
						<button onClick={sortByLikeAscending}>
							sort by like(ascending order)
						</button>
					</div>
					{blogs.map((blog) => (
						<Blog
							key={blog.id}
							blog={blog}
							loggedInUser={user}
							likeFunction={() => increaseLike(blog.id)}
							deleteFunction={() => deleteBlog(blog.id)}
						/>
					))}
				</>
			)}
		</div>
	);
};

export default App;
