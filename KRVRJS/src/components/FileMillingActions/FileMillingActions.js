import { useState, useEffect, useContext } from "react";
import React from "react";

import MillingActionModal from "@modals/MillingActionModal/MillingActionModal";
import { createAction } from "@managers/actionManager";

import { FileContext } from "@context/file";

export default function FileMillingActions(props) {
  const { selectedFile } = useContext(FileContext);
  const [actions, setActions] = useState([]);

  console.log(selectedFile);

  useEffect(() => {
    setActions(selectedFile.millingActions);
  });

  const onAddClick = () => {
    let newActions = [...actions, createAction()];
    selectedFile.millingActions = newActions;
    setActions([...newActions]);
  };

  const onEditClick = (action) => {
    console.log(action);
    let newActions = selectedFile.millingActions.map((_action) => {
      if (_action.id === action.id) _action.isEdit = true;
      return _action;
    });
    selectedFile.millingActions = newActions;
    setActions([...newActions]);
  };

  const onDeleteClick = (action) => {
    console.log(action);
    let newActions = selectedFile.millingActions.filter(
      (_action) => _action.id != action.id
    );
    selectedFile.millingActions = newActions;
    setActions([...newActions]);
  };

  const onSaveAction = (action) => {
    console.log(action);
    let newActions = selectedFile.millingActions.map((_action) => {
      _action.isEdit = false;
      return _action;
    });
    selectedFile.millingActions = newActions;
    setActions([...newActions]);
  };

  return (
    <ul class="list-group list-group-flush">
      {actions.map((action) => {
        return (
          <React.Fragment key={action.id}>
            <div class="card row mb-1 p-1">
              <div class="col-12">{action.title}</div>
              <div class="btn-group col-12">
                <button
                  class="btn btn-outline-primary btn-sm"
                  onClick={() => onEditClick(action)}
                >
                  edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  onClick={() => onDeleteClick(action)}
                >
                  delete
                </button>
              </div>
            </div>
            <MillingActionModal
              action={action}
              onSaveAction={onSaveAction}
              file={selectedFile}
            />
          </React.Fragment>
        );
      })}
      <button
        class="btn btn-outline-primary btn-sm"
        title="Add new action"
        onClick={() => onAddClick()}
      >
        +
      </button>
    </ul>
  );
}
