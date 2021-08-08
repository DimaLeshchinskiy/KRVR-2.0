class Material {
  constructor() {
    this._id = Date.now();
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._width = 0;
    this._height = 0;
    this._depth = 0;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }

  get z() {
    return this._z;
  }

  set z(z) {
    this._z = z;
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
  }

  get depth() {
    return this._depth;
  }

  set depth(depth) {
    this._depth = depth;
  }
}

export default Material;
