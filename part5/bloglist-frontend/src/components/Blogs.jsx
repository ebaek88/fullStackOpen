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
			<div className="flex justify-between items-center mb-2.5">
				<button
					onClick={sortByLikeDescending}
					className="bg-gray-300 p-1 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
				>
					sort by like(descending order)
				</button>
				&nbsp;
				<button
					onClick={sortByLikeAscending}
					className="bg-gray-300 p-1 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
				>
					sort by like(ascending order)
				</button>
			</div>
			{blogs.map((blog) => (
				<div
					key={blog.id}
					className="py-1 pl-2.5 border-1 rounded-lg mb-1 flex items-center hover:bg-gray-300 hover:text-gray-100 duration-400"
				>
					<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
				</div>
			))}
		</>
	);
};

export default Blogs;
