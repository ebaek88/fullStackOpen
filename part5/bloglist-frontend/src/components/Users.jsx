import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs.js";
import { Link } from "react-router-dom";
import User from "./User.jsx";

const Users = () => {
	const result = useQuery({
		queryKey: ["blogs"],
		queryFn: blogService.getAll,
		retry: 1,
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
	const blogCount = {};
	for (const blog of blogs) {
		if (!blogCount[blog.user.id]) {
			blogCount[blog.user.id] = [blog.user.name, 0];
		}
		blogCount[blog.user.id][1] = blogCount[blog.user.id][1] + 1;
	}
	// const blogCountIterator = Object.entries(blogCount);
	const blogCountRows = [];
	for (const [id, [name, count]] of Object.entries(blogCount)) {
		blogCountRows.push(
			<tr key={id}>
				<td>
					<Link to={`/users/${id}`}>{name}</Link>
				</td>
				<td>{count}</td>
			</tr>
		);
	}

	return (
		<>
			<h2>Users</h2>
			<table>
				<thead>
					<tr>
						<th scope="col"></th>
						<th scope="col">blogs created</th>
					</tr>
				</thead>
				<tbody>{blogCountRows}</tbody>
			</table>
		</>
	);
};

export default Users;
