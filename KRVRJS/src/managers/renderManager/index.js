import FileManager from "@managers/fileManager";
import SurfaceSplitterManager from "@managers/surfaceSplitterManager";
import { getBoudingOfObject3D } from "@util/ThreeJS";
import * as THREE from "three";

import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "../../_vendor/ThreeJS/STLLoader";

import api from "@config/api.js";

function loadTexture(url) {
  const loader = new THREE.TextureLoader();
  return loader.load(url);
}

function loadSVG(url) {
  return new Promise((resolve, reject) => {
    const loader = new SVGLoader();
    loader.load(url, resolve);
  });
}

function loadThreeD(url, loader) {
  return new Promise((resolve, reject) => {
    //const loader = new OBJLoader();
    loader.load(url, resolve);
  });
}

function convertStepToStl(text) {
  return new Promise((resolve, reject) => {
    fetch(api.post.convertStep, {
      method: "POST",
      body: text,
    })
      .then((data) => {
        return data.text();
      })
      .then((text) => {
        resolve(text);
      });
  });
}

async function renderRasterImages(files) {
  let promises = files.map((file) => {
    return FileManager.readFile(file, FileManager.Types.DATAURL);
  });

  let values = await Promise.all(promises);
  let meshes = [];

  for (const val of values) {
    const texture = loadTexture(val.data);

    const img = await FileManager.file2img(val.file);

    const materialTexture = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
    });
    const materialBack = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });

    const geometry = new THREE.BoxGeometry(img.width, img.height, 1);

    const materials = [
      materialBack,
      materialBack,
      materialBack,
      materialBack,
      materialTexture,
      materialBack,
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    mesh.userData = {
      id: val.file.id,
      filePosition: val.file.position,
      type: "img",
    };

    meshes.push(mesh);
  }

  return meshes;
}

async function renderVectorImages(files) {
  let promises = files.map((file) => {
    return FileManager.readFile(file, FileManager.Types.DATAURL);
  });

  let values = await Promise.all(promises);
  let meshes = [];

  for (const val of values) {
    const svg = await loadSVG(val.data);

    const paths = svg.paths;
    const group = new THREE.Object3D();
    group.scale.y *= -1;
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      for (let j = 0; j < path.subPaths.length; j++) {
        const subPath = path.subPaths[j];
        console.log(path.userData.style);
        const geometry = SVGLoader.pointsToStroke(
          subPath.getPoints(),
          path.userData.style
        );
        if (geometry) {
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }
    }

    group.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    let box = getBoudingOfObject3D(group);
    group.userData = {
      id: val.file.id,
      filePosition: val.file.position,
      box: box,
      type: "img",
    };

    meshes.push(group);
  }

  return meshes;
}

async function renderThreeDObjects(files) {
  let promises = files.map((file) => {
    return FileManager.readFile(file, FileManager.Types.DATAURL);
  });

  let values = await Promise.all(promises);
  let meshes = [];

  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
  });

  for (const val of values) {
    let loader = null;
    let file = val.file;

    if (file.ext() == "obj") loader = new OBJLoader();
    else if (file.ext() == "stl") loader = new STLLoader();

    const object3D = await loadThreeD(val.data, loader);
    let mesh = null;
    if (object3D instanceof THREE.Group) {
      mesh = object3D.children[0];
      mesh.material = material;
    } else if (object3D instanceof THREE.BufferGeometry) {
      mesh = new THREE.Mesh(object3D, material);
    }

    const surfaces = SurfaceSplitterManager.splitMeshToSurfaces(mesh);
    mesh = SurfaceSplitterManager.makeMeshFromSurfaces(surfaces);
    let box = getBoudingOfObject3D(mesh);

    // mesh.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // mesh.geometry.center();
    // mesh.geometry.computeBoundingBox();
    // let box = mesh.geometry.boundingBox;
    //traslate to min origin

    // mesh.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // mesh.geometry.center();
    // mesh.geometry.computeBoundingBox();
    // let box = mesh.geometry.boundingBox;
    // //traslate to min origin
    // mesh.applyMatrix(new THREE.Matrix4().makeTranslation(0, -box.min.y, 0));

    mesh.userData = {
      id: file.id,
      filePosition: file.position,
      box: box,
      type: "obj",
    };
    meshes.push(mesh);
  }

  return meshes;
}

async function renderStepObjects(files) {
  let promises = files.map((file) => {
    return FileManager.readFile(file, FileManager.Types.TEXT);
  });

  let values = await Promise.all(promises);
  let meshes = [];

  const material = new THREE.MeshNormalMaterial();

  for (const val of values) {
    const stlData = await convertStepToStl(val.data);
    const loader = new STLLoader();

    const object3D = loader.parse(stlData);

    let mesh = null;
    if (object3D instanceof THREE.Group) {
      mesh = object3D.children[0];
      mesh.material = material;
    } else if (object3D instanceof THREE.BufferGeometry) {
      mesh = new THREE.Mesh(object3D, material);
    }

    const surfaces = SurfaceSplitterManager.splitMeshToSurfaces(mesh);
    mesh = SurfaceSplitterManager.makeMeshFromSurfaces(surfaces);
    let box = getBoudingOfObject3D(mesh);

    // mesh.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // mesh.geometry.center();
    mesh.userData = {
      id: val.file.id,
      filePosition: val.file.position,
      box: box,
      type: "obj",
    };

    meshes.push(mesh);
  }

  return meshes;
}

const RenderManager = {
  async render(files) {
    let raster_images = await renderRasterImages(
      files.filter(
        (file) =>
          file.ext() == "jpg" || file.ext() == "png" || file.ext() == "bmp"
      )
    );

    let vector_images = await renderVectorImages(
      files.filter((file) => file.ext() == "svg")
    );

    let threeD_objects = await renderThreeDObjects(
      files.filter((file) => file.ext() == "stl" || file.ext() == "obj")
    );

    let step_objects = await renderStepObjects(
      files.filter((file) => file.ext() == "step")
    );

    return [...threeD_objects, ...step_objects, ...vector_images];
  },
};

export default RenderManager;
