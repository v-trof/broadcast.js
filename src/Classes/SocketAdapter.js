(function() {

class Socket_Adapter {
  constructor(reciever, server_url) {
    this._ws_url = server_url;
    this.socket = new WebSocket(server_url);

    this.socket.onopen = function() {
      var event = new Internal_Event()
      reciever()
    }
  }

  send(message) {
    console.log('skel implementation of send(message) has been called');
  }

}

Broadcast._src.Socket_Adapter = Socket_Adapter;
} ());
