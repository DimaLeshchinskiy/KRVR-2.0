import { useState } from "react";

export default function FileMaterial({ selectedFile }) {
  const [x, setX] = useState(selectedFile.material.x);
  const [y, setY] = useState(selectedFile.material.y);
  const [z, setZ] = useState(selectedFile.material.z);
  const [width, setWidth] = useState(selectedFile.material.width);
  const [height, setHeight] = useState(selectedFile.material.height);
  const [depth, setDepth] = useState(selectedFile.material.depth);

  const updateMaterial = () => {
    selectedFile.material.x = parseInt(x);
    selectedFile.material.y = parseInt(y);
    selectedFile.material.z = parseInt(z);
    selectedFile.material.width = parseInt(width);
    selectedFile.material.height = parseInt(height);
    selectedFile.material.depth = parseInt(depth);

    console.log(selectedFile.material);
  };

  return (
    <>
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">X:</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            placeholder="X"
            value={x}
            onChange={(e) => {
              setX(e.target.value);
              updateMaterial();
            }}
          />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Y:</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            placeholder="Y"
            value={y}
            onChange={(e) => {
              setY(e.target.value);
              updateMaterial();
            }}
          />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Z:</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            placeholder="Z"
            value={z}
            onChange={(e) => {
              setZ(e.target.value);
              updateMaterial();
            }}
          />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">W:</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            placeholder="Width"
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              updateMaterial();
            }}
          />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">H:</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            placeholder="Height"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              updateMaterial();
            }}
          />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">D:</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            placeholder="Depth"
            value={depth}
            onChange={(e) => {
              setDepth(e.target.value);
              updateMaterial();
            }}
          />
        </div>
      </div>
    </>
  );
}
