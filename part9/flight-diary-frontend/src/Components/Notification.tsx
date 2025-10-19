const Notification = ({ message }: { message: string }) => {
  const successPrompts = ["added"];

  if (!message) {
    return null;
  }

  if (
    successPrompts.some((prompt) =>
      message.toLocaleLowerCase().includes(prompt)
    )
  ) {
    return <div className="success">{message}</div>;
  }

  return <div className="error">{message}</div>;
};

export default Notification;
