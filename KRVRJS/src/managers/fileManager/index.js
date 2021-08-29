import File from "@models/File.js";
import Material from "@models/Material.js";
import { serializeAction } from "@managers/actionManager";
import RenderManager from "@managers/renderManager";
import { getBoudingOfObject3D } from "@util/ThreeJS";

const Types = {
  TEXT: "text",
  ARRBUFF: "arr_buffer",
  DATAURL: "data_url",
};

const availableExtensions = [
  "jpg",
  "png",
  "bmp",
  "obj",
  "stl",
  "svg",
  "obj",
  "step",
];

class FileManager {
  static load(uploadedFile) {
    let ext = uploadedFile.name.split(".").pop();
    if (!availableExtensions.includes(ext)) return null;

    console.log(uploadedFile);
    const file = new File();
    file.name = uploadedFile.name;
    file.file = uploadedFile;
    file.size = uploadedFile.size;
    file.material = new Material();

    return file;
  }

  // param file as model.File
  static readFile(file, flag = FileManager.Types.TEXT) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve({
          data: fr.result,
          file: file,
        });
      };
      fr.onerror = reject;

      switch (flag) {
        case Types.TEXT:
          fr.readAsText(file.file);
          break;
        case Types.ARRBUFF:
          fr.readAsArrayBuffer(file.file);
          break;
        case Types.DATAURL:
          fr.readAsDataURL(file.file);
          break;
        default:
          reject();
      }
    });
  }

  static file2img(file) {
    return new Promise((resolve, reject) => {
      FileManager.readFile(file, Types.DATAURL).then((res) => {
        const image = new Image();

        image.onload = () => {
          resolve(image);
        };

        image.src = res.data;
      });
    });
  }

  static uploadFiles(files) {
    let url = "/upload";
    let formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    fetch(url, {
      method: "POST",
      body: formData,
    });
  }

  static async serializeFile(file) {
    const fileJsonRepre = {
      id: file.id,
      name: file.name,
      extension: file.ext(),
      fileData: (await FileManager.readFile(file)).data,
      objectOptions: {},
      millingActions: [],
      material: {
        x: file.material.x,
        y: file.material.y,
        z: file.material.z,
        width: file.material.width,
        height: file.material.height,
        depth: file.material.depth,
      },
    };

    file.millingActions.forEach((action) => {
      fileJsonRepre.millingActions.push(serializeAction(action));
    });

    let mesh = (await RenderManager.render([file]))[0];
    let box = getBoudingOfObject3D(mesh);

    fileJsonRepre.objectOptions["size"] = {
      min: box.min,
      max: box.max,
    };

    fileJsonRepre.objectOptions["position"] = file.position;

    return fileJsonRepre;
  }
}

FileManager.Types = Types;
export default FileManager;
