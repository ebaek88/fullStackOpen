import { Link } from "react-router-dom";

const NavigationMenu = ({ user, handleLogout }) => {
	const style = { padding: 5, backgroundColor: "lightgrey" };
	return (
		<>
			<Link to="/" style={style}>
				blogs
			</Link>
			<Link to="/users" style={style}>
				users
			</Link>
			{user && (
				<span style={style}>
					{user.name} logged in <button onClick={handleLogout}>logout</button>
				</span>
			)}
		</>
	);
};

export default NavigationMenu;
