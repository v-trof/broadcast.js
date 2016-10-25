(function() {

class Abstract_Router {
  constructor(host) {
    this._host = host;
    this.on = {};
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
    var route = this.on[message.event_type];
    try {
      return route(this._host, message.value);
    } catch (err) {
      console.error('broken route for ' + message.event_type);
    }
  }
}

Broadcast._src.Abstract_Router = Abstract_Router;
} ());
