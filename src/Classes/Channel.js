class Channel {
  constructor(scope, name, host, max_failures) {
    this._subscribers = [];
    this.scope = scope;
    this._host = host;
    this._max_failures = max_failures;
    this._name = name;
  }

  //subscriber methods
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }

  //messaging methods
  post(value) {
    var message = new Message(value);


    for(var current = 0; current < this._subscribers.length; current++){
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
        if(subscriber.failures > this._max_failures) {
          this._subscribers.splice(current, 1);
        }
      }
    };
  }
}
