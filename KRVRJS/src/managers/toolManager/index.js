import toolsJSON from "@data/tools.js";
import toolTypesJSON from "@data/toolTypes.js";
import api from "@config/api.js";

export function getTools() {
  return new Promise((resolve, reject) => {
    fetch(api.get.tools)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve(toolsJSON);
      });
  });
}

export function getToolTypes() {
  return new Promise((resolve, reject) => {
    fetch(api.get.toolTypes)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve(toolTypesJSON);
      });
  });
}

export function getToolById(toolId) {
  return new Promise((resolve, reject) => {
    fetch(`${api.get.tool}?toolId=${toolId}`)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve(toolsJSON.find((tool) => tool.id === toolId));
      });
  });
}
