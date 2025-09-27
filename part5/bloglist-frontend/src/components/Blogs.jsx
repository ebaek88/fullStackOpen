import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs.js";
import { useSetNotification } from "../contexts/NotificationContext.jsx";

const Blog = ({ blog, loggedInUser, likeFunction, deleteFunction }) => {
	const [visible, setVisible] = useState(false);

	const toggleVisibility = () => setVisible(!visible);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	return (
		<div className="blog-entry" style={blogStyle}>
			<div>
				{blog.title} - by {blog.author}{" "}
				<button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
			</div>
			<div style={{ display: visible ? "" : "none" }}>
				<div>{blog.url}</div>
				<div className="blog-likes">
					likes {blog.likes} <button onClick={likeFunction}>like</button>
				</div>
				<div>{blog.user.name || ""}</div>
				{loggedInUser && loggedInUser.id === blog.user?.id && (
					<div>
						<button onClick={deleteFunction}>remove</button>
					</div>
				)}
			</div>
		</div>
	);
};

const Blogs = ({ user }) => {
	const setNotification = useSetNotification();

	const result = useQuery({
		queryKey: ["blogs"],
		queryFn: blogService.getAll,
		retry: 1,
	});
	console.log(JSON.parse(JSON.stringify(result)));

	const queryClient = useQueryClient();

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
		},
	});

	if (result.isLoading) {
		return <div>loading data...</div>;
	}

	if (result.isError) {
		return (
			<div>
				anecdote service not available due to problems in server:{" "}
				{result.error.message}
			</div>
		);
	}

	const blogs = result.data;

	// Handlers for sorting blogs by likes
	const sortByLikeAscending = () => {
		const sortedBlogs = [...blogs].sort((a, b) => a.likes - b.likes);
		queryClient.setQueryData(["blogs"], sortedBlogs);
	};

	const sortByLikeDescending = () => {
		const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
		queryClient.setQueryData(["blogs"], sortedBlogs);
	};

	return (
		<>
			<div>
				<button onClick={sortByLikeDescending}>
					sort by like(descending order)
				</button>
				&nbsp;
				<button onClick={sortByLikeAscending}>
					sort by like(ascending order)
				</button>
			</div>
			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					loggedInUser={user}
					likeFunction={() =>
						likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
					}
					deleteFunction={() => {
						if (
							window.confirm(`Removing blog ${blog.title} by ${blog.author}`)
						) {
							deleteBlogMutation.mutate(blog);
						}
					}}
				/>
			))}
		</>
	);
};

export default Blogs;
