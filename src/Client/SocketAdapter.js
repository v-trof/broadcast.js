(function() {

class Socket_Adapter {
  constructor(server_url) {
    console.log(server_url);
    if( ! server_url) {
      return console.error('CANNOT CREATE SOCKET WITH NO URL');
    }

    this._ws_url = server_url;
    this.socket = new WebSocket(server_url);

    this.on = {};

    var self = this;

    this.socket.onopen = function(event) {
      var message = new Internal_Event('open', event, this);
      self.on.open(message);
    }

    this.socket.onclose = function(event) {
      if (event.wasClean) {
        var message = new Internal_Event('closed', event, this);
      } else {
        var message = new Internal_Event('drop', event, this);
      }

      self.on.close(message);
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
