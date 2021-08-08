import "./style.css";
import React, { Component } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import RenderManager from "../../../managers/renderManager";

const getDimension = (object, originFace) => {
  const screenWidth = window.innerWidth;

  if (screenWidth >= 1200) {
    return {
      width: 545,
      height: 351,
    };
  }

  if (screenWidth >= 992) {
    return {
      width: 375,
      height: 351,
    };
  }

  return {
    width: 225,
    height: 206,
  };
};

function getFace(geometry, originFace) {
  const face = { vertices: [], normal: null };

  const vertices = geometry.getAttribute("position").array;
  const { a, b, c, normal } = originFace;

  face.vertices.push({
    x: vertices[a * 3],
    y: vertices[a * 3 + 1],
    z: vertices[a * 3 + 2],
  });

  face.vertices.push({
    x: vertices[b * 3],
    y: vertices[b * 3 + 1],
    z: vertices[b * 3 + 2],
  });

  face.vertices.push({
    x: vertices[c * 3],
    y: vertices[c * 3 + 1],
    z: vertices[c * 3 + 2],
  });

  face.normal = normal;

  return face;
}

function getAllFaces(geometry) {
  const faces = [];

  const vertices = geometry.getAttribute("position").array;
  const normals = geometry.getAttribute("normal").array;

  for (let i = 0; i < vertices.length; i += 9) {
    const face = { vertices: [], normal: null };
    for (let j = 0; j < 9; j += 3) {
      face.vertices.push({
        x: vertices[i + j],
        y: vertices[i + j + 1],
        z: vertices[i + j + 2],
      });
    }

    face.normal = new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]);

    faces.push(face);
  }

  return faces;
}

function compareFaces(f1, f2, minVerticesNeed = 3) {
  let countOfEqualsVertex = 0;

  for (let i = 0; i < f1.vertices.length; i++) {
    for (let j = 0; j < f2.vertices.length; j++) {
      if (
        f1.vertices[i].x === f2.vertices[j].x &&
        f1.vertices[i].y === f2.vertices[j].y &&
        f1.vertices[i].z === f2.vertices[j].z
      )
        countOfEqualsVertex++;

      if (countOfEqualsVertex === minVerticesNeed) return true;
    }
  }

  return false;
}

function makePlane(face) {
  const A = new THREE.Vector3(
    face.vertices[0].x,
    face.vertices[0].y,
    face.vertices[0].z
  );

  const B = new THREE.Vector3(
    face.vertices[1].x,
    face.vertices[1].y,
    face.vertices[1].z
  );

  const C = new THREE.Vector3(
    face.vertices[2].x,
    face.vertices[2].y,
    face.vertices[2].z
  );

  return new THREE.Plane().setFromCoplanarPoints(A, B, C);
}

function removeOriginFace(faces, originFace) {
  return faces.filter((face) => {
    return !compareFaces(face, originFace);
  });
}

function filterByNormal(faces, normal) {
  return faces.filter((face) => {
    // filter by normal, must have same normal vector
    return face.normal.dot(normal) == 1;
  });
}

function filterByPlane(faces, plane) {
  return faces.filter((face) => {
    // filter by plane, must be on the same plane
    const point = new THREE.Vector3(
      face.vertices[0].x,
      face.vertices[0].y,
      face.vertices[0].z
    );
    return plane.distanceToPoint(point) == 0;
  });
}

function filterByNeighbor(faces, faceOrigin) {
  let nieghborFaces = [faceOrigin];
  let face = null;
  let needToPush = [];
  let notNeedToPush = [];

  while (true) {
    while ((face = faces.shift())) {
      const isNeighbor = nieghborFaces.some((nieghborFace) => {
        return compareFaces(nieghborFace, face, 2);
      });

      if (isNeighbor) needToPush.push(face);
      else notNeedToPush.push(face);
    }

    if (needToPush.length === 0) return nieghborFaces;

    nieghborFaces = nieghborFaces.concat(needToPush);
    faces = notNeedToPush;
    notNeedToPush = [];
    needToPush = [];
  }
}

function findNeighborFaces(object, originFace) {
  const geometry = object.geometry.toNonIndexed();
  const face = getFace(geometry, originFace);
  let faces = getAllFaces(geometry);
  // console.log("All", faces, face);
  faces = removeOriginFace(faces, face);
  // console.log("Remove origin", faces, faces.length);
  faces = filterByNormal(faces, originFace.normal);
  // console.log("Normal filter", faces, faces.length);
  faces = filterByPlane(faces, makePlane(face));
  // console.log("Plane filter", faces, faces.length);
  faces = filterByNeighbor(faces, face);
  // console.log("Result", faces, faces.length);
  return faces;
}

function makeBufferGeometry(faces) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(faces.length * 9);
  const normals = new Float32Array(faces.length * 9);
  const color = new Float32Array(faces.length * 9);

  let index = 0;
  faces.forEach((face) => {
    face.vertices.forEach((vertex) => {
      vertices[index++] = vertex.x;
      vertices[index++] = vertex.y;
      vertices[index++] = vertex.z;
    });
  });

  index = 0;
  faces.forEach((face) => {
    for (let i = 0; i < 3; i++) {
      normals[index++] = face.normal.x;
      normals[index++] = face.normal.y;
      normals[index++] = face.normal.z;
    }
  });

  index = 0;
  faces.forEach(() => {
    for (let i = 0; i < 3; i++) {
      color[index++] = 255;
      color[index++] = 0;
      color[index++] = 0;
    }
  });

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(color, 3));
  return geometry;
}

function makeMesh(geometry, property_name) {
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    vertexColors: THREE.VertexColors,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  mesh.userData = {
    type: "select",
    property_name: property_name,
  };
  return mesh;
}

const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
});

class ThreeRender extends Component {
  constructor(props) {
    super(props);
    this.renderThree = this.renderThree.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getCanvasRelativePosition = this.getCanvasRelativePosition.bind(this);
    this.addSelectedFace = this.addSelectedFace.bind(this);

    this.cameraPersp = null;
    this.scene = null;
    // renderer = null;
    this.orbit = null;
    this.raycaster = null;
    this.group = null;

    this.viewRef = React.createRef();
  }

  componentDidMount() {
    const dimension = getDimension();

    // renderer = new THREE.WebGLRenderer({
    //   powerPreference: "high-performance",
    // });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(dimension.width, dimension.height);
    this.viewRef.current.appendChild(renderer.domElement);

    const aspect = dimension.width / dimension.height;

    this.cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);

    this.cameraPersp.position.set(1000, 500, 1000);
    this.cameraPersp.lookAt(0, 200, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    const gridHelper = new THREE.GridHelper(10000, 100, 0x888888, 0x444444);
    gridHelper.userData.className = "GridHelper";
    this.scene.add(gridHelper);

    this.orbit = new OrbitControls(this.cameraPersp, renderer.domElement);
    this.orbit.update();
    this.orbit.addEventListener("change", this.renderThree);

    this.raycaster = new THREE.Raycaster();
    var inst = this;
    renderer.domElement.addEventListener(
      "click",
      function (event) {
        if (inst.props.isPickModeEnable) {
          const mouse = new THREE.Vector2();
          const pos = this.getCanvasRelativePosition(event);
          mouse.x = (pos.x / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -(pos.y / renderer.domElement.clientHeight) * 2 + 1;
          this.raycaster.setFromCamera(mouse, this.cameraPersp);

          const objects = this.scene.children;
          objects
            .filter((object) => {
              let className = object.userData.className;
              let type = object.userData.type;
              if (className === "GridHelper") return false;
              if (type === "select") return false;
              return true;
            })
            .some((object) => {
              const intersects = this.raycaster.intersectObject(object, true);
              if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                const selectedFace = intersects[0].face;

                const faces = findNeighborFaces(selectedObject, selectedFace);
                const bufferGeometry = makeBufferGeometry(faces);
                this.props.onPick(bufferGeometry, this.props.pickPropertyName);
              }
            });
        }
      }.bind(this)
    );

    window.addEventListener("resize", this.onWindowResize);

    const file = this.props.file;
    RenderManager.render([file]).then((meshes) => {
      this.scene.add(meshes[0]);

      this.addSelectedFace();
      this.renderThree();
    });
  }

  componentWillUnmount() {
    console.log("unmount");
    //free RAM memory
    this.scene.children.forEach((object) => {
      console.log(object);
      object.geometry.dispose();
      object.material.dispose();
    });
  }

  getCanvasRelativePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    return {
      x:
        ((event.clientX - rect.left) * renderer.domElement.clientWidth) /
        rect.width,
      y:
        ((event.clientY - rect.top) * renderer.domElement.clientHeight) /
        rect.height,
    };
  }

  onWindowResize() {
    const dimension = getDimension();

    const aspect = dimension.width / dimension.height;

    this.cameraPersp.aspect = aspect;
    this.cameraPersp.updateProjectionMatrix();

    renderer.setSize(dimension.width, dimension.height);

    this.renderThree();
  }

  renderThree() {
    renderer.render(this.scene, this.cameraPersp);
  }

  addSelectedFace() {
    [...this.scene.children].forEach((object) => {
      let type = object.userData.type;
      if (type === "select") {
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    });

    this.props.faceInputFields.forEach((field) => {
      if (field.value) {
        const mesh = makeMesh(field.value, field.fieldName);
        this.scene.add(mesh);
        this.renderThree();
      }
    });
    this.renderThree();
  }

  componentDidUpdate() {
    this.addSelectedFace();
  }

  render() {
    return <div ref={this.viewRef}></div>;
  }
}

export default ThreeRender;
