import { useDispatch } from "react-redux";
import { handleLogin } from "../reducers/userReducer.js";

const Login = () => {
	const dispatch = useDispatch();

	const tryLogin = (evt) => {
		evt.preventDefault();
		const username = evt.target.username.value;
		const password = evt.target.password.value;
		evt.target.username.value = "";
		evt.target.password.value = "";

		const loginUser = { username, password };
		dispatch(handleLogin(loginUser));
	};

	return (
		<div>
			<h2>log in to application</h2>
			<form onSubmit={tryLogin}>
				<div>
					<label>
						username &nbsp;
						<input type="text" name="username" />
					</label>
				</div>
				<div>
					<label>
						password &nbsp;
						<input type="password" name="password" />
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default Login;
