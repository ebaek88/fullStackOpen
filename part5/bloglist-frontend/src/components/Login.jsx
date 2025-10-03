import { useNavigate } from "react-router-dom";
import { useUserDispatch } from "../contexts/UserContext.jsx";
import blogService from "../services/blogs.js";
import loginService from "../services/login.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const Login = () => {
	const dispatch = useUserDispatch();
	const setNotification = useSetNotification();
	const navigate = useNavigate();

	const tryLogin = async (evt) => {
		evt.preventDefault();
		const username = evt.target.username.value;
		const password = evt.target.password.value;
		evt.target.username.value = "";
		evt.target.password.value = "";

		const loginUser = { username, password };
		try {
			const loginData = await loginService.login(loginUser);
			window.localStorage.setItem(
				"loggedBloglistUser",
				JSON.stringify(loginData)
			);
			blogService.setToken(loginData.token);
			dispatch({
				type: "LOGIN",
				payload: { ...loginData },
			});
			setNotification({
				type: "LOGIN",
				payload: loginData.username,
			});

			navigate("/");
		} catch (err) {
			console.error(err.response?.status);
			console.error(err.response?.data);
			setNotification({
				type: "ERROR",
				payload: `wrong credentials: ${err.response?.data?.error}`,
			});
		}
	};

	return (
		<div>
			<h2 className="mt-2 mb-2">log in to application</h2>
			<form onSubmit={tryLogin}>
				<div>
					<label>
						username &nbsp;
						<input
							type="text"
							name="username"
							className="border-2 rounded-lg mb-2 px-1"
						/>
					</label>
				</div>
				<div>
					<label>
						password &nbsp;
						<input
							type="password"
							name="password"
							className="border-2 rounded-lg ml-0.75 mb-2 px-1"
						/>
					</label>
				</div>
				<button
					type="submit"
					className="bg-gray-300 px-2.5 py-1 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
				>
					login
				</button>
			</form>
		</div>
	);
};

export default Login;
