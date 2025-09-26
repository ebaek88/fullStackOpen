import { useSelector } from "react-redux";

const Notification = ({ msg }) => {
	const notification = useSelector((state) => state.notification);
	const successPrompts = ["Deleted", "Updated", "Welcome", "successfully"];

	if (!msg) return null;

	if (successPrompts.some((prompt) => msg.includes(prompt))) {
		return <div className="success">{msg}</div>;
	}

	return (
		<div className="modal">
			<div className="error">{msg}</div>
		</div>
	);
};

export default Notification;
