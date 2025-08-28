import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog.jsx";

describe("<Blog />", () => {
  const blog = {
    title: "How to invest in crypto",
    author: "Wonyotti",
    url: "https://www.realcrypto/333",
    likes: 4,
    user: {
      username: "abc12345",
      name: "Harry Potter",
      id: "68a55fe9a7a0db9a86362b80",
    },
    id: "68ade79ddd6036b4ac913731",
  };

  beforeEach(() => {
    render(<Blog blog={blog} />);
  });

  test("the blog's title and author are visible, but not the url and the likes", async () => {
    const titleAndAuthor = await screen.findByText(
      `${blog.title} - by ${blog.author}`
    );

    const urlElement = screen.queryByText(`${blog.url}`);
    const likesElement = screen.getByText("likes", { exact: false });

    expect(titleAndAuthor).toBeVisible();
    expect(urlElement).not.toBeVisible();
    expect(likesElement).not.toBeVisible();
  });

  test("the blog's url and number of likes are shown when the view button has been clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const urlElement = screen.queryByText(`${blog.url}`);
    const likesElement = screen.getByText("likes", { exact: false });

    expect(urlElement).toBeVisible();
    expect(likesElement).toBeVisible();
  });
});
