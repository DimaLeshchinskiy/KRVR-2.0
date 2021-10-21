import { fabric } from "fabric";

function CircleDraw(canvas, options) {
  var ellipse, isDown, origX, origY;

  const onMouseMove = (o) => {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    var rx = Math.abs(origX - pointer.x) / 2;
    var ry = Math.abs(origY - pointer.y) / 2;
    if (rx > ellipse.strokeWidth) {
      rx -= ellipse.strokeWidth / 2;
    }
    if (ry > ellipse.strokeWidth) {
      ry -= ellipse.strokeWidth / 2;
    }
    ellipse.set({ rx: rx, ry: ry });

    if (origX > pointer.x) {
      ellipse.set({ originX: "right" });
    } else {
      ellipse.set({ originX: "left" });
    }
    if (origY > pointer.y) {
      ellipse.set({ originY: "bottom" });
    } else {
      ellipse.set({ originY: "top" });
    }
    canvas.renderAll();
  };

  const onMouseDown = (o) => {
    isDown = true;
    var pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    ellipse = new fabric.Ellipse({
      left: origX,
      top: origY,
      originX: "left",
      originY: "top",
      rx: pointer.x - origX,
      ry: pointer.y - origY,
      angle: 0,
      fill: "",
      stroke: "black",
      strokeWidth: options.strokeWidth,
      lockRotation: true,
    });
    canvas.add(ellipse);
  };

  const onMouseUp = (o) => {
    isDown = false;
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:up", onMouseUp);
    options.onDrawCircle();
  };

  canvas.isDrawingMode = false;
  canvas.selection = false;

  canvas.on("mouse:down", onMouseDown);

  canvas.on("mouse:move", onMouseMove);

  canvas.on("mouse:up", onMouseUp);
}

export default CircleDraw;
