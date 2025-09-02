import { useState } from "react";

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
    <div style={blogStyle}>
      <div className="blog-entry">
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

export default Blog;
