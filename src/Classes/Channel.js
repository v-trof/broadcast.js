class Channel {
  constructor(scope, host) {
    this._subscribers = {};
    this.scope = scope;
    this._host = host;
  }

  //subscriber methods
  subscribe(subscriber) {
    this._subscribers[subscriber.id] = subscriber;
  }

  //messaging methods
  post(value) {
    var message = new Message(value);

    for(var id in this._subscribers) {
      try {
        this._subscribers[id].react(message.value);
      } catch (err) {
        this._host.report(id, err);
      }
    }
  }
}
