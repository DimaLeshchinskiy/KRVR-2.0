import { useState, useContext } from "react";
import { FileContext } from "@context/file";

export default function FileMaterial() {
  const { selectedFileId, getSelectedFile } = useContext(FileContext);

  const selectedFile = getSelectedFile();

  const [x, setX] = useState(selectedFile ? selectedFile.material.x : 0);
  const [y, setY] = useState(selectedFile ? selectedFile.material.y : 0);
  const [z, setZ] = useState(selectedFile ? selectedFile.material.z : 0);
  const [width, setWidth] = useState(
    selectedFile ? selectedFile.material.width : 0
  );
  const [height, setHeight] = useState(
    selectedFile ? selectedFile.material.height : 0
  );
  const [depth, setDepth] = useState(
    selectedFile ? selectedFile.material.depth : 0
  );

  const updateMaterial = () => {
    const selectedFile = getSelectedFile();
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
