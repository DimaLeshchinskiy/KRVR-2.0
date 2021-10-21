import { fabric } from "fabric";

function RectDraw(canvas, options) {
  var rect, isDown, origX, origY;

  const onMouseMove = (o) => {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);

    if (origX > pointer.x) {
      rect.set({ left: Math.abs(pointer.x) });
    }
    if (origY > pointer.y) {
      rect.set({ top: Math.abs(pointer.y) });
    }

    rect.set({ width: Math.abs(origX - pointer.x) });
    rect.set({ height: Math.abs(origY - pointer.y) });

    canvas.renderAll();
  };

  const onMouseDown = (o) => {
    isDown = true;
    var pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    var pointer = canvas.getPointer(o.e);
    rect = new fabric.Rect({
      left: origX,
      top: origY,
      originX: "left",
      originY: "top",
      width: pointer.x - origX,
      height: pointer.y - origY,
      angle: 0,
      stroke: "black",
      strokeWidth: options.strokeWidth,
      fill: "rgba(0,0,0,0)",
    });
    canvas.add(rect);
  };

  const onMouseUp = (o) => {
    isDown = false;
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:up", onMouseUp);
    options.onDrawRect();
  };

  canvas.isDrawingMode = false;
  canvas.selection = false;

  canvas.on("mouse:down", onMouseDown);

  canvas.on("mouse:move", onMouseMove);

  canvas.on("mouse:up", onMouseUp);
}

export default RectDraw;
