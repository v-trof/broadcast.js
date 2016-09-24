var Broadcast = (function() {

  class Broadcast {
    constructor(max_failures=5) {
      this._channels = {};
      this.max_failures = max_failures;
      this._time = {
        upstart: new Date() //actually request
      };
      this._router = Broadcast._src.Router.init(this);
      this.origin = 0; //actually request
    }

    //Channel methods
    _create_channel(channel_name, scope='local', max_history=100, max_failures=this.max_failures) {
      this._channels[channel_name] = new Broadcast._src.Channel(scope, channel_name, this, max_failures, max_history);
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

      if(value instanceof Broadcast._src.Message) {
        return this._channels[channel_name].post(value);
      } else {
        return this._channels[channel_name].post_value(value);
      }

    }

    //subscriber methods

    subscribe(channel_name, reaction) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      var subscriber = new Broadcast._src.Subscriber(reaction);
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

    _set_upstart(value) {
      this._time.upstart = value;
    }
  }

  Broadcast._src = {};
  return Broadcast;
})();
