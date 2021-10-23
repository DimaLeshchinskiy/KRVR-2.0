import "./SketchEditor.css";

import React, { useState, useEffect, useContext } from "react";
import { fabric } from "fabric";

import RectDraw from "./RectDraw.js";
import CircleDraw from "./CircleDraw.js";

import FileManager from "@managers/fileManager";
import { FileContext } from "@context/file";

import Dropdown from "react-bootstrap/Dropdown";

import config from "./config";

function SketchEditor({ handleClose }) {
  const [canvas, setCanvas] = useState(null);
  const [toolMode, setToolMode] = useState(1);
  const [strokeWidth, setStrokeWidth] = useState(3);

  const { files, setFiles } = useContext(FileContext);

  const [workspaceWidth, setWorkspaceWidth] = useState(60);
  const [workspaceHeight, setWorkspaceHeight] = useState(40);

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    if (canvas) changeTool(1);
  }, [canvas]);

  const handleStrokeWidthChange = (value) => {
    setStrokeWidth(value);
    changeTool(toolMode);
  };

  const initCanvas = () => {
    let newCanvas = new fabric.Canvas("canvas", {
      height: 400,
      width: 600,
      isDrawingMode: false,
    });

    var bg = new fabric.Rect({
      width: workspaceWidth,
      height: workspaceHeight,
      stroke: "red",
      strokeWidth: 1,
      fill: "",
      evented: false,
      selectable: false,
      id: "my-workspace",
    });

    newCanvas.add(bg);

    // TODO - rewrite
    newCanvas.setZoom(9);
    var vpt = newCanvas.viewportTransform;
    vpt[4] = (newCanvas.getWidth() - workspaceWidth * 9) / 2;
    vpt[5] = (newCanvas.getHeight() - workspaceHeight * 9) / 2;
    // TODO - rewrite

    newCanvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = newCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.viewportTransform;
      if (zoom < newCanvas.getHeight() / workspaceHeight) {
        vpt[4] = (newCanvas.getWidth() - workspaceWidth * zoom) / 2;
        vpt[5] = (newCanvas.getHeight() - workspaceHeight * zoom) / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] <= newCanvas.getWidth() - workspaceWidth * zoom) {
          vpt[4] = newCanvas.getWidth() - workspaceWidth * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] <= newCanvas.getHeight() - workspaceHeight * zoom) {
          vpt[5] = newCanvas.getHeight() - workspaceHeight * zoom;
        }
      }
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
        var zoom = newCanvas.getZoom();
        var vpt = this.viewportTransform;
        if (zoom < newCanvas.getHeight() / workspaceHeight) {
          vpt[4] = (newCanvas.getWidth() - workspaceWidth * zoom) / 2;
          vpt[5] = (newCanvas.getHeight() - workspaceHeight * zoom) / 2;
        } else {
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          if (vpt[4] >= 0) {
            vpt[4] = 0;
          } else if (
            vpt[4] <=
            newCanvas.getWidth() - workspaceWidth * zoom - 400
          ) {
            vpt[4] = newCanvas.getWidth() - workspaceWidth * zoom - 400;
          }
          if (vpt[5] >= 0) {
            vpt[5] = 0;
          } else if (
            vpt[5] <=
            newCanvas.getHeight() - workspaceHeight * zoom - 400
          ) {
            vpt[5] = newCanvas.getHeight() - workspaceHeight * zoom - 400;
          }
        }
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    newCanvas.on("mouse:up", function (opt) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });

    newCanvas.requestRenderAll();

    return newCanvas;
  };

  const changeTool = (mode) => {
    canvas.off("selection:created", deleteElement);
    // hand tool
    if (mode == 0) {
      canvas.isDrawingMode = false;
      canvas.selection = true;
    }
    // brush tool
    else if (mode == 1) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
    }
    // circle tool
    else if (mode == 2) {
      CircleDraw(canvas, {
        strokeWidth: strokeWidth,
        onDrawCircle: () => setToolMode(0),
      });
    }
    // rect tool
    else if (mode == 3) {
      RectDraw(canvas, {
        strokeWidth: strokeWidth,
        onDrawRect: () => setToolMode(0),
      });
    }
    // delete tool
    else if (mode == 4) {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.on("selection:created", deleteElement);
    }
    setToolMode(mode);
  };

  const insertIcon = (elementDom) => {
    let svgElement = elementDom.getElementsByTagName("svg")[0];

    if (!svgElement) return;

    fabric.loadSVGFromString(svgElement.outerHTML, function (objects, options) {
      let obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();

      changeTool(0);
    });
  };

  const deleteElement = (e) => {
    console.log(e);
    e.selected.forEach((element) => {
      canvas.remove(element);
    });
  };

  const exportAsSvg = () => {
    const canvasObject = canvas.getObjects().find((item) => {
      console.log(item, item.id);
      return item.id == "my-workspace";
    });
    canvas.remove(canvasObject);
    let svg = canvas.toSVG();
    console.log(svg);
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
            onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
          />
          <label for="floatingInputGrid">stroke</label>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Insert icon
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {config.iconsToInsert.map((el, index) => {
              return (
                <Dropdown.Item
                  key={index}
                  onClick={(e) => insertIcon(e.target)}
                >
                  {el.svg} &nbsp; &nbsp;{el.title}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <button type="button" class="btn btn-success" onClick={exportAsSvg}>
          Export As Svg
        </button>
      </div>
      <canvas id="canvas" />
    </div>
  );
}

export default SketchEditor;
