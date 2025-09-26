import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const NewBlog = ({ user, ref }) => {
	const dispatch = useDispatch();
	const setNotification = useSetNotification();

	const addBlog = async (evt) => {
		evt.preventDefault();
		const title = evt.target.title.value;
		const author = evt.target.author.value;
		const url = evt.target.url.value;
		evt.target.title.value = "";
		evt.target.author.value = "";
		evt.target.url.value = "";

		ref.current.toggleVisibility();
		const newBlog = { title, author, url };

		try {
			await dispatch(createBlog(newBlog));
			setNotification({
				type: "CREATE",
				payload: { title, author },
			});
		} catch (err) {
			console.error(err.response.status);
			console.error(err.response.data);
			setNotification({
				type: "ERROR",
				payload: `Blog cannot be added to the server: ${err.response.data.error}`,
			});
		}
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={addBlog}>
				<div>
					<label>
						title:
						<input type="text" name="title" />
					</label>
				</div>
				<div>
					<label>
						author:
						<input type="text" name="author" />
					</label>
				</div>
				<div>
					<label>
						url:
						<input type="text" name="url" />
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default NewBlog;
