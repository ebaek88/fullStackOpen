import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteBlog, increaseLike } from "../reducers/blogReducer.js";
import { setBlogs } from "../reducers/blogReducer.js";

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
				<div
					style={{
						display:
							loggedInUser && loggedInUser.id === blog.user.id ? "" : "none",
					}}
				>
					<button onClick={deleteFunction}>remove</button>
				</div>
			</div>
		</div>
	);
};

const Blogs = ({ user }) => {
	const dispatch = useDispatch();
	const blogs = useSelector((state) => state.blogs);
	// console.log(blogs);

	// Handlers for sorting blogs by likes
	const sortByLikeAscending = () => {
		const sortedBlogs = [...blogs].sort((a, b) => a.likes - b.likes);
		dispatch(setBlogs(sortedBlogs));
	};

	const sortByLikeDescending = () => {
		const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
		dispatch(setBlogs(sortedBlogs));
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
					likeFunction={() => dispatch(increaseLike(blog.id))}
					deleteFunction={() => dispatch(deleteBlog(blog.id))}
				/>
			))}
		</>
	);
};

export default Blogs;
