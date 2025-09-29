import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs.js";

const User = () => {
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
		return <div>error loading user blogs: {error.message}</div>;
	}

	const userInfo = blogs.find((blog) => blog.user.id === id).user;
	const userBlogs = blogs.filter((blog) => blog.user.id === id);

	return (
		<div>
			<h2>{userInfo.name}</h2>
			<h3>added blogs</h3>
			{userBlogs.map((blog) => (
				<li key={blog.id} style={{ listStyle: "inside" }}>
					{blog.title}
				</li>
			))}
		</div>
	);
};

export default User;
