import { useState } from "react";

const Login = ({ tryLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (evt) => {
    evt.preventDefault();

    const loginUser = { username, password };
    tryLogin(loginUser);

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username &nbsp;
            <input
              type="text"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password &nbsp;
            <input
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
