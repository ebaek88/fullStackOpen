const Notification = ({ msg }) => {
	const successPrompts = ["Deleted", "Updated", "Welcome", "successfully"];

	if (!msg) return null;

	if (successPrompts.some((prompt) => msg.includes(prompt))) {
		return (
			<div className="bg-gray-300 text-xl rounded-md border-2 border-black border-solid p-2.5 my-2.5 text-green-800">
				{msg}
			</div>
		);
	}

	return (
		<div className="bg-black opacity-80 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center">
			<div className="bg-gray-300 text-xl rounded-md border-2 border-black border-solid p-2.5 my-2.5 text-red-800">
				{msg}
			</div>
		</div>
	);
};

export default Notification;
