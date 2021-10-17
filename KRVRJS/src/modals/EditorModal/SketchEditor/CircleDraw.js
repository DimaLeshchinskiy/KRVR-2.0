import { fabric } from "fabric";

function CircleDraw(canvas, onDrawCircle) {
  var ellipse, isDown, origX, origY;

  const onMouseMove = (o) => {
    if (!isDown) {
      return;
    }

    var pointer = canvas.getPointer(o.e);

    if (origX > pointer.x) {
      ellipse.set({
        left: Math.abs(pointer.x),
      });
    }

    if (origY > pointer.y) {
      ellipse.set({
        top: Math.abs(pointer.y),
      });
    }

    ellipse.set({
      rx: Math.abs(origX - pointer.x) / 2,
    });
    ellipse.set({
      ry: Math.abs(origY - pointer.y) / 2,
    });
    ellipse.setCoords();
    canvas.renderAll();
  };

  const onMouseDown = (o) => {
    isDown = true;
    let pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;

    ellipse = new fabric.Ellipse({
      top: origY,
      left: origX,
      rx: 0,
      ry: 0,
      stroke: "black",
      strokeWidth: 5,
      fill: "rgba(0,0,0,0)",
    });

    canvas.add(ellipse);
  };

  const onMouseUp = (o) => {
    isDown = false;
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:up", onMouseUp);
    onDrawCircle();
  };

  canvas.isDrawingMode = false;
  canvas.selection = false;

  canvas.on("mouse:down", onMouseDown);

  canvas.on("mouse:move", onMouseMove);

  canvas.on("mouse:up", onMouseUp);
}

export default CircleDraw;
