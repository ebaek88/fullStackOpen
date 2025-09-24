import { useState } from "react";

const NewBlog = ({ createBlog }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const addBlog = (evt) => {
		evt.preventDefault();

		createBlog({
			title,
			author,
			url,
		});

		setTitle("");
		setAuthor("");
		setUrl("");
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
							value={title}
							onChange={(evt) => setTitle(evt.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						author:
						<input
							type="text"
							value={author}
							onChange={(evt) => setAuthor(evt.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						url:
						<input
							type="text"
							value={url}
							onChange={(evt) => setUrl(evt.target.value)}
						/>
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default NewBlog;
