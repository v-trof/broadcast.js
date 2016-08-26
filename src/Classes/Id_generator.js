class Id_generator {
  constructor() {
    this._last_id = 0;
  }
  new() {
    this._last_id++;
    return this._last_id;
  }
}
