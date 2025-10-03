import { useState, useImperativeHandle } from "react";

const Togglable = (props) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisible = { display: visible ? "none" : "" };
	const showWhenVisible = { display: visible ? "" : "none" };

	const toggleVisibility = () => setVisible(!visible);

	useImperativeHandle(props.ref, () => {
		return { toggleVisibility };
	});

	return (
		<div className="mt-2.5 mb-2.5">
			<span style={hideWhenVisible}>
				<button
					onClick={toggleVisibility}
					className="bg-gray-300 p-1 rounded-lg hover:text-gray-100 duration-400 cursor-pointer"
				>
					{props.buttonLabel}
				</button>
			</span>
			<div style={showWhenVisible}>
				{props.children}
				<button
					onClick={toggleVisibility}
					className="bg-gray-300 p-1 rounded-lg hover:text-red-500 duration-400 cursor-pointer"
				>
					cancel
				</button>
			</div>
		</div>
	);
};

export default Togglable;
