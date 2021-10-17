import "./EditorModal.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";

import SketchEditor from "./SketchEditor/SketchEditor.js";

const mode_components_enum = {
  0: EditorMenu,
  1: SketchEditor,
};

function EditorModal() {
  const [show, setShow] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0);

  const handleClose = () => {
    setShow(false);
    setSelectedMode(0);
  };
  const handleShow = () => setShow(true);

  console.log(selectedMode);

  return (
    <>
      <button onClick={handleShow} type="button" class="btn btn-link btn-sm">
        or create your own
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size={"lg"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMode == 0 &&
            React.createElement(mode_components_enum[0], {
              setSelectedMode: setSelectedMode,
            })}
          {selectedMode != 0 &&
            React.createElement(mode_components_enum[selectedMode], {
              handleClose: handleClose,
            })}
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

export default EditorModal;

function EditorMenu({ setSelectedMode }) {
  return (
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col">
        <div class="card h-100 text-center">
          <div class="card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil card-img-top editor_icon"
              viewBox="0 0 16 16"
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
            <h5 class="card-title">2D sketch</h5>
            <p class="card-text">
              Draw your own 2D sketch using our Editor. After creatng you can
              export this as SVG.
            </p>
          </div>

          <div class="card-footer">
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => setSelectedMode(1)}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
