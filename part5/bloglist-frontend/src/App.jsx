import { useEffect, useRef, useContext } from "react";
import { Routes, Route, Link, useMatch, Navigate } from "react-router-dom";
import blogService from "./services/blogs.js";
import {
	useNotificationValue,
	useSetNotification,
} from "./contexts/NotificationContext.jsx";
import UserContext from "./contexts/UserContext.jsx";
// import Home from "./components/Home.jsx";
import Notification from "./components/Notification.jsx";
import Login from "./components/Login.jsx";
import Togglable from "./components/Togglable.jsx";
import NewBlog from "./components/NewBlog.jsx";
import Blogs from "./components/Blogs.jsx";
import Users from "./components/Users.jsx";
import User from "./components/User.jsx";

// The error object structure is specific to Axios
const App = () => {
	const [user, userDispatch] = useContext(UserContext);

	const notificationValue = useNotificationValue();
	const setNotification = useSetNotification();

	const padding = { padding: 5 };

	// For useEffect, callbacks need to be synchronous in order to prevent race condition.
	// In order to use async functions as callbacks, wrap them around synch ones.
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			userDispatch({
				type: "LOGIN",
				payload: user,
			});
			blogService.setToken(user.token);
		}
	}, []);

	// Reference to the Togglable component that contains the NewBlog component.
	const newBlogRef = useRef();

	// Logout handler
	const handleLogout = () => {
		window.localStorage.clear();
		userDispatch({ type: "LOGOUT" });
		setNotification({ type: "LOGOUT" });
	};

	// render components
	return (
		<>
			<Notification msg={notificationValue} />
			{user && (
				<>
					<h2>blogs</h2>
					<p>
						{user.name} logged in <button onClick={handleLogout}>logout</button>
					</p>
					<Togglable buttonLabel={"create new blog"} ref={newBlogRef}>
						<NewBlog user={user} ref={newBlogRef} />
					</Togglable>
				</>
			)}
			<Routes>
				<Route path="/users/:id" element={<User />} />
				<Route path="/users" element={<Users />} />
				<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
				<Route path="/" element={user ? <Blogs user={user} /> : <Login />} />
			</Routes>
		</>
	);
};

export default App;
