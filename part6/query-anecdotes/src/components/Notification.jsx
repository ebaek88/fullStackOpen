const Notification = ({ msg }) => {
  const warnings = ["too short"];

  const style = {
    borderStyle: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!msg) style.display = "none";

  if (warnings.some((warning) => msg?.toLowerCase().includes(warning))) {
    style.color = "red";
    style.borderColor = "red";
  }

  return <div style={style}>{msg}</div>;
};

export default Notification;
