import Action from "@models/Action.js";
import actionsJSON from "@data/actions.js";
import actionTypesJSON from "@data/actionTypes.js";
import api from "@config/api.js";

export function createAction() {
  return {
    id: Date.now(),
    typeId: null,
    typeTitle: null,
    toolId: null,
    title: "Empty Action",
    fields: [],
    isEdit: false,
  };
}

export function getActions() {
  return new Promise((resolve, reject) => {
    fetch(api.get.actions)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve(actionsJSON);
      });
  });
}

export function getActionTypes() {
  return new Promise((resolve, reject) => {
    fetch(api.get.actionTypes)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve(actionTypesJSON);
      });
  });
}

export function getActionById(actionId) {
  return new Promise((resolve, reject) => {
    fetch(`${api.get.actions}?actionId=${actionId}`)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve(actionsJSON.find((action) => action.id === actionId));
      });
  });
}

export function serializeAction(action) {
  const actionJsonRepre = {
    id: action.id,
    toolId: action.toolId,
    typeId: action.typeId,
    title: action.title,
    fields: [],
  };

  action.fields.forEach((field) => {
    const fieldJsonRepre = {
      label: field.label,
      inputType: field.inputType,
      inputName: field.inputName,
      value: null,
    };

    if (field.value && field.inputType === "number")
      fieldJsonRepre.value = getNumberFieldValue(field);
    if (field.value && field.inputType === "face")
      fieldJsonRepre.value = getFaceFieldValue(field);

    actionJsonRepre.fields.push(fieldJsonRepre);
  });

  return actionJsonRepre;
}

const getNumberFieldValue = (field) => {
  return field.value;
};

const getFaceFieldValue = (field) => {
  return field.value.map((mesh) => {
    console.log(mesh);
    return mesh.geometry.toJSON();
  });
};
