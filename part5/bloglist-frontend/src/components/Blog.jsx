import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogs.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const Blog = ({ loggedInUser }) => {
	const setNotification = useSetNotification();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// fetching the blog
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

	// handlers
	const errorRedirect = () => setTimeout(() => navigate("/"), 3000);

	const likeBlogMutation = useMutation({
		mutationFn: (blog) => blogService.update(blog.id, { likes: blog.likes }),
		onSuccess: (updatedBlog) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				// need to put {...blog, likes: updatedBlog.likes} instead of the entire updatedBlog. Otherwise, the existing comments will be deleted.
				blogs.map((blog) =>
					blog.id === updatedBlog.id
						? {
								...blog,
								likes: updatedBlog.likes,
							}
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

	const addCommentMutation = useMutation({
		mutationFn: (newComment) => blogService.addComment(id, newComment),
		onSuccess: (updatedBlog, variables) => {
			// console.log(updatedBlog);
			setNotification({
				type: "COMMENT",
				payload: { title: updatedBlog.title, comment: variables.content },
			});
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.map((blog) =>
					blog.id === updatedBlog.id
						? { ...blog, comments: updatedBlog.comments }
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
					payload: `The blog has already been removed.`,
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
					payload: `Cannot add a comment from the server: ${error.response?.data?.error}`,
				});
			}

			errorRedirect();
		},
	});

	const likeFunction = () => {
		// Need to leave out comments, because the comments property now is in
		// array of objects ({ content: ..., id(comment id): ...}).
		// And Mongoose cannot convert it to an array of ObjectId's.
		const { comments, ...blogWithoutComments } = blog;
		likeBlogMutation.mutate({ ...blogWithoutComments, likes: blog.likes + 1 });
	};

	const deleteFunction = () => {
		if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
			deleteBlogMutation.mutate(blog);
		}
	};

	const addCommentFunction = (evt) => {
		evt.preventDefault();
		const content = evt.target.comment.value;
		const newComment = { content };
		evt.target.comment.value = "";

		if (blog.comments) {
			addCommentMutation.mutate(newComment);
		}
	};

	// rendering
	if (isLoading) {
		return <div>loading user...</div>;
	}

	if (isError) {
		return <div>error loading blog details: {error.message}</div>;
	}

	const blog = blogs.find((blog) => blog.id === id);
	// just in case the blog does not have comments field in its document
	const comments = Array.isArray(blog?.comments) ? blog?.comments : [];

	if (!blog) {
		return <div>Blog not found</div>;
	}

	return (
		<div>
			<h2 className="text-xl font-semibold">{blog.title}</h2>
			<table>
				<tbody>
					<tr className="odd:bg-gray-300">
						<td>author</td>
						<td className="pl-2.5">{blog.author}</td>
					</tr>
					<tr className="odd:bg-gray-300">
						<td>url</td>
						<td className="pl-2.5">
							<a
								href={blog.url}
								target="_blank"
								rel="noreferrer"
								className="hover:text-sky-600 duration-400"
							>
								{blog.url}
							</a>
						</td>
					</tr>
					<tr className="odd:bg-gray-300">
						<td>
							<span className="font-semibold">{blog.likes}</span> likes
						</td>
						<td className="pl-2.5">
							<button
								onClick={likeFunction}
								className="bg-gray-400 my-1 px-2.5 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
							>
								like
							</button>
						</td>
					</tr>
					<tr className="odd:bg-gray-300">
						<td>added by</td>
						<td className="pl-2.5">{blog.user.name || "unknown user"}</td>
					</tr>
					<tr className="odd:bg-gray-300">
						<td></td>
						<td className="pl-2.5">
							{loggedInUser && loggedInUser.id === blog.user?.id && (
								<button
									onClick={deleteFunction}
									className="bg-gray-400 my-1 px-2.5 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
								>
									remove
								</button>
							)}
						</td>
					</tr>
				</tbody>
			</table>
			<div className="mt-2.5">
				<h3 className="text-lg font-semibold">💬 comments</h3>
				<form onSubmit={addCommentFunction}>
					<input
						type="text"
						name="comment"
						className="border-2 rounded-lg mb-2 px-1"
					/>{" "}
					<button
						type="submit"
						className="bg-gray-300 p-1 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
					>
						add comment
					</button>
				</form>
				{comments.length > 0 ? (
					<ul>
						{comments.map((comment) => (
							<li
								key={comment.id}
								className="odd:bg-gray-300 odd:hover:text-gray-100 duration-400 rounded-lg px-1"
							>
								{comment.content}
							</li>
						))}
					</ul>
				) : (
					<p>No comments yet.</p>
				)}
			</div>
		</div>
	);
};

export default Blog;
