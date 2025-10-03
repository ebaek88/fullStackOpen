import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import blogService from "../services/blogs.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const NewBlog = ({ user, ref }) => {
	const setNotification = useSetNotification();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const errorRedirect = () => setTimeout(() => navigate("/"), 3000);

	const newBlogMutation = useMutation({
		mutationFn: blogService.create,
		onSuccess: (newBlog) => {
			const newBlogWithUserInfo = { ...newBlog, user };
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(["blogs"], blogs.concat(newBlogWithUserInfo));
			setNotification({
				type: "CREATE",
				payload: { title: newBlog.title, author: newBlog.author },
			});
		},
		onError: (err) => {
			console.error(err.response.status);
			console.error(err.response.data);
			setNotification({
				type: "ERROR",
				payload: `Blog cannot be added to the server: ${err.response.data.error}`,
			});
			errorRedirect();
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
			<h2 className="text-xl font-semibold">create new</h2>
			<form onSubmit={addBlog}>
				<div className="flex items-center mb-1.5">
					<label className="w-20 hover:cursor-pointer" htmlFor="title">
						title:
					</label>
					<input
						id="title"
						type="text"
						name="title"
						className="border-2 rounded-lg ml-2 pl-1 pr-1"
					/>
				</div>
				<div className="flex items-center mb-1.5">
					<label className="w-20 hover:cursor-pointer" htmlFor="author">
						author:
					</label>
					<input
						id="author"
						type="text"
						name="author"
						className="border-2 rounded-lg ml-2 pl-1 pr-1"
					/>
				</div>
				<div className="flex items-center mb-1.5">
					<label className="w-20 hover:cursor-pointer" htmlFor="url">
						url:
					</label>
					<input
						id="url"
						type="text"
						name="url"
						className="border-2 rounded-lg ml-2 pl-1 pr-1"
					/>
				</div>
				<div className="flex justify-end">
					<button
						type="submit"
						className="bg-gray-300 p-1 rounded-lg hover:text-white duration-400 cursor-pointer"
					>
						create
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewBlog;
