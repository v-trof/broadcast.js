var Broadcast = (function() {

  class Broadcast {
    constructor(max_failures=5) {
      this._channels = {}
      this._id_generator = new Id_generator();
      this.max_failures = max_failures;
    }

    //Channel methods

    create_channel(channel_name, scope='local', max_failures=this.max_failures) {
      this._channels[channel_name] = new Channel(scope, channel_name, this, max_failures);
      return this._channels[channel_name];
    }

    post(channel_name, value) {
      return this._channels[channel_name].post(value);
    }

    //subscriber methods

    subscribe(channel_name, reaction) {
      var subscriber = new Subscriber(reaction);
      this._channels[channel_name].subscribe(subscriber);
      return subscriber;
    }
  }
  return Broadcast;
})();
