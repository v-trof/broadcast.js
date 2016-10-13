(function () {
class Channel {
  constructor(scope, name, host, max_failures, max_history) {
    this._subscribers = [];
    this.scope = scope;
    this._host = host;
    this.max_failures = max_failures;
    this._name = name;
    this.history = new Broadcast._src.History(this, max_history);
  }

  edit(properties) {
    for(var key in properties) {
      if(key.match(/^_/)) {
        return console.error('private properties of a channel are not editable');
      }
      if(key === 'max_history') {
        var old_history = this.history.all();
        this.history = new Broadcast._src.History(this, properties[key]);
        this.history.sync(old_history);
      } else {
        if(this.hasOwnProperty(key)) {
          this[key] = properties[key];
        } else {
          return console.error('non-existing properties of a channel are not editable');
        }
      }
    }
  }

  //subscriber methods
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    var id;
    if(typeof subscriber === 'number') {
      //it is id of subscriber object, fine
      id = subscriber;
    } else {
      //find subscriber id
      id = this._subscribers.indexOf(subscriber);
    }

    if(id > -1) {
      this._subscribers.splice(id, 1);
    }
  }

  //messaging methods
  post(message) {
    this.history.add(message);
    for(var current = 0; current < this._subscribers.length; current++) {
      var subscriber = this._subscribers[current];
      try {
        subscriber.react(message.value, message);
      } catch (err) {
        //no reason to keep dead subscribers
        console.error(
          "subscriber:", subscriber,
          "\n channel:", this,
          "\n\n error:", err);
        subscriber.failures++;
        if(subscriber.failures > this.max_failures) {
          this.unsubscribe(current);
        }
      }
    }
    return message;
  }
}

Broadcast._src.Channel = Channel;
} ());
