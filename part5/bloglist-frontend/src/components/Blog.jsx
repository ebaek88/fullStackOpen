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
			<h2>{blog.title}</h2>
			<div>author: {blog.author}</div>
			<div>
				<a href={blog.url} target="_blank" rel="noreferrer">
					{blog.url}
				</a>
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
			<div>
				<h3>comments</h3>
				<form onSubmit={addCommentFunction}>
					<input type="text" name="comment" />{" "}
					<button type="submit">add comment</button>
				</form>
				{comments.length > 0 ? (
					<ul>
						{comments.map((comment) => (
							<li key={comment.id}>{comment.content}</li>
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
