import "./ProcessModal.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import React, { useState, useContext } from "react";

import { FileContext } from "@context/file";
import { postProcess } from "@managers/postProcessManager";

function ProcessModal() {
  const { files } = useContext(FileContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onJustDoIt = () => {
    let options = {};
    postProcess(files, options);
  };

  return (
    <>
      <div onClick={handleShow} class="btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-play-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
        </svg>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="d-grid gap-2 mt-2">
            <button class="btn btn-primary" type="button" onClick={onJustDoIt}>
              Just Do it
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProcessModal;
