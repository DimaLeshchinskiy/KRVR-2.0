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
