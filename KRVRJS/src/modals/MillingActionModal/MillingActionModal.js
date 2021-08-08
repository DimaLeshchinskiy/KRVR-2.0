import "./MillingActionModal.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import ThreeRender from "./ThreeJS";

import { useState, useEffect } from "react";

import { getActionTypes } from "@managers/actionManager";
import { getTools } from "@managers/toolManager";

function MillingActionModal({ action, file, onSaveAction }) {
  const [isPickModeEnable, pickModeEnable] = useState(false);
  const [pickPropertyName, setPickPropertyName] = useState("");

  const [actionTypeSelected, setActionTypeSelected] = useState(action.typeId);
  const [actionTypes, setActionTypes] = useState([]);
  const [actionTitle, setActionTitle] = useState(action.title);

  const [fields, setFields] = useState([...action.fields]);

  useEffect(() => {
    getActionTypes().then((actionTypes) => {
      setActionTypes(actionTypes);
    });
  }, []);

  const handleClose = () => {
    onSaveAction(action);
  };

  const onActionTitleChange = (value) => {
    action.title = value;
    setActionTitle(value);
  };

  const tooglePickMode = function (propertyName) {
    if (!isPickModeEnable) {
      action.fields.find((field) => field.inputName === propertyName).value =
        null;
      setPickPropertyName(propertyName);
      pickModeEnable(true);
    }
  };

  const onPick = function (faces, propertyName) {
    console.log("onPick", faces, propertyName);
    let field = action.fields.find((field) => field.inputName === propertyName);
    field.value = faces;
    setPickPropertyName("");
    pickModeEnable(false);
  };

  const onActionTypeSelectedChange = function (e) {
    if (e.target.value) {
      let type = actionTypes.find((type) => type.id === e.target.value);

      action.typeId = type.id;
      action.fields = type.fields.map((field) => Object.assign({}, field));
    } else {
      action.typeId = null;
      action.fields = [];
    }

    setActionTypeSelected(e.target.value);
    pickModeEnable(false);
    setPickPropertyName("");
    setFields([...action.fields]);
  };

  const getFieldsByInputType = function (inputType) {
    return fields.filter((field) => field.inputType === inputType);
  };

  return (
    <>
      <Modal
        show={action.isEdit}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size={"xl"}
      >
        <Modal.Header>
          <Modal.Title>Action Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row g-3 justify-content-between">
            <div class="col-6">
              <ThreeRender
                file={file}
                isPickModeEnable={isPickModeEnable}
                pickPropertyName={pickPropertyName}
                onPick={onPick}
                faceInputFields={getFieldsByInputType("facePicker")}
              />
            </div>

            <div class="col-6">
              <div class="input-group mb-2">
                <span class="input-group-text" id="inputGroup-sizing-default">
                  Title
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Action title"
                  value={actionTitle}
                  onChange={(e) => onActionTitleChange(e.target.value)}
                />
              </div>
              <ToolPicker action={action} />
              <select
                class="form-select"
                aria-label="Default select example"
                onChange={onActionTypeSelectedChange}
              >
                <option selected={!actionTypeSelected} value="">
                  Choose Action type
                </option>
                {actionTypes.map((action, i) => {
                  return (
                    <option
                      key={action.id}
                      selected={actionTypeSelected === action.id}
                      value={action.id}
                    >
                      {action.title}
                    </option>
                  );
                })}
              </select>
              <ul class="list-group list-group-flush mt-2">
                <InputList action={action} tooglePickMode={tooglePickMode} />
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MillingActionModal;

function InputList({ action, tooglePickMode }) {
  if (action.fields.length === 0) return <li class="list-group-item">Empty</li>;

  return action.fields.map((field) => {
    if (field.inputType === "face")
      return <FacePicker field={field} tooglePickMode={tooglePickMode} />;
    if (field.inputType === "number") return <NumberInput field={field} />;
    return <li class="list-group-item">Err</li>;
  });
}

function ToolPicker({ action }) {
  const [tools, setTools] = useState([]);
  const [toolSelected, setToolSelected] = useState("");

  useEffect(() => {
    getTools().then((tools) => {
      setTools(tools);
      setToolSelected(action.toolId);
    });
  }, []);

  const onToolChange = function (e) {
    action.toolId = e.target.value;
    setToolSelected(e.target.value);
  };

  return (
    <select
      class="form-select mb-2"
      id="inputGroupSelect01"
      onChange={onToolChange}
    >
      <option selected={!toolSelected}>Choose Tool</option>

      {tools.map((tool, i) => {
        return (
          <option key={i} value={tool.id} selected={tool.id === toolSelected}>
            {tool.title}
          </option>
        );
      })}
    </select>
  );
}

function FacePicker({ field, tooglePickMode }) {
  return (
    <li class="list-group-item">
      <div class="input-group">
        <span class="input-group-text">{field.label}</span>
        <button
          class="btn btn-outline-secondary"
          type="button"
          onClick={() => {
            tooglePickMode(field.inputName);
          }}
        >
          Pick face
        </button>
        <input
          type="color"
          class="form-control form-control-color"
          id="exampleColorInput"
          value="#563d7c"
          title="Choose your color"
        />
      </div>
    </li>
  );
}

function NumberInput({ field }) {
  const [value, setValue] = useState(field);

  useEffect(() => {
    setValue(field.value);
  });

  return (
    <li class="list-group-item">
      <div class="input-group mb-2">
        <span class="input-group-text" id="inputGroup-sizing-default">
          {field.label}
        </span>
        <input
          type="number"
          class="form-control"
          placeholder={field.label}
          value={value}
          onChange={(e) => {
            field.value = e.target.value;
            setValue(e.target.value);
          }}
        />
      </div>
    </li>
  );
}
