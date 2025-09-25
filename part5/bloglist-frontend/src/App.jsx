import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer.js";
import { setUser } from "./reducers/userReducer.js";
import { setNotification } from "./reducers/notificationReducer.js";
import Blogs from "./components/Blogs.jsx";
import Login from "./components/Login.jsx";
import NewBlog from "./components/NewBlog.jsx";
import blogService from "./services/blogs.js";
import Notification from "./components/Notification.jsx";
import Togglable from "./components/Togglable.jsx";

// The error object structure is specific to Axios
const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	// For useEffect, callbacks need to be synchronous in order to prevent race condition.
	// In order to use async functions as callbacks, wrap them around synch ones.
	useEffect(() => {
		dispatch(initializeBlogs());
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			dispatch(setUser(user));
			blogService.setToken(user.token);
		}
	}, []);

	// Reference to the Togglable component that contains the NewBlog component.
	const newBlogRef = useRef();

	// Logout handler
	const handleLogout = () => {
		window.localStorage.clear();
		dispatch(setUser(null));
		dispatch(setNotification("Logged out successfully!"));
	};

	// render components
	return (
		<div>
			<Notification />
			{!user && <Login />}
			{user && (
				<>
					<p>
						{user.name} logged in <button onClick={handleLogout}>logout</button>
					</p>
					<Togglable buttonLabel={"create new blog"} ref={newBlogRef}>
						<NewBlog user={user} ref={newBlogRef} />
					</Togglable>
					<h2>blogs</h2>
					<Blogs user={user} />
				</>
			)}
		</div>
	);
};

export default App;
