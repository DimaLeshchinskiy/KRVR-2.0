import api from "@config/api.js";

export function getPorts() {
  return new Promise((resolve, reject) => {
    fetch(api.get.ports)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        resolve({ ports: ["COM3", "COM2"] });
      });
  });
}

export function connect(port) {
  return new Promise((resolve, reject) => {
    fetch(api.post.connectPort, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ port: port }),
    }).then(resolve);
  });
}

export function disconnect() {
  return new Promise((resolve, reject) => {
    fetch(api.post.disconnectPort, {
      method: "POST",
    }).then(resolve);
  });
}
