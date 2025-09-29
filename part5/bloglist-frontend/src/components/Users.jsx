import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs.js";

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

	return (
		<>
			<h2>Users</h2>
			<table>
				<thead>
					<tr>
						<th scope="col" colSpan={2}>
							blogs created
						</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</>
	);
};

export default Users;
