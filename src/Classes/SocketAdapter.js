(function() {
class SocketAdapter {
  constructor(router){
    this._router = router;
  }

  send(message) {
    console.log('skel implementation of send(message) has been called');
  }
  // TODO: implement the SocketAdapter
}

Broadcast._src.SocketAdapter = SocketAdapter;
} ());
