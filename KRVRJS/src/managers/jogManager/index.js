import api from "@config/api.js";

export function sendJogData(data) {
  return new Promise((resolve, reject) => {
    fetch(api.post.jog, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    }).then(resolve);
  });
}
