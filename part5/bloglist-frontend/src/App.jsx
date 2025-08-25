import { useState, useEffect } from "react";
import Blog from "./components/Blog.jsx";
import Login from "./components/Login.jsx";
import blogService from "./services/blogs.js";
import loginService from "./services/login.js";

// The error object structure is specific to Axios
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (evt) => {
    evt.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      if (!user) return; // when the login failed, user becomes undefined
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error.response.status);
      console.error(error.response.data);
      console.log("Error", error.message);
    }
  };

  const handleUsernameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
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
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
