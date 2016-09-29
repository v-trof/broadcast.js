var Broadcast = (function() {

  class Broadcast {
    constructor(max_failures=5) {
      this._channels = {};
      this.max_failures = max_failures;
      this._time = {
        upstart: new Date() //actually request
      };
      this._socket_adapter = new Broadcast._src.SocketAdapter(this);
      this._router = Broadcast._src.Router.init(this, this._socket_adapter);
      this._socket_adapter._set_router = this._router;
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
      this._channels[channel_name].edit(props);
    }

    post(channel_name, value) {
      if( ! this._channels[channel_name]) {
        this._create_channel(channel_name);
      }

      var to_send;
      if(value instanceof Broadcast._src.Message) {
        to_send = value;
      } else {
        to_send = new Broadcast._src.Message(value, this, channel_name);
      }
      if (this._channels[channel_name].scope === 'global') {
        this._router.send_message(to_send);
      }
      return this._channels[channel_name].post(to_send);
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
} ());
