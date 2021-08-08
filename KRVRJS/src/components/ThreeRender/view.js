import "./view.css";
import React, { Component } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

import { FileContext } from "../../context/file";

import RenderManager from "@managers/renderManager";

class ThreeRender extends Component {
  static contextType = FileContext;

  constructor(props) {
    super(props);
    this.renderThree = this.renderThree.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.cameraPersp = null;
    this.currentCamera = null;
    this.scene = null;
    this.renderer = null;
    this.control = null;
    this.orbit = null;
    this.raycaster = null;
    this.group = null;
  }

  componentDidMount() {
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight;

    this.cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
    this.currentCamera = this.cameraPersp;

    this.currentCamera.position.set(1000, 500, 1000);
    this.currentCamera.lookAt(0, 200, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    const gridHelper = new THREE.GridHelper(10000, 100, 0x888888, 0x444444);
    gridHelper.userData.className = "GridHelper";
    this.scene.add(gridHelper);

    this.orbit = new OrbitControls(
      this.currentCamera,
      this.renderer.domElement
    );
    this.orbit.update();
    this.orbit.addEventListener("change", this.renderThree);

    this.control = new TransformControls(
      this.currentCamera,
      this.renderer.domElement
    );
    this.control.userData.className = "TransformControls";
    // this.control.addEventListener("change", );
    this.control.addEventListener(
      "change",
      function (e) {
        console.log(e);
        this.renderThree();
      }.bind(this)
    );

    this.control.addEventListener(
      "dragging-changed",
      function (event) {
        this.orbit.enabled = !event.value;
      }.bind(this)
    );

    this.scene.add(this.control);

    this.raycaster = new THREE.Raycaster();
    this.renderer.domElement.addEventListener(
      "click",
      function (event) {
        const mouse = new THREE.Vector2();
        mouse.x =
          (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y =
          -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(mouse, this.currentCamera);

        const objects = this.scene.children;
        console.log(objects);
        objects
          .filter((object) => {
            let className = object.userData.className;
            if (className === "GridHelper" || className === "TransformControls")
              return false;
            return true;
          })
          .some((object) => {
            const intersects = this.raycaster.intersectObject(object, true);
            if (intersects.length > 0) {
              const selectedObject = intersects[0].object;
              if (
                this.control.object === undefined ||
                this.control.object !== selectedObject
              ) {
                this.control.attach(selectedObject);

                const { files, setSelectedFile } = this.context;
                const file = files.find((f) => {
                  if (f.id === selectedObject.userData.id) return true;
                  return false;
                });
                setSelectedFile(file);

                this.renderThree();
                return true;
              }
            }
          });
      }.bind(this)
    );

    window.addEventListener("resize", this.onWindowResize);

    window.addEventListener(
      "keydown",
      function (event) {
        switch (event.keyCode) {
          case 81: // Q
            this.control.setSpace(
              this.control.space === "local" ? "world" : "local"
            );
            break;

          case 16: // Shift
            this.control.setTranslationSnap(100);
            this.control.setRotationSnap(THREE.MathUtils.degToRad(15));
            this.control.setScaleSnap(0.25);
            break;

          case 87: // W
            this.props.setEditTool("translate");
            break;

          case 69: // E
            this.props.setEditTool("rotate");
            break;

          case 82: // R
            this.props.setEditTool("scale");
            break;
          case 187:
          case 107: // +, =, num+
            this.control.setSize(this.control.size + 0.1);
            break;

          case 189:
          case 109: // -, _, num-
            this.control.setSize(Math.max(this.control.size - 0.1, 0.1));
            break;

          case 88: // X
            this.control.showX = !this.control.showX;
            break;

          case 89: // Y
            this.control.showY = !this.control.showY;
            break;

          case 90: // Z
            this.control.showZ = !this.control.showZ;
            break;

          case 32: // Spacebar
            this.control.enabled = !this.control.enabled;
            break;
        }
      }.bind(this)
    );

    window.addEventListener(
      "keyup",
      function (event) {
        switch (event.keyCode) {
          case 16: // Shift
            this.control.setTranslationSnap(null);
            this.control.setRotationSnap(null);
            this.control.setScaleSnap(null);
            break;
        }
      }.bind(this)
    );

    this.renderThree();
  }

  componentWillUnmount() {
    console.log("unmount Main view");
    //free RAM memory
    this.scene.children.forEach((object) => {
      console.log(object);
      object.geometry.dispose();
      object.material.dispose();
    });
    this.renderer.dispose();
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    this.cameraPersp.aspect = aspect;
    this.cameraPersp.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderThree();
  }

  renderThree() {
    this.renderer.render(this.scene, this.currentCamera);
  }

  componentDidUpdate() {
    //setup tool
    this.control.setMode(this.props.editTool);

    //files
    const { files, selectedFile } = this.context;

    this.scene.children.forEach((object) => {
      let className = object.userData.className;
      if (className === "GridHelper" || className === "TransformControls")
        return;
      if (
        !files.some((file) => {
          return file.id === object.userData.id;
        })
      ) {
        if (this.control.object == object) this.control.detach();
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    });

    RenderManager.render(files).then((meshes) => {
      meshes
        .filter((mesh) => {
          return !this.scene.children.some((object) => {
            return mesh.userData.id === object.userData.id;
          });
        })
        .forEach((mesh) => {
          this.scene.add(mesh);
        });

      if (selectedFile && selectedFile.id) {
        this.control.detach();
        this.scene.children.forEach((mesh) => {
          if (mesh.userData.id === selectedFile.id) this.control.attach(mesh);
        });
      }

      this.renderThree();
    });
  }

  render() {
    return <></>;
  }
}

export default ThreeRender;
