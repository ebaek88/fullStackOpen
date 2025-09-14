import { useNavigate } from "react-router-dom";
import { useField } from "../hooks";

const CreateNew = (props) => {
  const [content, resetContent] = useField("text");
  const [author, resetAuthor] = useField("text");
  const [info, resetInfo] = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnecdote = {
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    };

    props.addNew(newAnecdote);
    setTimeout(() => navigate("/"), 2000);
    props.notificationHandler(`a new anecdote ${newAnecdote.content} created!`);
  };

  const handleReset = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <input type="reset" value="reset" />
      </form>
    </div>
  );
};

export default CreateNew;
