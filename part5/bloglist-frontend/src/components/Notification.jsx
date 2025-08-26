const Notification = ({ message }) => {
  const successPrompts = [
    "added",
    "Deleted",
    "Updated",
    "Welcome",
    "successfully",
  ];

  if (message === null) return null;

  if (successPrompts.some((prompt) => message.includes(prompt))) {
    return <div className="success">{message}</div>;
  }

  return (
    <div className="modal">
      <div className="error">{message}</div>
    </div>
  );
};

export default Notification;
