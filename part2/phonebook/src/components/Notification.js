import React from "react";

const Notification = ({feedback}) => {
  if (feedback === null) {
    return null;
  }

  let messageStyle;

  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  feedback.error ? (messageStyle = errorStyle) : (messageStyle = successStyle);

  return <div style={messageStyle}>{feedback.message}</div>;
};

export default Notification;
