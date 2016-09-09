class Channel {
  constructor(scope, name, host, max_failures) {
    this._subscribers = [];
    this.scope = scope;
    this._host = host;
    this.max_failures = max_failures;
    this._name = name;
    this.history = new History(this);
  }

  //subscriber methods
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    if(typeof subscriber === 'number') {
      //it is id of subscriber object, fine
      var id = subscriber;
    } else {
      //find subscriber id
      var id = this._subscribers.indexOf(subscriber);
    }

    if(id > -1) {
      this._subscribers.splice(id, 1);
    }
  }

  //messaging methods
  post(value) {
    var message = new Message(value, this._host);

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
    };
    return message;
  }
}
