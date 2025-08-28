import { useState } from "react";

const Blog = ({ blog, likeFunction }) => {
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
    <div style={blogStyle}>
      <div>
        {blog.title} - by {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      <div style={{ display: visible ? "" : "none" }}>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={likeFunction}>like</button>
        </p>
        {blog.user.name || ""}
      </div>
    </div>
  );
};

export default Blog;
