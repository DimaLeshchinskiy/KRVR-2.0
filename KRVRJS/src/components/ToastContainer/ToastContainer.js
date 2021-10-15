import "./ToastContainer.css";
import React, { useState, useEffect, useContext } from "react";

import { SocketContext } from "@context/socket";
import { programStates } from "@context/socket";

import ToastStop from "@components/Toasts/ToastStop.js";
import ToastPause from "@components/Toasts/ToastPause.js";

const messages = {
  RUN: ToastStop,
  STOP: ToastStop,
  PAUSE: ToastPause,
};

function ToastContainer() {
  const { programState } = useContext(SocketContext);
  const [toasts, setToasts] = useState([]);

  const onCloseHandler = (id) => {
    console.log("Container", id);
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  const appendToast = (toast) => {
    let newID = Date.now();

    setToasts([
      ...toasts,
      {
        id: newID,
        reactElement: React.createElement(toast, {
          id: newID,
          onClose: onCloseHandler,
        }),
      },
    ]);
  };

  useEffect(() => {
    if (programState === programStates.STOP) {
      appendToast(messages.STOP);
    } else if (programState === programStates.PAUSE) {
      appendToast(messages.PAUSE);
    } else if (programState === programStates.RUN) {
      appendToast(messages.RUN);
    }
  }, [programState]);

  return (
    <div class="toast-container">
      {/* {toasts.map((toast) => {
        return (
          <option
            key={action.id}
            selected={actionTypeSelected === action.id}
            value={action.id}
          >
            {action.title}
          </option>
        );
      })} */}
      {toasts.map((obj) => obj.reactElement)}
    </div>
  );
}

export default ToastContainer;
