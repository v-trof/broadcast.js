(function() {

class Router extends Broadcast._src.Abstract_Router {
  constructor(host) {
    super(host);
    this._socket_adapter = new Broadcast._src.Socket_Adapter(this, server_url);
    this._сhannels = {}; // holds lists of subscribers for every channel
    /* the format is:
    * channel: [Socket, Socket, Socket...] */
  }

  route_message(message) {
    this._host.post(message.channel_name, message);
    // this works fine
  }

  send_message(message) {
    if (message.origin === this._host.origin) {
      this._socket_adapter.send(message);
      /* the real implementation should be different (either utilizing
       this._channels or passing different parameters to send() function */
    }
  }


Broadcast._src.Router = Router;
Broadcast._src.Router.init = function(host, server_url) {
  var instance = new Router(host, server_url);
  // decorator function
  return instance;
}
} ());
