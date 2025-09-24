import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notification",
	initialState: "",
	reducers: {
		createNotification(state, action) {
			return action.payload;
		},
	},
});

let timeoutId;

export const { createNotification } = notificationSlice.actions;

// action creators
export const setNotification = (msg, timeInSec = 3) => {
	return (dispatch) => {
		dispatch(createNotification(msg));
		// This is for "debouncing" the clearing of the message.
		// That is, the message disappears only if there is no createNotification(msg) call for timeInSec.
		console.log(timeoutId);
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			dispatch(createNotification(""));
		}, timeInSec * 1000);
	};
};

export default notificationSlice.reducer;
