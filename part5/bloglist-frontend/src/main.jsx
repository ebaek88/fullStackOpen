import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./reducers/store.js";
import { NotificationContextProvider } from "./contexts/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<NotificationContextProvider>
		<Provider store={store}>
			<App />
		</Provider>
	</NotificationContextProvider>
);
