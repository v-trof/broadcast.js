var Broadcast = (function() {

  class Broadcast {
    constructor(max_failures=5) {
      this._channels = {}
      this._id_generator = new Id_generator();
      this.max_failures = max_failures;
      this._time = {
        upstart: new Date()
      }
    }

    //Channel methods
    _create_channel(channel_name, scope='local', max_failures=this.max_failures) {
      this._channels[channel_name] = new Channel(scope, channel_name, this, max_failures);
      return this._channels[channel_name];
    }

    _delete_channel(channel_name) {
      delete this._channels[channel_name];
    }

    edit_channel(channel_name, props) {
      for(var key in props) {
        this._channels[channel_name][key] = props[key];
      }
    }

    post(channel_name, value) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      return this._channels[channel_name].post(value);
    }

    //subscriber methods

    subscribe(channel_name, reaction) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      var subscriber = new Subscriber(reaction);
      this._channels[channel_name].subscribe(subscriber);
      return subscriber;
    }

    unsubscribe(channel_name, subscriber) {
      this._channels[channel_name].unsubscribe(subscriber);
    }

    //utility methods
    get_time() {
      return (new Date() - this._time.upstart);
    }
  }
  return Broadcast;
})();
