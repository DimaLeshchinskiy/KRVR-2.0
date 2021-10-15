import Toast from "react-bootstrap/Toast";
import { useState } from "react";

import { resume } from "@managers/consoleManager";

function ToastPause({ id, onClose }) {
  const [show, setShow] = useState(true);

  const onCloseHandler = () => {
    setShow(false);
    onClose(id);
  };

  const onResume = () => {
    resume().then(() => {
      onCloseHandler();
    });
  };

  return (
    <Toast show={show} bg="light" onClose={onCloseHandler}>
      <Toast.Header closeButton={true}>
        <strong className="me-auto">Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>
        Program has been paused.
        <div class="d-grid gap-2">
          <button class="btn btn-primary" type="button" onClick={onResume}>
            Resume
          </button>
        </div>
      </Toast.Body>
    </Toast>
  );
}

export default ToastPause;
