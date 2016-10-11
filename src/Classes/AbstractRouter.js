(function() {
  class Abstract_Router {
    constructor(host) {
      this._host = host;
      this._routes = {};
    }

    on(event_type, callback) {
      if (typeof callback === 'function') {
        this._routes[event_type] = callback;
      } else {
        console.error('callback parameter should be a type of Function');
      }
      return this;
    }

    route_event(message) {
      var route = this._routes[message.event_type];
      try {
        return route(this._host, message.value);
      } catch (err) {
        console.error('broken route for ' + message.event_type);
      }
    }
  }

Broadcast._src.Abstract_Router = Abstract_Router;
} ());
