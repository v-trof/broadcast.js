(function() {

const socket_states = {
  DOWN: 0,
  UP: 1,
  DROPPED: 2
};

class Router extends Broadcast._src.Abstract_Router {
  constructor(host, server_url) {
    super(host);
    var self = this;
    this._socket_state = socket_states.DOWN;
    this._socket_adapter = new Broadcast._src.Socket_Adapter(server_url);
    this._socket_adapter.on.message = function(message) {
      self.parse_message(message);
    }; // possible scoping issue
    this._socket_adapter.on.open = function(event) {
      self.get_init_data(); // handshake
    };
    // this._socket_adapter.on.closed = function() {};
  }

  route_message(message) {
    this._host.post(message.channel_name, message);
  }

  send_message(message) {
    if (message.origin === this._host.origin
       && this._socket_state == socket_states.UP) {
      this._socket_adapter.send(message);
    }
  }

  get_init_data() {
    var request = new Broadcast._src.Internal_Event('init', null, this._host);
    this._socket_adapter.send(request);
  }

  set_relevancy(channel_name, toggle) {
    var request = new Broadcast._src.Internal_Event('relevancy', {
      channel: channel_name,
      relevancy: toggle
    }, this._host);
    this._socket_adapter.send(request);
  }

}

Broadcast._src.Router = Router;
Broadcast._src.Router.init = function(host, server_url) {
  var instance = new Router(host, server_url);
  instance.on.init = function(host, value) {
      /* doesn't work after timestamp system removal
      host._set_upstart(value.upstart); */
      host.origin = value.origin;
      host._router._socket_state = socket_states.UP;
  };
  instance.on.history_sync = function(host, value) {
      host._channels[value.channel_name].history.sync(value.messages);
  };
  return instance;
}
} ());
