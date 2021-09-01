import "./ProcessModal.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import React, { useState, useEffect, useContext } from "react";

import { FileContext } from "@context/file";
import { PortContext } from "@context/port";

import { postProcess } from "@managers/postProcessManager";
import { getPorts, connect, disconnect } from "@managers/portManager";

function ProcessModal() {
  const { files } = useContext(FileContext);
  const { isConnected } = useContext(PortContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onJustDoIt = () => {
    let options = {};
    if (isConnected) postProcess(files, options);
  };

  return (
    <>
      <div onClick={handleShow} class="btn" title="Process">
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
          <Modal.Title>Post process</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="d-grid gap-2 mt-2">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <PortSelect />
              </li>
              <li class="list-group-item">
                <button
                  class="btn btn-primary"
                  type="button"
                  onClick={onJustDoIt}
                >
                  Just Do it
                </button>
              </li>
            </ul>
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

function PortSelect(props) {
  const { port, setPort, isConnected, setConnected } = useContext(PortContext);
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    getPorts().then((_ports) => {
      setPorts(_ports.ports);
    });
  };

  const onConnect = () => {
    connect(port).then(() => {
      setConnected(true);
    });
  };

  const onDisconnect = () => {
    disconnect().then(() => {
      setConnected(false);
    });
  };

  const getButton = () => {
    if (isConnected)
      return (
        <button class="btn btn-danger" type="button" onClick={onDisconnect}>
          Disconnect
        </button>
      );

    if (port)
      return (
        <button class="btn btn-primary" type="button" onClick={onConnect}>
          Connect
        </button>
      );

    return (
      <button class="btn btn-primary" type="button" disabled={true}>
        Connect
      </button>
    );
  };

  const onPortChange = (e) => {
    if (isConnected) {
      onDisconnect();
    }
    setPort(e.target.value);
  };

  return (
    <div class="input-group">
      <select
        class="form-select"
        aria-label="Default select example"
        onChange={onPortChange}
      >
        <option selected={!port} value="">
          Choose port
        </option>
        {ports.map((_port) => {
          return (
            <option key={_port} selected={port === _port} value={_port}>
              {_port}
            </option>
          );
        })}
      </select>
      <button type="button" class="btn btn-outline-secondary" onClick={refresh}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-clockwise"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
        </svg>
      </button>
      {getButton()}
    </div>
  );
}

export default ProcessModal;
