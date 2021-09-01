import "./ConsoleModal.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useState, useContext } from "react";

import { SocketContext } from "@context/socket";
import { PortContext } from "@context/port";

import { sendCommand } from "@managers/consoleManager";

function ConsoleModal() {
  const { lines, setLines } = useContext(SocketContext);
  const { isConnected } = useContext(PortContext);

  const [cmd, setCmd] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCmd = (e) => {
    setCmd(e.target.value);
  };

  const handleSend = () => {
    if (isConnected) sendCommand(cmd);
  };

  const handleClear = () => {
    setLines([]);
  };

  const getLines = () => {
    if (!isConnected)
      return <li class="list-group-item">Serial port is not selected</li>;

    if (lines.length === 0)
      return <li class="list-group-item">Console is empty</li>;

    return lines.map((line) => {
      return <li class="list-group-item">{line}</li>;
    });
  };

  return (
    <>
      <div onClick={handleShow} class="btn" title="Console">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-terminal-fill"
          viewBox="0 0 16 16"
        >
          <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146z" />
        </svg>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Console</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul class="list-group consoleLines">{getLines()}</ul>

          <div class="row justify-content-between mt-1">
            <div class="col-12 mt-2">
              <div class="input-group">
                <div class="input-group-text">>_</div>
                <input
                  type="text"
                  class="form-control"
                  id="inlineFormInputGroupUsername"
                  placeholder="Command"
                  value={cmd}
                  onChange={handleCmd}
                />
                <button type="btn" class="btn btn-primary" onClick={handleSend}>
                  Send
                </button>
                <button type="btn" class="btn btn-danger" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConsoleModal;
