(function () {
class History {
  constructor(host, max_length) {
    this._messages = [];
    this._host = host;
    this._max_length = max_length;
  }

  /**
   * return all values since message(including it)
   * @method since
   * @param  {Message} message message to start with
   * @return {Message[]} Array of messages since that one
   */
  since(message) {
    var id = this._messages.indexOf(message);
    if(id == -1) {
      console.error('Message', message, 'hasn`t been posted to ', this._host, 'lately.');
      return [];
    }
    else {
      return this._messages.slice(id);
    }
  }

  /**
   * Returns whole history of channel
   * @method all
   * @return {Message[]} [description]
   */
  all() {
    return this._messages.slice()
  }

  /**
   * Adds message to channel history
   * @method add
   * @param  {Message} message message to add
   */
  add(message) {
    this._messages.push(message);
    if (this._messages.length > this._max_length) {
      this._messages.shift();
    }
  }

  sync(messages) {
    this._messages.push.apply(this._messages, messages);
    // sort by timestamps
    this._messages.sort(function(x, y) {
      return x.time > y.time;
    });
    if (this._messages.length > this._max_length) {
      this._messages.splice(0, (this._messages.length - this._max_length));
    }
  }
}

Broadcast._src.History = History;
} ());
