import Notification from "./Notification.jsx";
import Login from "./Login.jsx";
import Togglable from "./Togglable.jsx";
import NewBlog from "./NewBlog.jsx";
import Blogs from "./Blogs.jsx";

const Home = ({ user, msg, ref }) => {
	return (
		<div>
			<Notification msg={msg} />
			{!user && <Login />}
			{user && (
				<>
					<Togglable buttonLabel={"create new blog"} ref={ref}>
						<NewBlog user={user} ref={ref} />
					</Togglable>
					<Blogs user={user} />
				</>
			)}
		</div>
	);
};

export default Home;
