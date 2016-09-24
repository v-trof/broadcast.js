(function() {

class Router {
  constructor(host, socket_adapter) {
    this._host = host;
    this._socket_adapter = socket_adapter;
    this._routes = {};
  }

  // TODO: REWRITE
  parse_message(message) {
    if (! (message instanceof Broadcast._src.Message)) {
      console.error('message parameter should be an instance of Message class');
    } else if (message instanceof Broadcast._src.InternalEvent){
      this.route_event(message);
    } else {
      this.route_message(message);
    }
  }

  route_event(message) {
    var callback = this._routes[message.type];
    try {
      callback(this._host, message.value);
    } catch (err) {
      console.error('broken route for ' + message.type);
    }
  }

  route_message(message) {
    this._host.post(message.channel_name, message);
  }

  on(event_type, callback) {
    if (typeof callback === 'function') {
      this._routes[event_type] = callback;
    } else {
      console.error('callback parameter should be a type of Function');
    }
    return this;
  }

  get_init_data() {
    var request = new Broadcast._src.InternalEvent('init', null, this._host);
    this._socket_adapter.send(request);
  }

  set_relevancy(channel_name, toggle) {
    var request = new Broadcast._src.InternalEvent('relevancy', {
      channel: channel_name,
      relevancy: toggle
    }, this._host);
    this._socket_adapter.send(request);
  }

}

Broadcast._src.Router = Router;
Broadcast._src.Router.init = function(host) {
  instance = new Router(host)
  instance
    .on('init', function(host, value) {
      host._set_upstart(value.upstart);
      host.origin = value.origin;
    })
    .on('history_sync', function(host, value){
      host._channels[value.channel_name].history.sync(value.messages);
    });
  return instance;
}
} ());
