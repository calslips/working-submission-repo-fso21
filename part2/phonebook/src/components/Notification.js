import React from "react";

const Notification = ({ message, error }) => {
  if (message === null) {
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

  error ? (messageStyle = errorStyle) : (messageStyle = successStyle);

  return <div style={messageStyle}>{message}</div>;
};

export default Notification;
