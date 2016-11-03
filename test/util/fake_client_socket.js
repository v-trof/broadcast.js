(function() {

class Socket_Adapter {
  constructor(lag = 0) {
    this.on = {};

    this.fake_open();
  }

  send(message) {
    //nothing at all
  }

  fake_open() {
    setTimeout(() => {
      var message = new Internal_Event('open', event, this);
      this.on.open(message)
    }, lag);
  }

  fake_error(error) {
    setTimeout(() => {
      this.on.error(error);
    }, lag);
  }

  fake_drop() {
    setTimeout(() => {
      var message = new Internal_Event('drop', event, this);
      this.on.drop(message);
    }, lag);
  }

  fake_message(message) {
    setTimeout(() => {
      this.on.error(error);
    }, message);
  }
}

Broadcast._src.Socket_Adapter = Socket_Adapter;
} ());
