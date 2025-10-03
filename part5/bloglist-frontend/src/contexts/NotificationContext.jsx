import { createContext, useContext, useReducer, useRef } from "react";

const notificationReducer = (state, action) => {
	switch (action.type) {
		case "CREATE": {
			return `A new blog ${action.payload.title} by ${action.payload.author} added successfully!`;
		}
		case "COMMENT": {
			return `A new comment ${action.payload.comment} has been added to the blog ${action.payload.title} successfully!`;
		}
		case "DELETE": {
			return `Deleted note ${action.payload} successfully!`;
		}
		case "LOGIN": {
			return `Welcome ${action.payload}!`;
		}
		case "LOGOUT": {
			return "Logged out successfully!";
		}
		case "ERROR": {
			return action.payload;
		}
		case "CLEAR": {
			return "";
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
};

const NotificationContext = createContext(null);
// const NotificationContext = createContext(["", () => {}, () => {}]);

export const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		""
	);

	const notificationTimeoutId = useRef(null);

	const setNotification = (action, timeInSec = 3) => {
		clearTimeout(notificationTimeoutId.current);
		notificationDispatch(action);
		notificationTimeoutId.current = setTimeout(() => {
			notificationDispatch({ type: "CLEAR" });
		}, timeInSec * 1000);
	};

	return (
		<NotificationContext.Provider
			value={[notification, notificationDispatch, setNotification]}
		>
			{props.children}
		</NotificationContext.Provider>
	);
};

export const useNotificationValue = () => {
	const notificationAndDispatch = useContext(NotificationContext);
	return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
	const notificationAndDispatch = useContext(NotificationContext);
	return notificationAndDispatch[1];
};

export const useSetNotification = () => {
	const notificationAndDispatch = useContext(NotificationContext);
	return notificationAndDispatch[2];
};

export default NotificationContext;
