import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlog from "./NewBlog.jsx";

describe("<NewBlog />", () => {
	test("the form calls the event handler it received as props with the right details when a new blog is create", async () => {
		const mockHandler = vi.fn();
		const user = userEvent.setup();

		render(<NewBlog createBlog={mockHandler} />);

		const titleInput = screen.getByLabelText("title:");
		const authorInput = screen.getByLabelText("author:");
		const urlInput = screen.getByLabelText("url:");
		const sendButton = screen.getByRole("button");

		await user.type(titleInput, "test title");
		await user.type(authorInput, "test author");
		await user.type(urlInput, "test url");
		await user.click(sendButton);

		// console.log(mockHandler.mock.calls);
		expect(mockHandler.mock.calls).toHaveLength(1);
		expect(mockHandler.mock.calls[0][0].title).toBe("test title");
		expect(mockHandler.mock.calls[0][0].author).toBe("test author");
		expect(mockHandler.mock.calls[0][0].url).toBe("test url");
	});
});
