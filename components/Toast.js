import React from "react";

const Toast = (props) => {
  const { message } = props;
  return (
    <div>
      <div className="toast toast-top toast-end z-50">
        <div className="alert alert-info">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
