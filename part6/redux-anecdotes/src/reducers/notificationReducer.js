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

let timeoutId = -1;

export const { createNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (msg, timeInSec = 5) => {
  return (dispatch) => {
    dispatch(createNotification(msg));
    // This is for "debouncing" the clearing of the message.
    // That is, the message disappears only if there is no createNotification(msg) call for timeInSec.
    if (timeoutId >= 0) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(
      () => dispatch(createNotification("")),
      timeInSec * 1000
    );
  };
};

export default notificationSlice.reducer;
