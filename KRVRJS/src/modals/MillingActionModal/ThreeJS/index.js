import "./style.css";
import React, { Component } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import RenderManager from "@managers/renderManager";
import SurfaceSplitterManager from "@managers/surfaceSplitterManager";

import { disposeObject3D, compareMeshes } from "@util/ThreeJS";

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

const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
});

class ThreeRender extends Component {
  constructor(props) {
    super(props);
    this.state = { renderedMesh: null };

    this.renderThree = this.renderThree.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.getCanvasRelativePosition = this.getCanvasRelativePosition.bind(this);
    this.getRenderedMesh = this.getRenderedMesh.bind(this);
    this.showSelectedSurface = this.showSelectedSurface.bind(this);

    this.cameraPersp = null;
    this.scene = null;
    this.light = null;
    this.orbit = null;
    this.raycaster = null;
    this.group = null;

    this.viewRef = React.createRef();
  }

  componentDidMount() {
    const dimension = getDimension();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(dimension.width, dimension.height);
    this.viewRef.current.appendChild(renderer.domElement);

    const aspect = dimension.width / dimension.height;

    this.cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);

    this.cameraPersp.position.set(1000, 500, 1000);
    this.cameraPersp.lookAt(0, 200, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    const gridHelper = new THREE.GridHelper(10000, 1000, 0x888888, 0x444444);
    gridHelper.userData.className = "GridHelper";
    this.scene.add(gridHelper);

    this.light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
    this.light.userData.className = "HemisphereLight";
    this.scene.add(this.light);

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
              if (className === "GridHelper") return false;
              return true;
            })
            .some((object) => {
              const intersects = this.raycaster.intersectObject(object, true);
              if (intersects.length > 0) {
                let selectedObject = intersects[0].object;
                if (selectedObject.type == "LineSegments")
                  selectedObject = selectedObject.parent;
                let parentObject = selectedObject.parent;

                const neighbours = SurfaceSplitterManager.getNeighbourSurfaces(
                  parentObject.children,
                  selectedObject
                );

                this.props.onPick(neighbours, this.props.pickPropertyName);
              }
            });
        }
      }.bind(this)
    );

    window.addEventListener("resize", this.onWindowResize);

    const file = this.props.file;
    RenderManager.render([file]).then((meshes) => {
      const mesh = meshes[0];

      //apply file postion to mesh
      let { x, y, z } = mesh.userData.filePosition;
      let box = mesh.userData.box;
      mesh.applyMatrix(
        new THREE.Matrix4().makeTranslation(x, y - box.min.y, z)
      );
      this.scene.add(mesh);

      this.showSelectedSurface();
      this.renderThree();
    });
  }

  componentWillUnmount() {
    console.log("unmount");
    //free RAM memory
    this.scene.children.forEach((object) => {
      disposeObject3D(object);
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

  getRenderedMesh() {
    return this.scene.children.find((object) => {
      return object.userData.type === "obj";
    });
  }

  showSelectedSurface() {
    const renderedMesh = this.getRenderedMesh();
    if (!renderedMesh) return;
    const renderedSurfaceMeshes = renderedMesh.children;

    renderedSurfaceMeshes.forEach((mesh) => {
      mesh.material.color.setHex(0x0000ff);
      mesh.material.needsUpdate = true;
    });

    this.props.faceInputFields.forEach((field) => {
      if (field.value && field.value.length) {
        field.value.forEach((mesh) => {
          const thisMesh = renderedSurfaceMeshes.find((m) => {
            return compareMeshes(m, mesh);
          });
          if (thisMesh) {
            thisMesh.material.color.setHex(0xffffff);
            thisMesh.material.needsUpdate = true;
          }
        });
      }
    });
  }

  componentDidUpdate() {
    this.showSelectedSurface();
    this.renderThree();
  }

  render() {
    return <div ref={this.viewRef}></div>;
  }
}

export default ThreeRender;
