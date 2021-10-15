import api from "@config/api.js";

export function sendCommand(command) {
  return new Promise((resolve, reject) => {
    fetch(api.post.asyncCommand, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command: command }),
    }).then(resolve);
  });
}

export function resume() {
  return new Promise((resolve, reject) => {
    fetch(api.post.resume, {
      method: "POST",
    }).then(resolve);
  });
}

export function pause(command) {
  return new Promise((resolve, reject) => {
    fetch(api.post.pause, {
      method: "POST",
    }).then(resolve);
  });
}

export function stop(command) {
  return new Promise((resolve, reject) => {
    fetch(api.post.stop, {
      method: "POST",
    }).then(resolve);
  });
}
