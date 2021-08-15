import FileManager from "../fileManager";
import * as THREE from "three";

import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "../../_vendor/ThreeJS/STLLoader";

import api from "@config/api.js";

function loadTexture(url) {
  const loader = new THREE.TextureLoader();
  return loader.load(url);
}

function loadSVG(url, image) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");

    const img = document.createElement("img");
    img.setAttribute("src", url);

    img.onload = function () {
      ctx.drawImage(img, 0, 0);

      var texture = new THREE.Texture(canvas);
      resolve(texture);
    };
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
  /*let promises = files.map(file => {
    return FileManager.readFile(file, FileManager.Types.DATAURL);
  });

  let values = await Promise.all(promises);
  let meshes = [];

  for(const val of values){
    const svg = await loadSVG(val.data);

    console.log(svg);

    const paths = svg.paths;
    const geometries = [];
		const group = new THREE.Object3D()
    const material = new THREE.MeshBasicMaterial( {
      color: 0x000000
    } );

		for ( let i = 0; i < paths.length; i ++ ) {

			const path = paths[ i ];

			const shapes = SVGLoader.createShapes( path );

			for ( let j = 0; j < shapes.length; j++ ) {

				const shape = shapes[ j ];
				const geometry = new THREE.ShapeGeometry( shape );
				const mesh = new THREE.Mesh( geometry, material );
				group.add( mesh );

			}

		}

    group.applyMatrix4( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
    group.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI ) );
    group.userData = {
      id: val.file.id,
      type: "svg"
    };

		meshes.push(group);

  }

  return meshes;*/

  let promises = files.map((file) => {
    return FileManager.readFile(file, FileManager.Types.DATAURL);
  });

  let values = await Promise.all(promises);
  let meshes = [];

  for (const val of values) {
    const img = await FileManager.file2img(val.file);
    const texture = await loadSVG(val.data, img);

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

    mesh.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    mesh.geometry.center();
    mesh.geometry.computeBoundingBox();
    let box = mesh.geometry.boundingBox;
    //traslate to min origin
    mesh.applyMatrix(new THREE.Matrix4().makeTranslation(0, -box.min.y, 0));

    mesh.userData = {
      id: file.id,
      filePosition: file.position,
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

    mesh.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    mesh.geometry.center();
    mesh.userData = {
      id: val.file.id,
      filePosition: val.file.position,
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

    return [...threeD_objects, ...step_objects];
  },
};

export default RenderManager;
