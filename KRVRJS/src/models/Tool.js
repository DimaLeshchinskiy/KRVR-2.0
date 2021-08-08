export class Tool {
  constructor(type) {
    this._id = Date.now();
    this._name = null;
    this._type = type;
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

  set id(id) {
    this._id = id;
  }

  get type() {
    return this._type;
  }
}

export class ToolSquareEndMills extends Tool {
  constructor() {
    super("square_end_mills");

    this._diameter = null;
    this._lengthOfCut = null;
  }

  get diametr() {
    return this._diameter;
  }

  set diametr(diametr) {
    this._diameter = diametr;
  }

  get lengthOfCut() {
    return this._lengthOfCut;
  }

  set lengthOfCut(lengthOfCut) {
    this._lengthOfCut = lengthOfCut;
  }
}
