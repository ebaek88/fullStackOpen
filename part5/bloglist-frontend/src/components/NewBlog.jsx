// import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs.js";
// import { createBlog } from "../reducers/blogReducer.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const NewBlog = ({ user, ref }) => {
	// const dispatch = useDispatch();
	const setNotification = useSetNotification();
	const queryClient = useQueryClient();
	const newBlogMutation = useMutation({
		mutationFn: blogService.create,
		onSuccess: (newBlog) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
			setNotification({
				type: "CREATE",
				payload: { title: newBlog.title, author: newBlog.author },
			});
		},
	});

	const addBlog = async (evt) => {
		evt.preventDefault();
		const title = evt.target.title.value;
		const author = evt.target.author.value;
		const url = evt.target.url.value;
		evt.target.title.value = "";
		evt.target.author.value = "";
		evt.target.url.value = "";

		const newBlog = { title, author, url };
		newBlogMutation.mutate(newBlog);

		ref.current.toggleVisibility();
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
