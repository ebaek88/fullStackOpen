import { useReducer, createContext, useContext } from "react";
import loginService from "../services/login.js";

const userReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN": {
			return action.payload;
		}
		case "LOGOUT": {
			return null;
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
};

const UserContext = createContext(null);

export const UserContextProvider = (props) => {
	const [user, userDispatch] = useReducer(userReducer, null);

	return (
		<UserContext.Provider value={[user, userDispatch]}>
			{props.children}
		</UserContext.Provider>
	);
};

export const useUserValue = () => {
	const userAndDispatch = useContext(UserContext);
	return userAndDispatch[0];
};

export const useUserDispatch = () => {
	const userAndDispatch = useContext(UserContext);
	return userAndDispatch[1];
};

export default UserContext;
