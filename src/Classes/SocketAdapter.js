(function() {
class SocketAdapter {
  constructor(host){
    this._host = host;
    this._router = null;
  }

  _set_router(router){
    if (router instanceof Broadcast._src.Router) {
      this._router = router;
    } else {
      throw new TypeError('router is not an instance of Broadcast._src.Router');
    }
  }

  send(message) {
    console.log('skel implementation of send(message) has been called');
  }
  // TODO: implement the SocketAdapter
}

Broadcast._src.SocketAdapter = SocketAdapter;
} ());
