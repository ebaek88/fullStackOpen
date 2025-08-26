import { useState, useEffect } from "react";
import Blog from "./components/Blog.jsx";
import Login from "./components/Login.jsx";
import NewBlog from "./components/NewBlog.jsx";
import blogService from "./services/blogs.js";
import loginService from "./services/login.js";
import Notification from "./components/Notification.jsx";

// The error object structure is specific to Axios
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
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

  // Helper function to render Notification component
  const showNotification = (msg, timeout = 3000) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, timeout);
  };

  // Handlers related to login and logout
  const handleLogin = async (evt) => {
    evt.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      if (!user) return; // when the login failed, user becomes undefined

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`Welcome ${user.username}!`);
    } catch (err) {
      console.error(err.response.status);
      console.error(err.response.data);
      showNotification(`wrong credentials: ${err.response.data.error}`);
    }
  };

  const handleUsernameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    showNotification("Logged out successfully!");
  };

  // Handlers related to adding a new blog
  const addBlog = async (evt) => {
    evt.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      showNotification(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
      );
    } catch (err) {
      console.error(err.response.status);
      console.error(err.response.data);
      showNotification(
        `Blog cannot be added to the server: ${err.response.data.error}`
      );
    }
  };

  const handleTitleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const handleAuthorChange = (evt) => {
    setAuthor(evt.target.value);
  };

  const handleUrlChange = (evt) => {
    setUrl(evt.target.value);
  };

  return (
    <div>
      <Notification message={message} />
      {!user && (
        <Login
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
      )}
      {user && (
        <>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <NewBlog
            addBlog={addBlog}
            title={title}
            author={author}
            url={url}
            handleTitleChange={handleTitleChange}
            handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
          />
          <h2>blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
