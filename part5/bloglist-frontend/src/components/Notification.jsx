import { useSelector } from "react-redux";

const Notification = () => {
	const notification = useSelector((state) => state.notification);
	const successPrompts = ["Deleted", "Updated", "Welcome", "successfully"];

	if (!notification) return null;

	if (successPrompts.some((prompt) => notification.includes(prompt))) {
		return <div className="success">{notification}</div>;
	}

	return (
		<div className="modal">
			<div className="error">{notification}</div>
		</div>
	);
};

export default Notification;
