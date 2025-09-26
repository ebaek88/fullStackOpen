import notificationReducer, {
	setNotification,
} from "./notificationReducerRedux.js";
import { createNotification } from "./notificationReducerRedux.js";
import deepFreeze from "deep-freeze";

jest.useFakeTimers(); // we need to use this to simulate a timer in Jest

describe("notification reducer", () => {
	test("returns new state with new notification message", () => {
		const state = "";
		const action = {
			type: "notification/createNotification",
			payload: "hello",
		};
		deepFreeze(state);
		const newState = notificationReducer(state, action);

		expect(newState).toContain("hello");
	});

	test("setNotification dispatched", () => {
		const dispatch = jest.fn(); // mock dispatch
		// executing Redux Thunk
		setNotification("hello", 3)(dispatch);
		// check if dispatch has been called by the actual object that returned by createNotification
		expect(dispatch).toHaveBeenCalledWith(createNotification("hello"));

		jest.advanceTimersByTime(3000);

		expect(dispatch).toHaveBeenCalledWith(createNotification(""));
	});
});
