import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import blogService from "../services/blogs.js";

import Togglable from "./Togglable.jsx";
import NewBlog from "./NewBlog.jsx";

const Blogs = ({ user, ref }) => {
	const queryClient = useQueryClient();
	const result = useQuery({
		queryKey: ["blogs"],
		queryFn: blogService.getAll,
		retry: 1,
	});
	console.log(JSON.parse(JSON.stringify(result)));

	if (result.isLoading) {
		return <div>loading data...</div>;
	}

	if (result.isError) {
		return (
			<div>
				blog service not available due to problems in server:{" "}
				{result.error.message}
			</div>
		);
	}

	const blogs = result.data;

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

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
			<Togglable buttonLabel={"create new blog"} ref={ref}>
				<NewBlog user={user} ref={ref} />
			</Togglable>
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
				<div key={blog.id} className="blog-entry" style={blogStyle}>
					<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
				</div>
			))}
		</>
	);
};

export default Blogs;
