import "./ToolsModal.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";

import { getTools, getToolById, getToolTypes } from "@managers/toolManager";

function ToolsModal(props) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState(props.tab || "list"); // <list || create>
  const [editToolId, setEditToolId] = useState(props.editToolId);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openList = () => {
    setEditToolId(null);
    setTab("list");
  };

  const openCreate = () => {
    setEditToolId(null);
    setTab("create");
  };

  const openEdit = (toolId) => {
    setEditToolId(toolId);
    setTab("create");
  };

  return (
    <>
      <div onClick={handleShow} class="btn" title="Tools">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-screwdriver"
          viewBox="0 0 16 16"
        >
          <path d="M0 1l1-1 3.081 2.2a1 1 0 0 1 .419.815v.07a1 1 0 0 0 .293.708L10.5 9.5l.914-.305a1 1 0 0 1 1.023.242l3.356 3.356a1 1 0 0 1 0 1.414l-1.586 1.586a1 1 0 0 1-1.414 0l-3.356-3.356a1 1 0 0 1-.242-1.023L9.5 10.5 3.793 4.793a1 1 0 0 0-.707-.293h-.071a1 1 0 0 1-.814-.419L0 1zm11.354 9.646a.5.5 0 0 0-.708.708l3 3a.5.5 0 0 0 .708-.708l-3-3z" />
        </svg>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        size={"lg"}
      >
        <Modal.Header>
          <Modal.Title>Tools Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tab === "list" ? (
            <ListTab openCreate={openCreate} openEdit={openEdit} />
          ) : (
            <CreateEditTab openList={openList} editToolId={editToolId} />
          )}
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

export default ToolsModal;

function ListTab(props) {
  const [tools, setTools] = useState([]);
  const [toolTypes, setToolTypes] = useState([]);

  const onDelete = (toolId) => {
    console.log(toolId);
  };

  const onEdit = (toolId) => {
    props.openEdit(toolId);
  };

  useEffect(() => {
    getTools().then((tools) => {
      setTools(tools);
    });
    getToolTypes().then((toolTypes) => {
      setToolTypes(toolTypes);
    });
  }, []);

  const getTypeTitle = (toolTypeId) => {
    if (toolTypes.length == 0) return "";

    let toolType = toolTypes.find((toolType) => toolType.id == toolTypeId);
    return toolType.title;
  };

  return (
    <>
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Fulltext search" />
        <button
          class="btn btn-outline-primary"
          type="button"
          id="button-addon2"
        >
          Search
        </button>
        <button
          class="btn btn-primary"
          type="button"
          onClick={() => {
            props.openCreate();
          }}
        >
          Create
        </button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Tool name</th>
            <th scope="col">Tool type</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => {
            return (
              <tr>
                <td>{tool.title}</td>
                <td>{getTypeTitle(tool.typeId)}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      onClick={() => {
                        onEdit(tool.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() => {
                        onDelete(tool.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function CreateEditTab({ editToolId, openList }) {
  const [toolTypes, setToolTypes] = useState([]);
  const [toolTypeSelected, setToolTypeSelected] = useState(null);
  const [toolTitle, setToolTitle] = useState("");
  const [tool, setTool] = useState({});
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (editToolId) {
      getToolById(editToolId).then((tool) => {
        setTool(tool);
        setToolTitle(tool.title);
        setToolTypeSelected(tool.typeId);
        setFields(tool.fields);
      });
    }

    getToolTypes().then((toolTypes) => {
      setToolTypes(toolTypes);
    });
  }, []);

  const onToolTypeChange = function (e) {
    tool.typeId = null;
    tool.fields = [];

    if (e.target.value) {
      let type = toolTypes.find((type) => {
        console.log(type, e.target.value);
        return type.id == e.target.value;
      });
      if (type) {
        tool.typeId = type.id;
        tool.fields = type.fields.map((field) => Object.assign({}, field));
      }
    }

    setToolTypeSelected(tool.typeId);
    setFields(tool.fields);
  };

  const onFieldValueChange = function (value, fieldName) {
    let field = fields.find((field) => field.inputName === fieldName);
    field.value = value;

    setFields([...tool.fields]);
  };

  const getTypeOptions = () => {
    const options = [];

    options.push(
      <option selected={!toolTypeSelected} value="">
        Choose...
      </option>
    );

    toolTypes.forEach((type, i) => {
      options.push(
        <option key={i} value={type.id} selected={toolTypeSelected == type.id}>
          {type.title}
        </option>
      );
    });
    return options;
  };

  return (
    <>
      <div class="btn-group mb-3" role="group">
        <button
          class="btn btn-secondary"
          type="button"
          onClick={() => {
            openList();
          }}
        >
          Back
        </button>
        <button class="btn btn-primary" type="button">
          Save
        </button>
      </div>
      <div class="input-group mb-2">
        <span class="input-group-text" id="inputGroup-sizing-default">
          Title
        </span>
        <input
          type="text"
          class="form-control"
          placeholder="Tool name"
          value={toolTitle}
          onChange={(e) => setToolTitle(e.target.value)}
        />
      </div>
      <div class="input-group mb-2">
        <label class="input-group-text" for="inputGroupSelect01">
          Tool type
        </label>
        <select
          class="form-select"
          id="inputGroupSelect01"
          onChange={onToolTypeChange}
        >
          {getTypeOptions()}
        </select>
      </div>
      {fields.length === 0 ? (
        <div>Prazdna mnozina</div>
      ) : (
        fields.map((field) => {
          return (
            <div class="input-group mt-2">
              <span class="input-group-text" id="inputGroup-sizing-default">
                {field.label}
              </span>
              <input
                type={field.inputType}
                class="form-control"
                placeholder="Tool name"
                value={field.value}
                onChange={(e) =>
                  onFieldValueChange(e.target.value, field.inputName)
                }
              />
            </div>
          );
        })
      )}
    </>
  );
}
