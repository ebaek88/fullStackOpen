import blogReducer, { initializeBlogs } from "./blogReducer.js";
import deepFreeze from "deep-freeze";

describe("blog reducer", () => {
	test("returns new state with new blogs", () => {
		const initialBlogs = [
			{
				author: "Dooly",
				id: "68a561fcfe515c8ab7d5d931",
				likes: 5,
				title: "Dinosaurs are alive!",
				url: "https://dooly.com/34",
				user: {
					id: "68a55fe9a7a0db9a86362b80",
					name: "Harry Potter",
					username: "abc12345",
				},
			},
			{
				author: "Bill Gates",
				id: "68ac0811dd6036b4ac91371f",
				likes: 2,
				title: "How to create a blog from frontend",
				url: "https://microsoft.com",
				user: {
					id: "68a55fe9a7a0db9a86362b80",
					name: "Harry Potter",
					username: "abc12345",
				},
			},
		];

		const state = [];
		const action = {
			type: "blog/setBlogs",
			payload: initialBlogs,
		};

		deepFreeze(state);

		const newState = blogReducer(state, action);
		expect(newState).toHaveLength(2);
		expect(newState).toEqual(initialBlogs);
	});

	test("returns new state with a new blog attached to the previous state", () => {
		const state = [
			{
				author: "Dooly",
				id: "68a561fcfe515c8ab7d5d931",
				likes: 5,
				title: "Dinosaurs are alive!",
				url: "https://dooly.com/34",
				user: {
					id: "68a55fe9a7a0db9a86362b80",
					name: "Harry Potter",
					username: "abc12345",
				},
			},
		];
		const action = {
			type: "blog/appendBlog",
			payload: {
				author: "Bill Gates",
				id: "68ac0811dd6036b4ac91371f",
				likes: 2,
				title: "How to create a blog from frontend",
				url: "https://microsoft.com",
				user: {
					id: "68a55fe9a7a0db9a86362b80",
					name: "Harry Potter",
					username: "abc12345",
				},
			},
		};

		deepFreeze(state);
		const newState = blogReducer(state, action);

		expect(newState).toHaveLength(2);
		expect(newState).toContainEqual(action.payload);
	});
});
