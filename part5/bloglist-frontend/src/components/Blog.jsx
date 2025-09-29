import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogs.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const Blog = ({ loggedInUser }) => {
	const setNotification = useSetNotification();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const id = useParams().id;
	const {
		data: blogs,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["blogs"],
		queryFn: blogService.getAll,
		retry: 1,
	});

	if (isLoading) {
		return <div>loading user...</div>;
	}

	if (isError) {
		return <div>error loading blog details: {error.message}</div>;
	}

	const blog = blogs.find((blog) => blog.id === id);

	const errorRedirect = () => setTimeout(() => navigate("/"), 3000);

	const likeBlogMutation = useMutation({
		mutationFn: (blog) => blogService.update(blog.id, blog),
		onSuccess: (updatedBlog, variables) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.map((blog) =>
					blog.id === updatedBlog.id
						? { ...updatedBlog, user: variables.user }
						: blog
				)
			);
		},
		onError: (error, variables) => {
			console.error(error.response?.status);
			console.error(error.response?.data);
			if (error.response?.status === 404) {
				setNotification({
					type: "ERROR",
					payload: `The blog ${variables.title} has already been removed.`,
				});
				queryClient.invalidateQueries({ queryKey: ["blogs"] });
			} else {
				setNotification({
					type: "ERROR",
					payload: `Cannot be updated from the server: ${error.response?.data?.error}`,
				});
			}

			errorRedirect();
		},
	});

	const deleteBlogMutation = useMutation({
		mutationFn: (blog) => blogService.deleteBlog(blog.id),
		onSuccess: (_, variables) => {
			setNotification({
				type: "DELETE",
				payload: variables.title,
			});
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.filter((blog) => blog.id !== variables.id)
			);

			navigate("/");
		},
		onError: (error, variables) => {
			console.error(error.response?.status);
			console.error(error.response?.data);
			if (error.response?.status === 404) {
				setNotification({
					type: "ERROR",
					payload: `The blog ${variables.title} has already been removed.`,
				});
				// const blogs = queryClient.getQueryData(["blogs"]);
				// queryClient.setQueryData(
				// 	["blogs"],
				// 	blogs.filter((blog) => blog.id !== deletedBlog.id)
				// );
				queryClient.invalidateQueries({ queryKey: ["blogs"] });
			} else {
				setNotification({
					type: "ERROR",
					payload: `Cannot be deleted from the server: ${error.response?.data?.error}`,
				});
			}

			errorRedirect();
		},
	});

	const likeFunction = () =>
		likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
	const deleteFunction = () => {
		if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
			deleteBlogMutation.mutate(blog);
		}
	};

	return (
		<div>
			<h2>{blog.title}</h2>
			<div>author: {blog.author}</div>
			<div>
				<div>{blog.url}</div>
				<div className="blog-likes">
					{blog.likes} likes <button onClick={likeFunction}>like</button>
				</div>
				<div>added by {blog.user.name || "unknown user"}</div>
				{loggedInUser && loggedInUser.id === blog.user?.id && (
					<div>
						<button onClick={deleteFunction}>remove</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Blog;
