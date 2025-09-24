// import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer.js";

const NewBlog = ({ user, ref }) => {
	// const [title, setTitle] = useState("");
	// const [author, setAuthor] = useState("");
	// const [url, setUrl] = useState("");

	const dispatch = useDispatch();

	const addBlog = (evt) => {
		evt.preventDefault();
		const title = evt.target.title.value;
		const author = evt.target.author.value;
		const url = evt.target.url.value;
		evt.target.title.value = "";
		evt.target.author.value = "";
		evt.target.url.value = "";

		ref.current.toggleVisibility();
		const newBlog = { title, author, url };
		dispatch(createBlog(newBlog));

		// setTitle("");
		// setAuthor("");
		// setUrl("");
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={addBlog}>
				<div>
					<label>
						title:
						<input
							type="text"
							name="title"
							// value={title}
							// onChange={(evt) => setTitle(evt.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						author:
						<input
							type="text"
							name="author"
							// value={author}
							// onChange={(evt) => setAuthor(evt.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						url:
						<input
							type="text"
							name="url"
							// value={url}
							// onChange={(evt) => setUrl(evt.target.value)}
						/>
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default NewBlog;
