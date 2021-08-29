import * as THREE from "three";

export function getBoudingOfObject3D(object3D) {
  return new THREE.Box3().setFromObject(object3D);
}

export function disposeObject3D(object) {
  if (object.geometry) object.geometry.dispose();
  if (object.children) {
    object.children.forEach((objectChildren) => {
      objectChildren.material.dispose();
      objectChildren.geometry.dispose();
    });
  }
  if (object.material) object.material.dispose();
}

export function compareMeshes(mesh1, mesh2) {
  if (mesh1 == mesh2) return true;

  const position1 = mesh1.geometry.getAttribute("position").array;
  const position2 = mesh2.geometry.getAttribute("position").array;
  if (position1.length != position2.length) return false;

  for (let i = 0; i < 9; i++) {
    if (position1[i] != position2[i]) return false;
  }

  return true;
}
