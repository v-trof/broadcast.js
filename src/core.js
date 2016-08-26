var Broadcast = (function() {

  /**
   * Sets default value or keeps it if variable was defined
   * @method define
   * @param  {any} value initial value
   * @param  {any} default_value fallback
   * @return {any} default | undefined
   */
  function define(value, default_value) {
    if(typeof value === 'undefined') {
      return default_value;
    } else {
      return value;
    }
  }

  class Broadcast {
    constructor(max_failures) {
      this._channels = {}
      this._id_generator = new Id_generator();
      this.max_failures = define(max_failures, 0);
    }

    //Channel methods

    create_channel(channel_name, scope, max_failures) {
      scope = define(scope, 'local');
      max_failures = define(max_failures, this.max_failures);
      this._channels[channel_name] = new Channel(scope, channel_name, this, max_failures);
    }

    post(channel_name, value) {
      this._channels[channel_name].post(value);
    }

    //subscriber methods

    subscribe(channel_name, reaction) {
      var subscriber = new Subscriber(reaction);
      this._channels[channel_name].subscribe(subscriber);
    }
  }
  return Broadcast;
})();
