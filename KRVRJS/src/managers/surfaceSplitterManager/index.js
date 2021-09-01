import * as THREE from "three";

/* Code for split meshes to surfaces an then merge it to one mesh */

function mapGeometryToFaces(geometry) {
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");

  const arr = [];
  for (let i = 0; i < positions.array.length; i += 9) {
    const vertices = [];
    for (let j = 0; j < 3; j++) {
      vertices.push({
        x: positions.array[i + j * 3 + 0],
        y: positions.array[i + j * 3 + 1],
        z: positions.array[i + j * 3 + 2],
      });
    }
    arr.push({
      vertices: vertices,
      normal: {
        x: normals.array[i + 0],
        y: normals.array[i + 1],
        z: normals.array[i + 2],
      },
    });
  }
  return arr;
}

function compareFaces(f1, f2, minVerticesNeed = 2) {
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

function hasSameNormal(face1, face2, angleThreshold = 0.98) {
  const normalFaceVector = new THREE.Vector3(
    face1.normal.x,
    face1.normal.y,
    face1.normal.z
  );
  const normalObjectVector = new THREE.Vector3(
    face2.normal.x,
    face2.normal.y,
    face2.normal.z
  );
  return normalFaceVector.dot(normalObjectVector) > angleThreshold;
}

function groupFacesByNormalAndPlane(faces) {
  const groups = [];
  faces.forEach((face) => {
    if (groups.length == 0) {
      groups.push([face]);
    } else {
      for (let i = 0; i < groups.length; i++) {
        if (hasSameNormal(groups[i][0], face)) {
          groups[i].push(face);
          return;
        }
      }

      groups.push([face]);
    }
  });
  return groups;
}

function isNeighbour(s1, s2) {
  for (let i = 0; i < s1.length; i++) {
    for (let j = 0; j < s2.length; j++) {
      if (compareFaces(s1[i], s2[j])) return true;
    }
  }
  return false;
}

function mergeSurfaces(s1, s2) {
  return s1.concat(s2);
}

function getSurfaces(group) {
  let surfaces = group.map((face) => [face]); // each face in group may be surface
  do {
    let newSurfaces = [];
    for (let i = 0; i < surfaces.length; i += 2) {
      if (i == surfaces.length - 1) newSurfaces.push(surfaces[i]);
      else {
        let s1 = surfaces[i + 0];
        let s2 = surfaces[i + 1];
        if (isNeighbour(s1, s2)) newSurfaces.push(mergeSurfaces(s1, s2));
        else newSurfaces.push(s1, s2);
      }
    }

    if (surfaces.length == newSurfaces.length) return newSurfaces;

    surfaces = newSurfaces;
  } while (true);
}

function makeBufferGeometry(surface) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(surface.length * 9);
  const normals = new Float32Array(surface.length * 9);
  const color = new Float32Array(surface.length * 9);

  let index = 0;
  surface.forEach((face) => {
    face.vertices.forEach((vertex) => {
      vertices[index++] = vertex.x;
      vertices[index++] = vertex.y;
      vertices[index++] = vertex.z;
    });
  });

  index = 0;
  surface.forEach((face) => {
    for (let i = 0; i < 3; i++) {
      normals[index++] = face.normal.x;
      normals[index++] = face.normal.y;
      normals[index++] = face.normal.z;
    }
  });

  index = 0;
  surface.forEach(() => {
    for (let i = 0; i < 3; i++) {
      color[index++] = 255;
      color[index++] = 255;
      color[index++] = 255;
    }
  });

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(color, 3));
  return geometry;
}

const SurfaceSplitterManager = {
  makeMeshFromSurfaces(surfaces) {
    const meshes = surfaces.map((surface) => {
      const bufferGeometry = makeBufferGeometry(surface);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
      });

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
      });

      const edges = new THREE.EdgesGeometry(bufferGeometry);
      const line = new THREE.LineSegments(edges, lineMaterial);
      const mesh = new THREE.Mesh(makeBufferGeometry(surface), material);
      mesh.add(line);
      return mesh;
    });

    const parentObject3D = new THREE.Object3D();
    meshes.forEach((mesh) => {
      parentObject3D.add(mesh);
    });

    return parentObject3D;
  },
  splitMeshToSurfaces(mesh) {
    const geometry = mesh.geometry.index
      ? mesh.geometry.toNonIndexed()
      : mesh.geometry;
    const faces = mapGeometryToFaces(geometry);

    const groupsOfFaces = groupFacesByNormalAndPlane(faces);
    let surfaces = [];
    groupsOfFaces.forEach((group) => {
      surfaces = surfaces.concat(getSurfaces(group));
    });
    return surfaces;
  },

  getNeighbourSurfaces(meshes, origin) {
    let neigbours = [origin];
    let mesh = null;
    let cloneMeshes = [...meshes];
    let needToPush = [];
    let notNeedToPush = [];

    while (true) {
      while ((mesh = cloneMeshes.shift())) {
        const meshSurface = mapGeometryToFaces(mesh.geometry);

        const isNeighbor = neigbours.some((neighbour) => {
          const neighbourSurface = mapGeometryToFaces(neighbour.geometry);
          if (!hasSameNormal(meshSurface[0], neighbourSurface[0])) return false;

          for (let i = 0; i < meshSurface.length; i++) {
            for (let j = 0; j < neighbourSurface.length; j++) {
              if (compareFaces(meshSurface[i], neighbourSurface[j])) {
                return true;
              }
            }
          }
          return false;
        });

        if (isNeighbor) needToPush.push(mesh);
        else notNeedToPush.push(mesh);
      }

      if (needToPush.length === 0) return neigbours;

      neigbours = neigbours.concat(needToPush);
      cloneMeshes = notNeedToPush;
      notNeedToPush = [];
      needToPush = [];
    }
  },
};

export default SurfaceSplitterManager;
