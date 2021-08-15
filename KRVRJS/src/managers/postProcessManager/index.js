import FileManager from "@managers/fileManager";
import api from "@config/api.js";

var _options = {
  feedRate: 100,
  power: 255,
};

export async function postProcess(files, options = {}) {
  Object.assign(_options, options);

  const json = {
    files: [],
    options: _options,
  };

  if (files) {
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      json.files.push(await FileManager.serializeFile(files[i]));
    }

    send(json);
  }
}

function send(json) {
  console.log(json);

  fetch(api.post.postProcess, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
}
