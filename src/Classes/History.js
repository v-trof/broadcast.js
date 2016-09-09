class History {
  constructor(host) {
    this._values = [];
    this._host = host;
  }

  /**
   * return all values since message(including it)
   * @method since
   * @param  {Message} message message to start with
   * @return {Message[]} Array of messages since that one
   */
  since(message) {
    var id = this._values.indexOf(message);
    if(id == -1) {
      console.error('Message', message, 'has`t been posted to ', this._host, 'latelty.');
      return [];
    }
    else {
      return this._values.slice(id);
    }
  }

  /**
   * Returns whole history of channel
   * @method all
   * @return {Message[]} [description]
   */
  all() {
    return this._values.slice()
  }

  /**
   * Adds message to channel history
   * @method add
   * @param  {Message} message message to add
   */
  add(message) {
    //TODO look at timestamps
    this._values.push(message);
  }

  sync() {}
}
