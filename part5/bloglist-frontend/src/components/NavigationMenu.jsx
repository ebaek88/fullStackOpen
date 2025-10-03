import { Link } from "react-router-dom";

const NavigationMenu = ({ user, handleLogout }) => {
	const style = { padding: 5 };
	return (
		<div className="p-1.5 bg-gray-400">
			<span className="hover:text-white duration-400">
				<Link to="/" style={style}>
					blogs
				</Link>
			</span>
			<span className="hover:text-white duration-400">
				<Link to="/users" style={style}>
					users
				</Link>
			</span>
			{user && (
				<>
					<span className="text-green-800 italic">{user.name} logged in </span>
					<button
						onClick={handleLogout}
						className="bg-gray-300 ml-1.5 p-1 rounded-lg hover:text-sky-600 duration-400 cursor-pointer"
					>
						logout
					</button>
				</>
			)}
		</div>
	);
};

export default NavigationMenu;
