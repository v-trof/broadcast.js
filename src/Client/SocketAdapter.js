(function() {

class Socket_Adapter {
  constructor(server_url) {
    if( ! server_url) {
      return console.error('CANNOT CREATE SOCKET WITH NO URL');
    }

    this._ws_url = server_url;
    this.socket = new WebSocket(server_url);

    this.on = {};

    var self = this;

    this.socket.onopen = function(event) {
      self.on.open();
    }

    this.socket.onclose = function(event) {
      if ( ! event.wasClean) {
        self.on.drop();
      }

      self.on.close();
    }

    this.socket.onmessage = function(event) {
      //file manipulation
      var message = event.data;
      self.on.message(message);
    }

    this.socket.onerror = function(error) {
      self.on.error(error);
    }
  }

  send(message) {
    //file manipulation
    this.socket.send(message);
  }

}

Broadcast._src.Socket_Adapter = Socket_Adapter;
} ());
