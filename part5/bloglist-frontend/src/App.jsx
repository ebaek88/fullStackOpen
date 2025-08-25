import { useState, useEffect } from "react";
import Blog from "./components/Blog.jsx";
import Login from "./components/Login.jsx";
import NewBlog from "./components/NewBlog.jsx";
import blogService from "./services/blogs.js";
import loginService from "./services/login.js";

// The error object structure is specific to Axios
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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
    } catch (err) {
      console.error(err.response.status);
      console.error(err.response.data);
      console.log("Error", err.message);
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
      console.log(`Added blog ${returnedBlog.title} successfully!`);
    } catch (err) {
      console.error(err.response.status);
      console.error(err.response.data);
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
