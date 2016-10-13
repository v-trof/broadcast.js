(function() {

class Router {
  constructor(host) {
    this._host = host;
    this._socket_adapter = new Broadcast._src.Socket_Adapter(this, server_url);
    this._routes = {};
  }

  parse_message(message) {
    if (message instanceof Broadcast._src.Internal_Event){
      this.route_event(message);
    } else if (message instanceof Broadcast._src.Message){
      this.route_message(message);
    } else {
      console.error('message parameter should be an instance of Message class');
    }
  }

  route_event(message) {
    var route = this._routes[message.event_type];
    try {
      return route(this._host, message.value);
    } catch (err) {
      console.error('broken route for ' + message.event_type);
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

  send_message(message) {
    if (message.origin === this._host.origin) {
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
Broadcast._src.Router.init = function(host, socket_adapter) {
  var instance = new Router(host, socket_adapter)
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
