import "./SketchEditor.css";

import React, { useState, useEffect, useContext } from "react";
import { fabric } from "fabric";

import RectDraw from "./RectDraw.js";
import CircleDraw from "./CircleDraw.js";

import FileManager from "@managers/fileManager";
import { FileContext } from "@context/file";

import config from "./config";

function SketchEditor({ handleClose }) {
  const [canvas, setCanvas] = useState("");
  const [toolMode, setToolMode] = useState(1);
  const [strokeWidth, setStrokeWidth] = useState(3);

  const { files, setFiles } = useContext(FileContext);

  useEffect(() => {
    setCanvas(initCanvas());
    setToolMode(1);
  }, []);

  const initCanvas = () => {
    let newCanvas = new fabric.Canvas("canvas", {
      height: 400,
      width: 600,
      isDrawingMode: false,
    });

    newCanvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = newCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    newCanvas.on("mouse:down", function (opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    newCanvas.on("mouse:move", function (opt) {
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });
    newCanvas.on("mouse:up", function (opt) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });

    return newCanvas;
  };

  const changeTool = (mode) => {
    // hand tool
    if (mode == 0) {
      canvas.isDrawingMode = false;
      canvas.selection = true;
    }
    // brush tool
    else if (mode == 1) {
      canvas.isDrawingMode = true;
    }
    // circle tool
    else if (mode == 2) {
      CircleDraw(canvas, () => setToolMode(0));
    }
    // rect tool
    else if (mode == 3) {
      RectDraw(canvas, () => setToolMode(0));
    }
    setToolMode(mode);
  };

  const exportAsSvg = () => {
    let svg = canvas.toSVG();
    const newFiles = [...files];

    let file = new File([svg], "mySvg.svg", {
      type: "text/plain",
    });
    let modelFile = FileManager.load(file);
    if (modelFile) newFiles.push(modelFile);

    setFiles(newFiles);

    handleClose();
  };

  return (
    <div class="editor">
      <div class="editor_toolbar">
        {config.tools.map((el) => {
          let className = ["editor_tool"];
          if (el.id == toolMode) className.push("active");

          return (
            <div class={className.join(" ")} onClick={() => changeTool(el.id)}>
              {el.svg}
            </div>
          );
        })}
        <div class="form-floating">
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            class="form-control"
            id="floatingInputGrid"
            placeholder="f"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(e.target.value)}
          />
          <label for="floatingInputGrid">stroke</label>
        </div>
        <button type="button" class="btn btn-success" onClick={exportAsSvg}>
          Export As Svg
        </button>
      </div>
      <canvas id="canvas" />
    </div>
  );
}

export default SketchEditor;
