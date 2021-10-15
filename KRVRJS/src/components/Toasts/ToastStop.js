import Toast from "react-bootstrap/Toast";
import { useState } from "react";

function ToastStop({ id, onClose }) {
  const [show, setShow] = useState(true);

  const onCloseHandler = () => {
    onClose(id);
    setShow(false);
  };

  return (
    <Toast show={show} bg="light" onClose={onCloseHandler}>
      <Toast.Header closeButton={true}>
        <strong className="me-auto">Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>Program has been stopped.</Toast.Body>
    </Toast>
  );
}

export default ToastStop;
