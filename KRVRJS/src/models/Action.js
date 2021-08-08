class Action {
  constructor() {
    this._id = Date.now();
    this._title = null;
    this._fields = [];
    this._type = null;
  }

  get title() {
    return this._title;
  }

  set title(newtitle) {
    this._title = newtitle;
  }

  get id() {
    return this._id;
  }

  get fields() {
    return this._fields;
  }

  set fields(newfields) {
    this._fields = newfields;
  }

  get type() {
    return this._type;
  }

  set type(newtype) {
    this._type = newtype;
  }
}

export default Action;
