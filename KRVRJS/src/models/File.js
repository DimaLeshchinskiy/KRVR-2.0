class File {
  constructor() {
    this._id = Date.now();
    this._name = null;
    this._size = null;
    this._file = null;
    this._millingActions = [];
    this._material = null;
    this._position = { x: 0, y: 0, z: 0 };
    this._rotation = { x: 0, y: 0, z: 0 };
    this._scale = { x: 0, y: 0, z: 0 };
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }

  get id() {
    return this._id;
  }

  get file() {
    return this._file;
  }

  set file(newfile) {
    this._file = newfile;
  }

  get size() {
    return this._size;
  }

  set size(newsize) {
    this._size = newsize;
  }

  get millingActions() {
    return this._millingActions;
  }

  set millingActions(millingActions) {
    this._millingActions = millingActions;
  }

  get material() {
    return this._material;
  }

  set material(material) {
    this._material = material;
  }

  get position() {
    return this._position;
  }

  set position(position) {
    this._position = position;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(rotation) {
    this._rotation = rotation;
  }

  get scale() {
    return this._scale;
  }

  set scale(scale) {
    this._scale = scale;
  }

  ext() {
    return this._name.split(".").pop();
  }
}

export default File;
