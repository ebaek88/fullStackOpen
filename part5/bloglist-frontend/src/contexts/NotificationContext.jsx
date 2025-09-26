import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
	switch (action.type) {
		case "CREATE": {
			return `A new blog ${action.payload.title} by ${action.payload.author} added successfully!`;
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

export const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		""
	);

	let notificationTimeoutId;

	const setNotification = (action, timeInSec = 3) => {
		clearTimeout(notificationTimeoutId);
		notificationDispatch(action);
		notificationTimeoutId = setTimeout(() => {
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
