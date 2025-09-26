import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
// import store from "./reducers/store.js";
import { NotificationContextProvider } from "./contexts/NotificationContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<NotificationContextProvider>
		{/* <Provider store={store}> */}
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
		{/* </Provider> */}
	</NotificationContextProvider>
);
