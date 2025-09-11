import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "CREATE": {
      return `newly created ${action.payload}!`;
    }
    case "VOTE": {
      return `anecdote '${action.payload}' voted`;
    }
    case "CLEAR": {
      return "";
    }
    case "ERROR": {
      return action.payload;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

const AnecdoteContext = createContext(null);

export const AnecdoteContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  return (
    <AnecdoteContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </AnecdoteContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(AnecdoteContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(AnecdoteContext);
  return notificationAndDispatch[1];
};

export default AnecdoteContext;
